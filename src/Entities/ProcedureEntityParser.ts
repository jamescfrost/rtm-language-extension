import * as vscode from "vscode";
import LocatableEntityParser from "./LocatableEntityParser";
import ProcedureEntity from "./ProcedureEntity";
import Source from "../Source";
import RtmWorkspace from "../RtmWorkspace";
import FunctionalEntityParser from "./FunctionalEntityParser";

export default class ProcedureEntityParser {
  
  constructor(private rtmWorkspace: RtmWorkspace) {}
  
  functionalEntityParser = new FunctionalEntityParser(this.rtmWorkspace);

  parse(
    source: Source,
    code: string,
    offset: number,
  ): ProcedureEntity[] {
    const entities = this.functionalEntityParser.parse(
      ProcedureEntity,
      /^([A-Z0-9\.]+)\s+PROC\(((?:\b[A-Z0-9\.]+\b\s*,?\s*)*)\)[\s\S]*?^ENDPROC\b/gm,
      source,
      code,
      offset,
      1,
      vscode.SymbolKind.Method
    );
    return entities;
  }
}
