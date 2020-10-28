import * as vscode from "vscode";
import Entity from "./Entity";
import Source from "../Source";

export default class EntityParser {

  parse<T extends Entity>(
    entityClass: { new(): T },
    regexp: RegExp,
    source: Source,
    code: string,
    nameMatchIndex: number,
    kind: vscode.SymbolKind,
    applyExtendedFields?: (entity: T, match: RegExpExecArray) => void
  ): T[] {
    const entities: T[] = [];
    let match: RegExpExecArray | null;
    while ((match = regexp.exec(code)) != null) {
      if (match !== null) {
        var entity = new entityClass();
        entity.name = match[nameMatchIndex];        
//        entity.uri = source.uri;
        entity.kind = kind;
        if (applyExtendedFields)
          applyExtendedFields(entity, match);
        entities.push(entity);
      }
    }
    return entities;
  }

}
