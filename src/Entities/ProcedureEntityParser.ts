import LocatableEntityParser from "./LocatableEntityParser";
import ProcedureEntity from "./ProcedureEntity";
import Source from "../Source";

export default class ProcedureEntityParser extends LocatableEntityParser {

  parse(source: Source, code: string, offset: number): ProcedureEntity[] {
    const entities = this.internalParse(
      ProcedureEntity,
      /^Nothing/,
      source,
      code,
      2,
      offset
    );
    return entities;
  }
}
