import * as vscode from "vscode";
import LocatableEntityParser from "./LocatableEntityParser";
import Source from "../Source";
import VariableEntity from "./VariableEntity";
import RtmWorkspace from "../RtmWorkspace";

export default class VariableEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) {}

  locatableEntityParser = new LocatableEntityParser(this.rtmWorkspace);

  parse(
    source: Source,
    code: string,
    offset: number,
  ): VariableEntity[] {
    let entities: VariableEntity[] = [];
    const groupEntities = this.locatableEntityParser.parse(
      VariableEntity,
      /([A-Z][A-Z0-9\.]+)\s*((?:=\s*[A-Z0-9\.]+\s+)?\[[\s\S]*?\](?:\s*\*\s*\d+)*)/gm,
      source,
      code,
      offset,
      1,
      vscode.SymbolKind.Struct,
      (entity, match) => {
        entity.editMask = match[2].replace(/[\t ]/g, "");
      }
    );
    entities.push(...groupEntities);
    const variableEntities = this.locatableEntityParser.parse(
      VariableEntity,
      /([A-Z][A-Z0-9\.]+)\s*((?:=\s*[A-Z0-9\.]+\s+)?(?:[AX]\d+\b|C\^[\s\S]*?\^\^|D[AUEFDMYNHBL]+\b|[NUSFZ][BLP\-]*\d+(?:\.\d+)?\b|\'[A-Z0-9\.]+)(?:\s*\*\s*\d+)*)/gm,
      source,
      code,
      offset,
      1,
      vscode.SymbolKind.Variable,
      (entity, match) => {
        entity.editMask = match[2].replace(/[\t ]/g, "");
      }
    );
    entities.push(...variableEntities);
    return entities;
  }

}
