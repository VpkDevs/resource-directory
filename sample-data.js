/**
 * Sample resource data for MVP testing
 * This provides basic resource data to test the functionality
 */

export const SAMPLE_RESOURCES = [
  {
    id: 'theresanaiforthat',
    name: "There's An AI For That",
    description: 'Comprehensive directory of AI tools categorized by use case',
    url: 'https://theresanaiforthat.com',
    category: 'directories',
    tags: ['Directory', 'Free'],
    rating: 4.5,
    isVerified: true,
    pricing: 'Free',
    lastUpdated: new Date('2024-01-15').getTime()
  },
  {
    id: 'futurepedia',
    name: 'Futurepedia',
    description: 'Daily updated AI tools directory with reviews',
    url: 'https://futurepedia.io',
    category: 'directories',
    tags: ['Directory', 'Reviews'],
    rating: 4.3,
    isVerified: true,
    pricing: 'Free',
    lastUpdated: new Date('2024-01-10').getTime()
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s conversational AI model',
    url: 'https://chat.openai.com',
    category: 'models',
    tags: ['Chat', 'Free/Premium'],
    rating: 4.8,
    isVerified: true,
    pricing: 'Freemium',
    lastUpdated: new Date('2024-01-20').getTime()
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s advanced AI assistant',
    url: 'https://www.anthropic.com/claude',
    category: 'models',
    tags: ['Chat', 'Premium'],
    rating: 4.6,
    isVerified: true,
    pricing: 'Premium',
    lastUpdated: new Date('2024-01-18').getTime()
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Open-source AI model hub and development tools',
    url: 'https://huggingface.co',
    category: 'development',
    tags: ['Development', 'Open Source'],
    rating: 4.7,
    isVerified: true,
    pricing: 'Free',
    lastUpdated: new Date('2024-01-12').getTime()
  },
  {
    id: 'paperswithcode',
    name: 'Papers with Code',
    description: 'Machine learning papers with implemented code',
    url: 'https://paperswithcode.com',
    category: 'development',
    tags: ['Research', 'Code'],
    rating: 4.4,
    isVerified: true,
    pricing: 'Free',
    lastUpdated: new Date('2024-01-08').getTime()
  },
  {
    id: 'fastai',
    name: 'Fast.ai',
    description: 'Free courses on deep learning and AI',
    url: 'https://www.fast.ai',
    category: 'learning',
    tags: ['Education', 'Free'],
    rating: 4.9,
    isVerified: true,
    pricing: 'Free',
    lastUpdated: new Date('2024-01-05').getTime()
  },
  {
    id: 'deeplearningai',
    name: 'DeepLearning.AI',
    description: 'AI courses and specializations',
    url: 'https://www.deeplearning.ai',
    category: 'learning',
    tags: ['Education', 'Paid'],
    rating: 4.6,
    isVerified: true,
    pricing: 'Paid',
    lastUpdated: new Date('2024-01-03').getTime()
  }
];