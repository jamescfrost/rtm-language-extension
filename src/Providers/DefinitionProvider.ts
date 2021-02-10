import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";

export class DefinitionProvider implements vscode.DefinitionProvider {
  constructor(private rtmWorkspace: RtmWorkspace) {}

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {
        var entity = this.rtmWorkspace.provideEntity(document, position);
        if (entity) {
            const source = this.rtmWorkspace.getSource(entity.sourceName);
            if (source) {
                //var targetDocument = (source.uri == document.uri) ? document : await vscode.workspace.openTextDocument(source.uri);
                var targetDocument = document;
                var startPos = targetDocument.positionAt(entity.selection.start);
                var endPos = targetDocument.positionAt(entity.selection.start + entity.selection.length);
                var range = new vscode.Range(startPos, endPos);
                var location = new vscode.Location(source.uri, range);
                return location;     
            }
        }
        return new vscode.Location(document.uri, position);
  }
}
