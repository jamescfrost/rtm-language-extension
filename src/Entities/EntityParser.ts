import * as vscode from "vscode";
import Entity from "./Entity";
import Source from "../Source";
import Selection from "../Selection";
import RtmWorkspace from "../RtmWorkspace";

export default class EntityParser {
  constructor(protected rtmWorkspace: RtmWorkspace) {}

  parse<T extends Entity>(
    entityClass: { new (): T },
    regexp: RegExp,
    source: Source,
    code: string,
    offset: number,
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
        entity.kind = kind;
        entity.sourceName = source.name;
        entity.selection = new Selection(offset + match.index, match[0].length);
        if (source.includes) {
          for (const include of source.includes) {
            const includebleSource =
              include.includableSourceName == "*"
                ? source
                : this.rtmWorkspace.sources.find(
                    (s) => s.name == include.includableSourceName
                  );
            const includable = includebleSource?.includables.find(
              (i) => i.name == include.name
            );
            if (!includable) break;
            const includableSelection = new Selection(
              include.selection.start,
              includable.includeSelection.length
            );
            const intersection = includableSelection.intersection(
              entity.selection
            );
            if (intersection) {
              entity.sourceName = includable.sourceName;
              entity.selection.start =
                includable.includeSelection.start + intersection.start;
              entity.selection.length = intersection.length;
              continue;
            } else if (entity.selection.intersection(includableSelection)) {
              entity.selection.length -=
                includableSelection.length - include.selection.length;
            } else if (entity.selection.after(includableSelection)) {
              entity.selection.start -=
                includableSelection.length - include.selection.length;
            } else {
              break;
            }
          }
        }
        const nameSelectionStart =
          match[0].indexOf(entity.name) + entity.selection.start;
        entity.nameSelection = new Selection(
          nameSelectionStart,
          entity.name.length
        );
        if (applyExtendedFields) applyExtendedFields(entity, match);
        entities.push(entity);
      }
    }
    return entities;
  }
}
