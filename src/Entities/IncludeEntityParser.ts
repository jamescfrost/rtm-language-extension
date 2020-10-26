import LocatableEntityParser from "./LocatableEntityParser";
import Source from "../Source";
import IncludeEntity from "./IncludeEntity";

export class IncludeEntityParser extends LocatableEntityParser {

  parse(source: Source, code: string, offset: number): IncludeEntity[] {
    const entities = this.internalParse(
      IncludeEntity,
      /^\$INCLUDE\s+(\*|[A-Z]+)\s*\(([A-Z0-9\.]+)\).*$/gm,
      source,
      code,
      2,
      offset,
      (entity, match) => {
        entity.sourceName = match[1]
      }
    );
    return entities;
  }

}
