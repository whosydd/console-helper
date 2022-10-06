export interface SnippetSetting {
  prefix: string
  body: string[]
  description: string
}

const log = {
  prefix: 'log!',
  body: ['console.log'],
  description: 'console.log()',
}

const warn = {
  prefix: 'warn!',
  body: ['console.warn'],
  description: 'console.warn()',
}

const err = {
  prefix: 'error!',
  body: ['console.error'],
  description: 'console.error()',
}

const info = {
  prefix: 'info!',
  body: ['console.info'],
  description: 'console.info()',
}

const debug = {
  prefix: 'debug!',
  body: ['console.debug'],
  description: 'console.debug()',
}

const varDefine = {
  prefix: 'var!',
  body: ['var  = '],
  description: 'define variable',
}

const constDefine = {
  prefix: 'const!',
  body: ['const  = '],
  description: 'define variable',
}

const letDefine = {
  prefix: 'let!',
  body: ['let  = '],
  description: 'define variable',
}

export const snippets = [log, warn, err, info, debug, varDefine, constDefine, letDefine]
