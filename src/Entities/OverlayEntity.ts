import * as vscode from "vscode";
import FunctionalEntity from "./FunctionalEntity";
import ProcedureEntity from "./ProcedureEntity";
import VariableEntity from "./VariableEntity";

export default class OverlayEntity extends FunctionalEntity {

  kind: vscode.SymbolKind = vscode.SymbolKind.Function;

  files: [];
  variables: VariableEntity[];
  procedures: ProcedureEntity[];

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}
