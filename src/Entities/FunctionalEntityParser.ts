import * as vscode from "vscode";
import FunctionalEntity from "./FunctionalEntity";
import Source from "../Source";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";

export default class FunctionalEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  private entityParser = new EntityParser(this.rtmWorkspace);

  parse<T extends FunctionalEntity>(
    entityClass: { new(): T },
    regexp: RegExp,
    source: Source,
    code: string,
    offset: number,
    nameMatchIndex: number,
    kind: vscode.SymbolKind,
    applyExtendedFields?: (entity: T, match: RegExpExecArray) => void
  ): T[] {
    const entities = this.entityParser.parse(
      entityClass,
      regexp,
      source,
      code,
      offset,
      nameMatchIndex,
      kind,
      (entity, match) => {
        entity.parameters = match[2].replace(/\s/g, "").split(",");
        if (applyExtendedFields)
          applyExtendedFields(entity, match);
      }
    );
    return entities;
  }
}
