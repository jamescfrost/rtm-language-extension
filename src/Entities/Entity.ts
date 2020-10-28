import * as vscode from "vscode";

export default abstract class Entity {

  name: string;
//  uri: vscode.Uri;
  kind: vscode.SymbolKind;

}

