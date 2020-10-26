import * as vscode from "vscode";
import LocatableEntityParser from "./LocatableEntityParser";
import ProcedureEntity from "./ProcedureEntity";
import Source from "../Source";
import Selection from "../Selection";

export default class ProcedureEntityParser extends LocatableEntityParser {
  private regex: string = "";

  parse(source: Source, code: string, offset: number): ProcedureEntity[] {
    const entities = this.internalParse(
      ProcedureEntity,
      /^Nothing/,
      source,
      code,
      2,
      offset
    );
    return entities;
  }
}
