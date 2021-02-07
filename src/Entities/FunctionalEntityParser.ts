import * as vscode from "vscode";
import FunctionalEntity from "./FunctionalEntity";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";
import SourceEntity from "./SourceEntity";
import Entity from "./Entity";

export default class FunctionalEntityParser {

  constructor(private rtmWorkspace: RtmWorkspace) { }

  private entityParser = new EntityParser(this.rtmWorkspace);

  parse<T extends FunctionalEntity>(
    entityClass: { new(): T },
    regexp: RegExp,
    source: SourceEntity,
    owner: Entity,
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
      owner,
      code,
      offset,
      nameMatchIndex,
      kind,
      (entity, match) => {
        var combinedParameters = match[2].replace(/\s/g, "").trim();
        if (combinedParameters != "")
          entity.parameters = combinedParameters.split(",");
        else 
          entity.parameters = [];
        if (applyExtendedFields)
          applyExtendedFields(entity, match);
      }
    );
    return entities;
  }
}
