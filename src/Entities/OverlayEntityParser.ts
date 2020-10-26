import * as vscode from "vscode";
import Source from "../Source";
import OverlayEntity from "./OverlayEntity";
import ProcedureEntityParser from "./ProcedureEntityParser";
import LocatableEntityParser from "./LocatableEntityParser";
import RtmWorkspace from "../RtmWorkspace";

export default class OverlayEntityParser extends LocatableEntityParser {
  private procedureEntityParser: ProcedureEntityParser = new ProcedureEntityParser(
    this.rtmWorkspace
  );

  constructor(rtmWorkspace: RtmWorkspace) {
    super(rtmWorkspace);
  }

  parse(source: Source, code: string, offset: number): OverlayEntity[] {
    const entities = this.internalParse(
      OverlayEntity,
      /^\$ENTRY\s+([A-Z0-9\.]+)[\s\S]*?(?=^\$(?:ENTRY|END))/gm,
      source,
      code,
      1,
      offset,
      (entity) => {
        entity.procedures = this.procedureEntityParser.parse(
          source,
          code,
          offset
        );
      }
    );
    return entities;
  }
}
