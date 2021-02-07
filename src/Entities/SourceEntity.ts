import * as vscode from "vscode";
import RtmWorkspace from "../RtmWorkspace";
import { SourceAndDocument } from "../SourceAndDocument";
import Selection from "../Selection";
import Entity from "./Entity";
import IncludableEntity from "./IncludableEntity";
import IncludableEntityParser from "./IncludableEntityParser";
import IncludeEntity from "./IncludeEntity";
import IncludeEntityParser from "./IncludeEntityParser";
import OverlayEntity from "./OverlayEntity";
import OverlayEntityParser from "./OverlayEntityParser";

export default class SourceEntity extends Entity {
  
  getDetail(): string {
    throw new Error("Method not implemented.");
  } 

  uri: vscode.Uri;
  includables: IncludableEntity[];
  includes: IncludeEntity[];
  overlays: OverlayEntity[];

  constructor(private rtmWorkspace: RtmWorkspace) {
    super();
  }

  async Load(doc: vscode.TextDocument): Promise<void> {
    this.name = RtmWorkspace.getNameFromFilePath(doc.fileName);
    this.kind = vscode.SymbolKind.Module;
    this.nameSelection = new Selection(0,0);
    this.uri = doc.uri;
    let code = doc.getText();
    code = this.replaceComments(code);
    this.selection = new Selection(0, code.length);
    this.sourceName = this.name;
    this.owner = undefined;
    const includableEntityParser = new IncludableEntityParser(this.rtmWorkspace);
    this.includables = includableEntityParser.parse(this, this, code, 0);
    const includeEntityParser = new IncludeEntityParser(this.rtmWorkspace);
    this.includes = includeEntityParser.parse(this, this, code, 0);
    code = await this.replaceIncludes(doc, code);
    const overlayEntityParser = new OverlayEntityParser(this.rtmWorkspace);
    this.overlays = overlayEntityParser.parse(this, this, code, 0);
  }

  private replaceComments(code: string): string {
    code = code.replace(new RegExp(/^\*.*/gm), (match) =>
      " ".repeat(match.length)
    );
    code = code.replace(new RegExp(/<<.*?(?:>>|(?=$))/gm), (match) =>
      " ".repeat(match.length)
    );
    return code;
  }

  private async replaceIncludes(
    doc: vscode.TextDocument,
    code: string
  ): Promise<string> {
    if (this.includes.length > 0) {
      for (const include of this.includes) {
        let includableSourceAndDocument: SourceAndDocument | undefined;
        if (include.includableSourceName == "*") {
          includableSourceAndDocument = new SourceAndDocument(this, doc);
        } else {
          includableSourceAndDocument = await this.rtmWorkspace.loadSourceByName(
            include.includableSourceName
          );
        }
        if (includableSourceAndDocument != undefined) {
          const includable = includableSourceAndDocument.source.includables.find(
            (i) => i.name == include.name
          );
          if (includable) {
            const includeRange = new vscode.Range(
              doc.positionAt(include.selection.start),
              doc.positionAt(include.selection.start + include.selection.length)
            );

            const includableRange = new vscode.Range(
              includableSourceAndDocument.document.positionAt(includable.includeSelection.start),
              includableSourceAndDocument.document.positionAt(
                includable.includeSelection.start +
                includable.includeSelection.length
              )
            );

            const includePlaceholder = doc.getText(includeRange);
            const includableCode = includableSourceAndDocument.document.getText(includableRange)
            code = code.replace(includePlaceholder, includableCode);
          }
        }
      }
    }
    return code;
  }
}
