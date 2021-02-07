import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";
import Entity from "./Entity";
import EntityParser from "./EntityParser";
import FileEntity from "./FileEntity";
import SourceEntity from "./SourceEntity";

export default class FileEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  entityParser = new EntityParser(this.rtmWorkspace);

  parse(source: SourceEntity, owner: Entity, code: string, offset: number): FileEntity[] {
    const entities = this.entityParser.parse(
      FileEntity,
      /([A-Z0-9\.]+)/gm,
      source,
      owner,
      code,
      offset,
      1,
      vscode.SymbolKind.File,
      (entity, match) => {
      }
    );
    return entities;
  }

}
