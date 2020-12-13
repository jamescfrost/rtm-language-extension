import * as vscode from "vscode";
import IncludableEntity from "./Entities/IncludableEntity";
import IncludableEntityParser from "./Entities/IncludableEntityParser";
import IncludeEntity from "./Entities/IncludeEntity";
import IncludeEntityParser from "./Entities/IncludeEntityParser";
import OverlayEntity from "./Entities/OverlayEntity";
import OverlayEntityParser from "./Entities/OverlayEntityParser";
import RtmWorkspace, { SourceAndDocument } from "./RtmWorkspace";

export default class Source {
  name: string;
  uri: vscode.Uri;
  includables: IncludableEntity[];
  includes: IncludeEntity[];
  overlays: OverlayEntity[];

  constructor(private rtmWorkspace: RtmWorkspace) { }

  async Load(doc: vscode.TextDocument): Promise<void> {
    this.name = RtmWorkspace.getNameFromFilePath(doc.fileName);
    this.uri = doc.uri;
    let code = doc.getText();
    code = this.replaceComments(code);
    const includableEntityParser = new IncludableEntityParser(this.rtmWorkspace);
    this.includables = includableEntityParser.parse(this, code, 0);
    const includeEntityParser = new IncludeEntityParser(this.rtmWorkspace);
    this.includes = includeEntityParser.parse(this, code, 0);
    code = await this.replaceIncludes(doc, code);
    const overlayEntityParser = new OverlayEntityParser(this.rtmWorkspace);
    this.overlays = overlayEntityParser.parse(this, code, 0);
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
