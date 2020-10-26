import * as vscode from "vscode";
import FunctionalEntity from "./FunctionalEntity";
import LocatableEntity from "./LocatableEntity";
import LocatableEntityParser from "./LocatableEntityParser";
import Source from "../Source";

export default abstract class FunctionalEntityParser extends LocatableEntityParser {
  internalParse<T extends LocatableEntity>(
    entityClass: { new (): T },
    regexp: RegExp,
    source: Source,
    code: string,
    nameMatchIndex: number,
    offset: number,
    applyExtendedFields: (entity: T, match: RegExpExecArray) => void
  ): T[] {
    const entities = super.internalParse(
      entityClass,
      regexp,
      source,
      code,
      nameMatchIndex,
      offset,
      (entity, match) => {
        const functionalEntity = <FunctionalEntity><unknown>entity;
        functionalEntity.parameters = match[2]
        .replace("(", "")
        .replace(")", "")
        .split(",");
        applyExtendedFields(entity, match);
      }
    );
    return entities;
  }
}
