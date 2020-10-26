import * as vscode from "vscode";
import IncludableEntity from "./Entities/IncludableEntity";
import IncludableEntityParser from "./Entities/IncludableEntityParser";
import IncludeEntity from "./Entities/IncludeEntity";
import { IncludeEntityParser } from "./Entities/IncludeEntityParser";
import OverlayEntity from "./Entities/OverlayEntity";
import OverlayEntityParser from "./Entities/OverlayEntityParser";
import RtmWorkspace from "./RtmWorkspace";

export default class Source {
  name: string;
  uri: vscode.Uri;
  includables: IncludableEntity[];
  includes: IncludeEntity[];
  overlays: OverlayEntity[];

  constructor(private rtmWorkspace: RtmWorkspace) {}

  async Load(uri: vscode.Uri): Promise<void> {
    const doc = await vscode.workspace.openTextDocument(uri);
    let code = doc.getText();
    code = this.replaceComments(code);
    const includableEntityParser = new IncludableEntityParser(
      this.rtmWorkspace
    );
    this.includables = includableEntityParser.parse(this, code, 0);
    const includeEntityParser = new IncludeEntityParser(this.rtmWorkspace);
    this.includes = includeEntityParser.parse(this, code, 0);
    code = await this.replaceIncludes(doc, code);
    this.name = doc.fileName.replace(/.*[\\\/](.*)(?:\..*)/g,
      (match, match1) => match1
    );
    this.uri = doc.uri;
    const overlayEntityParser = new OverlayEntityParser(this.rtmWorkspace);
    this.overlays = overlayEntityParser.parse(this, code, 0);
  }

  private replaceComments(code: string): string {
    code = code.replace(new RegExp(/^\*.*$/gm), "");
    code = code.replace(new RegExp(/<<.*?(?:>>|$)/g), (match) =>
      " ".repeat(match.length)
    );
    return code;
  }

  private async replaceIncludes(
    doc: vscode.TextDocument,
    code: string
  ): Promise<string> {
    for (const include of this.includes) {
      const includableSource = await this.rtmWorkspace.loadSourceByName(
        include.sourceName
      );
      if (includableSource) {
        const includable = includableSource.includables.find(
          (i) => i.name == include.name
        );
        if (includable) {
          const includableDoc = (includableSource.uri = doc.uri)
            ? doc
            : await vscode.workspace.openTextDocument(includableSource.uri);

          const includeRange = new vscode.Range(
            doc.positionAt(include.selection.start),
            doc.positionAt(include.selection.start + include.selection.length)
          );

          const includableRange = new vscode.Range(
            includableDoc.positionAt(includable.selection.start),
            includableDoc.positionAt(
              includable.includeSelection.start +
                includable.includeSelection.length
            )
          );

          const includePlaceholder = includableDoc.getText(includeRange);
          code = code.replace(includePlaceholder, (match) => {
            return includableDoc.getText(includableRange);
          });
        }
      }
    }
    return code;
  }
}
