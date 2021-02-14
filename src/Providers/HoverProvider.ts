import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";

export class HoverProvider implements vscode.HoverProvider {
  constructor(private rtmWorkspace: RtmWorkspace) {}

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    if (this.rtmWorkspace.loading) 
      return new vscode.Hover("Loading ...");
    var entity = this.rtmWorkspace.provideEntity(document, position);
    if (entity) {
      const type = entity.getType();
      const detail = entity.getDetail();
      const mkd = new vscode.MarkdownString();
      mkd.appendText(type);
      mkd.appendText("\n");
      mkd.appendMarkdown("___");
      mkd.appendCodeblock(detail);
      return new vscode.Hover(mkd);
    } else {
      const wordRange = document.getWordRangeAtPosition(position);
      if (wordRange) {
        const word = document.getText(wordRange);
        const defaultFunction = this.rtmWorkspace.defaultFunctions.get(word);
        if (defaultFunction) {
          return new vscode.Hover(defaultFunction);
        }
      }
    }
    //return new vscode.Hover(`Unknown: ${word}`);
    return null;
  }
}
