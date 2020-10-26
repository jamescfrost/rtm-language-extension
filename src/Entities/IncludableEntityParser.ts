import IncludableEntity from "./IncludableEntity";
import Source from "../Source";
import LocatableEntityParser from "./LocatableEntityParser";

export default class IncludableEntityParser extends LocatableEntityParser {

  parse(source: Source, code: string, offset: number): IncludableEntity[] {
    const entities = this.internalParse(
      IncludableEntity,
      /^\$INCLUDE\s+(\*|[A-Z]+)\s*\(([A-Z0-9\.]+)\).*$/gm,
      source,
      code,
      2,
      offset,
      (entity, match) => {
      }
    );
    return entities;
  }
}