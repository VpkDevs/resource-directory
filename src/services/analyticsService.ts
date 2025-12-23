export class PrivacyFirstAnalytics {
  private events: AnalyticsEvent[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30 seconds

  constructor() {
    this.setupPeriodicFlush()
    this.setupBeforeUnloadFlush()
  }

  track(event: string, properties: Record<string, any> = {}): void {
    // Hash sensitive data
    const sanitizedProperties = this.sanitizeProperties(properties)

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: sanitizedProperties,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getAnonymousUserId(),
    }

    this.events.push(analyticsEvent)

    if (this.events.length >= this.batchSize) {
      this.flush()
    }
  }

  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized = { ...properties }

    // Remove or hash PII
    delete sanitized.email
    delete sanitized.userId

    // Hash URLs to protect privacy
    if (sanitized.url) {
      sanitized.urlHash = this.hashString(sanitized.url)
      delete sanitized.url
    }

    return sanitized
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      await this.sendEvents(eventsToSend)
    } catch (error) {
      // Re-queue events on failure
      this.events.unshift(...eventsToSend)
      console.warn('Failed to send analytics events:', error)
    }
  }
}
