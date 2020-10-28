import * as vscode from "vscode";
import FunctionalEntity from "./Entities/FunctionalEntity";
import Source from "./Source";
import VariableEntity from "./Entities/VariableEntity";

export class SourceAndDocument {
  source: Source;
  document: vscode.TextDocument;

  constructor(source: Source, document: vscode.TextDocument) {
    this.source = source;
    this.document = document;
  }
}

export default class RtmWorkspace {
  defaultFunctions: FunctionalEntity[] = [];
  defaultVariables: VariableEntity[] = [];
  sources: Source[] = [];
  loading: boolean;

  // async loadSources(): Promise<void> {
  //   const files = await vscode.workspace.findFiles("**/*.rtm");
  //   let processed: string[] = [];
  //   for await (const file of files) {
  //     var doc = await vscode.workspace.openTextDocument(file);
  //     const source = await this.loadSource(doc);
  //     processed.push(source.name);
  //   }
  //   this.sources.reduceRight((acc, item, index, array) => {
  //     if (processed.indexOf(item.name) == -1) {
  //       array.splice(index, 1);
  //     }
  //     return acc;
  //   });
  // }

  async loadSource(doc: vscode.TextDocument): Promise<Source> {
    this.loading = true;
    const source = new Source(this);
    await source.Load(doc);
    let existingSourceIndex = this.sources.findIndex(
      (d) => d.name == source.name
    );
    if (existingSourceIndex > -1) {
      this.sources.splice(existingSourceIndex, 1);
    }
    this.sources.push(source);
    this.loading = false;
    return source;
  }

  async loadSourceByName(name: string): Promise<SourceAndDocument | undefined> {
    let source = this.sources.find((s) => s.name == name);
    if (!source) {
      const files = await vscode.workspace.findFiles(`**/${name}`);
      if (files.length > 0) {
        var sourceAndDocument = await vscode.workspace
          .openTextDocument(files[0])
          .then((doc) => {
            const source = this.sources.find((s) => s.name == name);
            if (source != undefined) return new SourceAndDocument(source, doc);
          });
        return sourceAndDocument;
      }
    }
    return undefined;
  }

  static getNameFromFilePath(filePath: string): string {
    var name = filePath.replace(/.*[\\\/](.*)/g, (match, match1) => match1);
    return name;
  }
}
