export interface SnippetSetting {
  prefix: string
  body: string[]
  description: string
}

const log = {
  prefix: 'log!',
  body: ['console.log'],
  description: 'console.log',
}

const warn = {
  prefix: 'warn!',
  body: ['console.warn'],
  description: 'console.warn',
}
const err = {
  prefix: 'error!',
  body: ['console.error'],
  description: 'console.error',
}
const info = {
  prefix: 'info!',
  body: ['console.info'],
  description: 'console.info',
}

export const snippets = [log, warn, err, info]
