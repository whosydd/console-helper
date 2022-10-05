// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { snippets } from './snippet'

export function activate(context: vscode.ExtensionContext) {
  function provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    ctx: vscode.CompletionContext
  ) {
    if (ctx.triggerKind) {
      const line = document.lineAt(position)
      // 只截取到光标位置为止，防止一些特殊情况
      const lineSlice = line.text.substring(0, position.character).split('.')
      lineSlice.pop()
      const lineText = lineSlice?.join('.')

      return snippets.map(snippet => {
        // vscode.CompletionItemKind 表示提示的类型
        const item = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet)
        item.documentation = snippet.description

        let newLineText: string
        // 判断是否有数组
        if (lineText.match(/\[.*\]/)) {
          newLineText = lineText
            .split(/[\[\]]/)
            .reduce((pre: string[], cur) => {
              if (cur) {
                if (cur.trim().endsWith(',') || cur.trim().startsWith(',')) {
                  pre.push(cur)
                } else {
                  pre.push(`[${cur.split(',').join('_')}]`)
                }
              }
              return pre
            }, [])
            .join('')
          console.log(newLineText)
        } else {
          newLineText = lineText
        }

        const snp = newLineText.split(',').map(text => {
          if (!text.match(/[`'"]/)) {
            if (text.match(/\(.*\)/) && !text.match(/\{.*\}/)) {
              text = `\`${text}: \${${text}}\``
            } else if (text.match(/[\[.*\]]/)) {
              text = `${text.replace(/_/g, ',')}`
            } else {
              text = `\`${text}: \${${text}}\``
            }
          } else {
            text = `${text}`
          }

          return text.trim()
        })

        item.detail = `${snippet.body}(${snp})`

        item.command = {
          title: 'refactor',
          command: 'console-helper.refactor',
          arguments: [document, position, item],
        }
        return item
      })
    }
  }

  // 光标选中当前自动补全item时触发动作，一般情况下无需处理
  function resolveCompletionItem(item: vscode.CompletionItem) {
    return null
  }

  let refactor = vscode.commands.registerTextEditorCommand(
    'console-helper.refactor',
    (
      editor: vscode.TextEditor,
      edit: vscode.TextEditorEdit,
      document: vscode.TextDocument,
      position: vscode.Position,
      item: vscode.CompletionItem
    ) => {
      const line = document.lineAt(position)
      edit.delete(line.range)
      if (typeof item.detail === 'string') {
        edit.insert(position.with(line.lineNumber, 0), item.detail)
      }
    }
  )

  let disposable = vscode.languages.registerCompletionItemProvider(
    [
      { language: 'javascript', scheme: 'file' },
      { language: 'typescript', scheme: 'file' },
    ],
    {
      provideCompletionItems,
      resolveCompletionItem,
    },
    '.'
  )

  context.subscriptions.push(refactor, disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
