import * as vscode from "vscode";
import Source from "../Source";
import IncludeEntity from "./IncludeEntity";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";

export class IncludeEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  locatableEntityParser = new EntityParser(this.rtmWorkspace);

  parse(source: Source, code: string, offset: number): IncludeEntity[] {
    const entities = this.locatableEntityParser.parse(
      IncludeEntity,
      /^\$INCLUDE\s+(\*|[A-Z0-9_-]+)\s*\(([A-Z0-9\.]+)\).*/gm,
      source,
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
