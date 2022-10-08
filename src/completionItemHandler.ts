import * as vscode from 'vscode'
import { snippets } from './snippet'

export const provideCompletionItems = async (
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  ctx: vscode.CompletionContext
) => {
  // 获取配置项
  const pf = await vscode.workspace.getConfiguration('console-helper').get('prefix')

  // 获取需要操作的字符串
  const line = document.lineAt(position)
  const lineSlice = line.text.substring(0, position.character).split('.')
  lineSlice.pop()
  const lineText = lineSlice?.join('.')

  // 获取光标的初始位置
  const posStart = position.character - lineText.trimStart().length - 1

  if (ctx.triggerKind) {
    return snippets.map(snippet => {
      // vscode.CompletionItemKind 表示提示的类型
      const item = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet)
      // 描述
      item.documentation = snippet.description

      let newLineText: string

      // 判断是否有数组
      if (lineText.match(/\[.*\]/)) {
        newLineText = lineText
          .trim()
          .split(/[\[\]]/)
          .reduce((pre: string[], cur) => {
            if (cur) {
              if (cur.trim().endsWith(',') || cur.trim().startsWith(',')) {
                pre.push(cur)
              } else {
                // 转换数组格式
                pre.push(`[${cur.split(',').join('%%')}]`)
              }
            }
            return pre
          }, [])
          .join('')
      } else {
        newLineText = lineText.trim()
      }

      // format 代码片段
      const strReg = /[`'"]/
      const varReg = /\{['`"]|\(['`"]/
      const arrReg = /\[.*\]/

      let snp = newLineText.split(',').map(t => {
        let text = t.trim()
        // 转换数组格式
        if (text.match(arrReg)) {
          return text.replace(/%%/g, ',')
        }

        const label = item.label
        if (label === 'var!' || label === 'const!' || label === 'let!' || label === 'if!') {
          return text
        }

        if (text.match(varReg) || !text.match(strReg)) {
          if (pf === null) {
            text = text
          } else if (pf === '') {
            text = `"${text}:",${text}`
          } else {
            text = `"${pf}",${text}`
          }
        }
        return text
      })

      // // 判断代码片段类型
      const label = item.label

      if (label === 'if!') {
        item.detail = `${snippet.body[0]}${snp}${snippet.body[1]}`
      } else if (label === 'var!' || label === 'const!' || label === 'let!') {
        item.detail = `${snippet.body}${snp}`
      } else {
        item.detail = `${snippet.body}(${snp})`
      }
      item.command = {
        title: 'refactor',
        command: 'console-helper.refactor',
        arguments: [document, position, item, posStart],
      }

      return item
    })
  }
}

// 光标选中当前自动补全item时触发动作，一般情况下无需处理
export const resolveCompletionItem = (item: vscode.CompletionItem) => {
  return null
}
