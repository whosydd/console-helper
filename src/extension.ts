import * as vscode from 'vscode'
import { provideCompletionItems, resolveCompletionItem } from './completionItemHandler'
import { refactorHandler } from './textEditorHandler'

export function activate(context: vscode.ExtensionContext) {
  let refactor = vscode.commands.registerTextEditorCommand(
    'console-helper.refactor',
    refactorHandler
  )

  let disposable = vscode.languages.registerCompletionItemProvider(
    ['html', 'javascript', 'javascriptreact', 'typescript', 'typescriptreact', 'vue'],
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
