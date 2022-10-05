import * as vscode from 'vscode'

export const refactorHandler = async (
  editor: vscode.TextEditor,
  edit: vscode.TextEditorEdit,
  document: vscode.TextDocument,
  position: vscode.Position,
  item: vscode.CompletionItem,
  posStart: number
) => {
  const lineNumber = document.lineAt(position).lineNumber
  const snippet: string = item.detail!

  // 删除内容
  edit.delete(
    new vscode.Range(
      position.with(lineNumber, posStart),
      position.with(lineNumber, posStart + snippet.length)
    )
  )

  // 插入代码片段
  edit.insert(position.with(editor.selection.start), snippet)

  // 移动光标
  if (item.label === 'var!' || item.label === 'const!' || item.label === 'let!') {
    console.log(snippet.length)
    console.log(posStart)
    console.log(item.label)

    await vscode.commands.executeCommand('cursorHome')
    await vscode.commands.executeCommand('cursorMove', {
      to: 'right',
      by: 'character',
      value: item.label === 'const!' ? posStart + 6 : posStart + 4,
    })
  }
}
