import * as vscode from "vscode";
import Source from "../Source";
import OverlayEntity from "./OverlayEntity";
import ProcedureEntityParser from "./ProcedureEntityParser";
import RtmWorkspace from "../RtmWorkspace";
import VariableEntityParser from "./VariableEntityParser";
import FunctionalEntityParser from "./FunctionalEntityParser";

export default class OverlayEntityParser {

  private functionalEntityParser = new FunctionalEntityParser(this.rtmWorkspace);

  private variableEntityParser = new VariableEntityParser(
    this.rtmWorkspace
  );

  private procedureEntityParser = new ProcedureEntityParser(
    this.rtmWorkspace
  );

  constructor(private rtmWorkspace: RtmWorkspace) {
  }

  parse(
    source: Source,
    code: string,
    offset: number
  ): OverlayEntity[] {
    const entities = this.functionalEntityParser.parse(
      OverlayEntity,
      /^\$ENTRY\s+([A-Z0-9\.]+)[\s\S]*?(?:^\$PROG\(((?:\b[A-Z0-9\.]+\b\s*,?\s*)*)\))[\s\S]*?(?=^\$(?:ENTRY|END)|$(?![\r\n]))/gm,
      source,
      code,
      offset,
      1,
      vscode.SymbolKind.Function,
      (overlay, match) => {
        const overlayCode = match[0];
        overlay.variables = [];
        overlay.procedures = [];
        this.parseVariables(/^\$USERDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlayCode);
        this.parseVariables(/^\$SCREENDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlayCode);
        this.parseVariables(/^\$DATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlayCode);
        this.parseVariables(/^\$EXTDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlayCode);
        this.parseProcedures(/^\$PROG\s*\(.*?\)[\s\S]*?(^[\s\S]*)/gm, overlay, source, overlayCode);
      }
    );
    return entities;
  }

  private parseVariables(regexp: RegExp, overlay: OverlayEntity, source: Source, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const matchedCode = match[0];
      const searchableCode = match[1];
      const searchableOffset = matchedCode.indexOf(searchableCode);
      const totalOffset = overlay.selection.start + match.index + searchableOffset;
      const entities = this.variableEntityParser.parse(source, searchableCode, totalOffset);
      overlay.variables.push(...entities)
    }
  }

  private parseProcedures(regexp: RegExp, overlay: OverlayEntity, source: Source, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const searchableCode = match[1];
      const searchableOffset = overlay.selection.start + match.index;
      const entities = this.procedureEntityParser.parse(source, searchableCode, searchableOffset);
      overlay.procedures.push(...entities)
    }
  }

}
