import * as vscode from "vscode";
import LocatableEntityParser from "./LocatableEntityParser";
import Source from "../Source";
import VariableEntity from "./VariableEntity";
import Selection from "../Selection";

export class VariableEntityParser extends LocatableEntityParser {
  
  parse(source: Source, code: string, offset: number): VariableEntity[] {
    const entities = this.internalParse(
      VariableEntity,
      /^Nothing/,
      source,
      code,
      1,
      offset,
      (entity, match) => {
        entity.editMask = match[2];
      }
    );
    return entities;
  }

}
