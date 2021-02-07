import * as vscode from "vscode";
import IncludeEntity from "./IncludeEntity";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";
import SourceEntity from "./SourceEntity";
import Entity from "./Entity";

export default class IncludeEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  entityParser = new EntityParser(this.rtmWorkspace);

  parse(source: SourceEntity, owner: Entity, code: string, offset: number): IncludeEntity[] {
    const entities = this.entityParser.parse(
      IncludeEntity,
      /^\$INCLUDE\s+(\*|[A-Z0-9_-]+)\s*\(([A-Z0-9\.]+)\).*/gm,
      source,
      owner,
      code,
      offset,
      2,
      vscode.SymbolKind.Package,
      (entity, match) => {
        let includableSourceName = match[1];
        if (includableSourceName != "*") {
          includableSourceName = includableSourceName.toUpperCase()
          includableSourceName = includableSourceName.endsWith(".RTM") ? includableSourceName : includableSourceName + ".RTM";
        }
        entity.includableSourceName = includableSourceName;
      }
    );
    return entities;
  }

}
