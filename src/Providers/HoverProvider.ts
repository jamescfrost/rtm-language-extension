import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";

export class HoverProvider implements vscode.HoverProvider {
  constructor(private rtmWorkspace: RtmWorkspace) {}

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    if (this.rtmWorkspace.loading) 
      return new vscode.Hover("Loading ...");
    var entity = this.rtmWorkspace.provideEntity(document, position);
    if (entity) 
      return new vscode.Hover(entity.getDetail());
    //return new vscode.Hover(`Unknown: ${word}`);
    return null;
  }
}
