import IncludableEntity from "./IncludableEntity";
import Source from "../Source";
import LocatableEntityParser from "./LocatableEntityParser";
import Selection from "../Selection";

export default class IncludableEntityParser extends LocatableEntityParser {

    parse(source: Source, code: string, offset: number): IncludableEntity[] {
        const entities = this.internalParse(
            IncludableEntity,
            /^\$NAME\s+([A-Z0-9\.]+\b)[\S\s]*?\n([\S\s]*?)(?=(?:\r\n|\n|\r)\$NAME\s+)/gm,
            source,
            code,
            1,
            offset,
            (entity, match) => {
                const fullMatch = match[0];
                const includeSelectionMatch = match[2];
                const includeSelectionStart = fullMatch.indexOf(includeSelectionMatch) + entity.selection.start;
                entity.includeSelection = new Selection(includeSelectionStart, includeSelectionMatch.length);
            }
        );
        return entities;
    }
}