import LocatableEntityParser from "./LocatableEntityParser";
import Source from "../Source";
import IncludeEntity from "./IncludeEntity";

export class IncludeEntityParser extends LocatableEntityParser {

  parse(source: Source, code: string, offset: number): IncludeEntity[] {
    const entities = this.internalParse(
      IncludeEntity,
      /^\$INCLUDE\s+(\*|[A-Z0-9_-]+)\s*\(([A-Z0-9\.]+)\).*/gm,
      source,
      code,
      2,
      offset,
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
