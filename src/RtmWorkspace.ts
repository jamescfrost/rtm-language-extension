import * as vscode from "vscode";
import FunctionalEntity from "./Entities/FunctionalEntity";
import VariableEntity from "./Entities/VariableEntity";
import { SourceAndDocument } from "./SourceAndDocument";
import SourceEntity from "./Entities/SourceEntity";
import Selection from "./Selection";
import Entity from "./Entities/Entity";

export default class RtmWorkspace {
  defaultFunctions: Map<string, string> = new Map();
  defaultVariables: Map<string, string> = new Map();
  sources: SourceEntity[] = [];
  loading: boolean;

  constructor() {
    this.defaultFunctions.set(
      "EXT",
      `Default Function: EXT(VALUE (numeric/codestring/date))
    ___
    Returns the variables external value as string
    `
    );
    this.defaultFunctions.set(
      "CONVERT",
      `Default Function: CONVERT(INT, FROM (Alphanumeric), Variable TO (Numeric))
    ___
    Returns the variables external value as string
    `
    );
  }

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

  async loadSource(doc: vscode.TextDocument): Promise<SourceEntity> {
    this.loading = true;
    const source = new SourceEntity(this);
    await source.Load(doc);
    let existingSourceIndex = this.sources.findIndex(
      (d) => d.name == source.name
    );
    if (existingSourceIndex > -1) {
      this.sources.splice(existingSourceIndex, 1);
    }
    this.sources.push(source);
    this.loading = false;
    console.log(source.name + " Loaded");
    return source;
  }

  async loadSourceByName(name: string): Promise<SourceAndDocument | undefined> {
    let source = this.sources.find((s) => s.name == name);
    if (!source) {
      const files = await vscode.workspace.findFiles(`**/${name}`);
      if (files.length > 0) {
        var sourceAndDocument = await vscode.workspace
          .openTextDocument(files[0])
          .then(async (doc) => {
            const source = await this.loadSource(doc);
            if (source != undefined) return new SourceAndDocument(source, doc);
          });
        return sourceAndDocument;
      }
    } else {
      var sourceAndDocument = await vscode.workspace
        .openTextDocument(source.uri)
        .then(async (doc) => {
          if (source != undefined) return new SourceAndDocument(source, doc);
        });
      return sourceAndDocument;
    }
    return undefined;
  }

  static getNameFromFilePath(filePath: string): string {
    var name = filePath.replace(/.*[\\\/](.*)/g, (match, match1) => match1);
    return name;
  }

  getSource(name: string) : SourceEntity | undefined {
    const source = this.sources.find((s) => s.name == name);
    return source;
  }

  provideEntity(doc: vscode.TextDocument, pos: vscode.Position) {
    const wordRange = doc.getWordRangeAtPosition(pos);
    if (wordRange) {
      if (this.loading) return null;
      const name = RtmWorkspace.getNameFromFilePath(doc.fileName);
      const source = this.getSource(name);
      const word = doc.getText(wordRange);
      const offset = doc.offsetAt(wordRange.start);
      const wordSelection = new Selection(offset, word.length);
      const overlay = source?.overlays.find(
        (o) => o.selection.intersection(wordSelection) != null
      );
      if (overlay) {
        let entity: Entity | undefined =
          word == overlay.name ? overlay : undefined;
        if (!entity) entity = overlay.exts.find((v) => v.name == word);
        if (!entity) entity = overlay.files.find((v) => v.name == word);
        if (!entity) entity = overlay.variables.find((v) => v.name == word);
        if (!entity) entity = overlay.procedures.find((v) => v.name == word);
        return entity;
      }
    }
  }
}
