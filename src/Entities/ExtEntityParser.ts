import * as vscode from "vscode";
import Source from "../Source";
import IncludeEntity from "./IncludeEntity";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";
import ExtEntity from "./ExtEntity";

export default class ExtEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  entityParser = new EntityParser(this.rtmWorkspace);

  parse(source: Source, code: string, offset: number): ExtEntity[] {
    const entities = this.entityParser.parse(
      ExtEntity,
      /([A-Z0-9\.]+)/gm,
      source,
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
