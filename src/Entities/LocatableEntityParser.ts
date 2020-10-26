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
        const fullMatch = match[0];
        let matchOffset = offset + match.index;
        entity.selection = new Selection(matchOffset, fullMatch.length);
        if (source.includes) {
          for (const include of source.includes) {
            const includable = this.rtmWorkspace.findIncludable(include);
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
              entity.selection = new Selection(
                includableSelection.start + intersection.start,
                intersection.length
              );
              break;
            } else if (entity.selection.intersection(includableSelection)) {
              entity.selection = new Selection(
                matchOffset,
                entity.selection.length -
                includableSelection.length +
                include.selection.length
              );
            } else if (entity.selection.after(includableSelection)) {
              matchOffset =
                matchOffset -
                includableSelection.length +
                include.selection.length;
            }
          }
        }
        entity.name = match[nameMatchIndex];
        const nameSelectionStart =
          fullMatch.indexOf(entity.name) + entity.selection.start;
        entity.nameSelection = new Selection(nameSelectionStart, entity.name.length);
        if (applyExtendedFields)
          applyExtendedFields(entity, match);
        entities.push(entity);
      }
    }
    return entities;
  }
}
