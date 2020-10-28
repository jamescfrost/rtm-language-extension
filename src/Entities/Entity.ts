import * as vscode from "vscode";
import Selection from "../Selection";

export default abstract class Entity {

  name: string;
  kind: vscode.SymbolKind;
  sourceName: string;
  selection: Selection;
  nameSelection: Selection;
 
  abstract getDetail(): string;
}

