export class AppError extends Error {
  constructor(message, code, originalError) {
    super(message)
    this.code = code
    this.originalError = originalError
    this.name = 'AppError'
  }
}
//# sourceMappingURL=types.js.map
