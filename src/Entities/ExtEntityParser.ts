import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";
import Entity from "./Entity";
import EntityParser from "./EntityParser";
import ExtEntity from "./ExtEntity";
import SourceEntity from "./SourceEntity";

export default class ExtEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  entityParser = new EntityParser(this.rtmWorkspace);

  parse(source: SourceEntity, owner: Entity, code: string, offset: number): ExtEntity[] {
    const entities = this.entityParser.parse(
      ExtEntity,
      /([A-Z0-9\.]+)/gm,
      source,
      owner,
      code,
      offset,
      1,
      vscode.SymbolKind.Function,
      (entity, match) => {
      }
    );
    return entities;
  }

}
