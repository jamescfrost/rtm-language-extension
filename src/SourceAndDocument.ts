import * as vscode from "vscode";
import SourceEntity from "./Entities/SourceEntity";


export class SourceAndDocument {
  source: SourceEntity;
  document: vscode.TextDocument;

  constructor(source: SourceEntity, document: vscode.TextDocument) {
    this.source = source;
    this.document = document;
  }
}
