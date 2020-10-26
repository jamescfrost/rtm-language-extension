
import * as vscode from "vscode";
import LocatableEntity from "./LocatableEntity";
import Selection from "../Selection";

export default class IncludeEntity extends LocatableEntity {
  
  includableSourceName: string;
  includableSelection: Selection;

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}