import EntityParser from "./EntityParser";
import LocatableEntity from "./LocatableEntity";
import Source from "../Source";
import Selection from "../Selection";
import RtmWorkspace from "../RtmWorkspace";

export default abstract class LocatableEntityParser extends EntityParser {
  constructor(protected rtmWorkspace: RtmWorkspace) {
    super();
  }

  internalParse<T extends LocatableEntity>(
    entityClass: { new(): T },
    regexp: RegExp,
    source: Source,
    code: string,
    nameMatchIndex: number,
    offset: number,
    applyExtendedFields?: (entity: T, match: RegExpExecArray) => void
  ): T[] {
    const entities: T[] = [];
    let match: RegExpExecArray | null;
    while ((match = regexp.exec(code)) != null) {
      if (match !== null) {
        var entity = new entityClass();
        entity.sourceName = source.name;
        entity.selection = new Selection(offset + match.index, match[0].length);
        if (source.includes) {
          for (const include of source.includes) {
            const includable = this.rtmWorkspace.findIncludable(include);
            if (!includable) 
              break;
            const includableSelection = new Selection(
              include.selection.start,
              includable.includeSelection.length
            );
            const intersection = includableSelection.intersection(
              entity.selection
            );
            if (intersection) {
              entity.sourceName = includable.sourceName;
              entity.selection.start = includableSelection.start + intersection.start;
              entity.selection.length = intersection.length;
              continue;
            } else if (entity.selection.intersection(includableSelection)) {
              entity.selection.length -= (includableSelection.length - include.selection.length);
            } else if (entity.selection.after(includableSelection)) {
              entity.selection.start -= (includableSelection.length - include.selection.length);
            } else {
              break;
            }
          }
        }
        entity.name = match[nameMatchIndex];
        const nameSelectionStart =
          match[0].indexOf(entity.name) + entity.selection.start;
        entity.nameSelection = new Selection(nameSelectionStart, entity.name.length);
        if (applyExtendedFields)
          applyExtendedFields(entity, match);
        entities.push(entity);
      }
    }
    return entities;
  }
}
