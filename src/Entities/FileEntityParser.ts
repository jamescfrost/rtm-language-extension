import * as vscode from "vscode";
import Source from "../Source";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";
import FileEntity from "./FileEntity";

export default class FileEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  entityParser = new EntityParser(this.rtmWorkspace);

  parse(source: Source, code: string, offset: number): FileEntity[] {
    const entities = this.entityParser.parse(
      FileEntity,
      /([A-Z0-9\.]+)/gm,
      source,
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
