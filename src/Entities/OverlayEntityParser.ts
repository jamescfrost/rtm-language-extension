import * as vscode from "vscode";
import OverlayEntity from "./OverlayEntity";
import ProcedureEntityParser from "./ProcedureEntityParser";
import RtmWorkspace from "../RtmWorkspace";
import VariableEntityParser from "./VariableEntityParser";
import FunctionalEntityParser from "./FunctionalEntityParser";
import ExtEntityParser from "./ExtEntityParser";
import FileEntityParser from "./FileEntityParser";
import SourceEntity from "./SourceEntity";
import Entity from "./Entity";

export default class OverlayEntityParser {

  private functionalEntityParser = new FunctionalEntityParser(this.rtmWorkspace);

  private fileEntityParser = new FileEntityParser(
    this.rtmWorkspace
  );

  private variableEntityParser = new VariableEntityParser(
    this.rtmWorkspace
  );

  private extEntityParser = new ExtEntityParser(
    this.rtmWorkspace
  );

  private procedureEntityParser = new ProcedureEntityParser(
    this.rtmWorkspace
  );

  constructor(private rtmWorkspace: RtmWorkspace) {
  }

  parse(
    source: SourceEntity,
    owner: Entity, 
    code: string,
    offset: number
  ): OverlayEntity[] {
    const entities = this.functionalEntityParser.parse(
      OverlayEntity,
      /^\$ENTRY\s+([A-Z0-9\.]+)[\s\S]*?(?:^\$PROG\(((?:\b[A-Z0-9\.]+\b\s*,?\s*)*)\))[\s\S]*?(?=^\$(?:ENTRY|END)|$(?![\r\n]))/gm,
      source,
      owner,
      code,
      offset,
      1,
      vscode.SymbolKind.Function,
      (overlay, match) => {
        const overlayCode = match[0];
        overlay.files = [];
        overlay.variables = [];
        overlay.exts = [];
        overlay.procedures = [];
        this.parseFiles(/^\$FILES\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseVariables(/^\$USERDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseVariables(/^\$SCREENDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseVariables(/^\$DATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseVariables(/^\$EXTDATA\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseExt(/^\$EXT\b[\s\S]*?(^[\s\S]*?)(?=^\$[A-Z]+)/gm, overlay, source, overlay, overlayCode);
        this.parseProcedures(/^\$PROG\s*\(.*?\)[\s\S]*?(^[\s\S]*)/gm, overlay, source, overlay, overlayCode);
      }
    );
    return entities;
  }

  private parseFiles(regexp: RegExp, overlay: OverlayEntity, source: SourceEntity, owner: Entity, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const matchedCode = match[0];
      const searchableCode = match[1];
      const searchableOffset = matchedCode.indexOf(searchableCode);
      const totalOffset = overlay.selection.start + match.index + searchableOffset;
      const entities = this.fileEntityParser.parse(source, owner, searchableCode, totalOffset);
      overlay.files.push(...entities)
    }
  }

  private parseVariables(regexp: RegExp, overlay: OverlayEntity, source: SourceEntity, owner: Entity, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const matchedCode = match[0];
      const searchableCode = match[1];
      const searchableOffset = matchedCode.indexOf(searchableCode);
      const totalOffset = overlay.selection.start + match.index + searchableOffset;
      const entities = this.variableEntityParser.parse(source, owner, searchableCode, totalOffset);
      overlay.variables.push(...entities)
    }
  }

  private parseExt(regexp: RegExp, overlay: OverlayEntity, source: SourceEntity, owner: Entity, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const matchedCode = match[0];
      const searchableCode = match[1];
      const searchableOffset = matchedCode.indexOf(searchableCode);
      const totalOffset = overlay.selection.start + match.index + searchableOffset;
      const entities = this.extEntityParser.parse(source, owner, searchableCode, totalOffset);
      overlay.exts.push(...entities)
    }
  }

  private parseProcedures(regexp: RegExp, overlay: OverlayEntity, source: SourceEntity, owner: Entity, code: string) {
    let match = regexp.exec(code);
    if (match != null) {
      const searchableCode = match[1];
      const searchableOffset = overlay.selection.start + match.index;
      const entities = this.procedureEntityParser.parse(source, owner, searchableCode, searchableOffset);
      overlay.procedures.push(...entities)
    }
  }

}
