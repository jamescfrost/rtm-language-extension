import * as vscode from "vscode";
import FunctionalEntity from "./Entities/FunctionalEntity";
import Source from "./Source";
import VariableEntity from "./Entities/VariableEntity";
import IncludeEntity from "./Entities/IncludeEntity";
import IncludableEntity from "./Entities/IncludableEntity";

export default class RtmWorkspace {

  defaultFunctions: FunctionalEntity[] = [];
  defaultVariables: VariableEntity[] = [];
  sources: Source[] = [];

  async loadSources(): Promise<void> {
    const files = await vscode.workspace.findFiles("**/*.rtm");
    let processed: string[] = [];
    for await (const file of files) {
      const source = await this.loadSource(file);
      processed.push(source.name);
    }
    this.sources.reduceRight((acc, item, index, array) => {
      if (processed.indexOf(item.name) == -1) {
        array.splice(index, 1);
      }
      return acc;
    });
  }

  async loadSource(uri: vscode.Uri): Promise<Source> {
    const source = new Source(this);
    source.Load(uri);
    let existingSourceIndex = this.sources.findIndex(
      (d) => (d.name = source.name)
    );
    if (existingSourceIndex > -1) {
      this.sources.splice(existingSourceIndex, 1);
    }
    this.sources.push(source);
    return source;
  }

  async loadSourceByName(name: string): Promise<Source | undefined> {
    let source = this.sources.find((s) => (s.name = name));
    if (!source) {
      const files = await vscode.workspace.findFiles(`**/${name}.rtm`);
      if (files.length > 0) 
        source = await this.loadSource(files[0]);
    }
    return source;
  }

  findIncludable(include: IncludeEntity): IncludableEntity | undefined {
    const source = this.sources.find(s => s.name = include.sourceName);
    const includableEntity = source?.includables.find(i => i.name = include.name);
    return includableEntity;
  }

}
