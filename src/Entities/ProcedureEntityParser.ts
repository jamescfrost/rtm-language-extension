import * as vscode from "vscode";
import ProcedureEntity from "./ProcedureEntity";
import RtmWorkspace from "../RtmWorkspace";
import FunctionalEntityParser from "./FunctionalEntityParser";
import SourceEntity from "./SourceEntity";
import Entity from "./Entity";

export default class ProcedureEntityParser {
  
  constructor(private rtmWorkspace: RtmWorkspace) {}
  
  functionalEntityParser = new FunctionalEntityParser(this.rtmWorkspace);

  parse(
    source: SourceEntity,
    owner: Entity,
    code: string,
    offset: number,
  ): ProcedureEntity[] {
    const entities = this.functionalEntityParser.parse(
      ProcedureEntity,
      /^([A-Z0-9\.]+)\s+PROC\(((?:\b[A-Z0-9\.]+\b\s*,?\s*)*)\)[\s\S]*?^ENDPROC\b/gm,
      source,
      owner,
      code,
      offset,
      1,
      vscode.SymbolKind.Method
    );
    return entities;
  }
}
