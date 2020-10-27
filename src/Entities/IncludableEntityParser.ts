import * as vscode from "vscode";
import IncludableEntity from "./IncludableEntity";
import Source from "../Source";
import LocatableEntityParser from "./LocatableEntityParser";
import Selection from "../Selection";
import RtmWorkspace from "../RtmWorkspace";
import IncludeEntity from "./IncludeEntity";

export default class IncludableEntityParser {

    constructor(private rtmWorkspace: RtmWorkspace) { }

    locatableEntityParser = new LocatableEntityParser(this.rtmWorkspace);

    parse(source: Source, code: string, offset: number): IncludableEntity[] {
        const entities = this.locatableEntityParser.parse(
            IncludableEntity,
            /^\$NAME\s+([A-Z0-9\.]+\b)[\S\s]*?\n([\S\s]*?)(?=(?:\r\n|\n|\r)\$NAME\s+)/gm,
            source,
            code,
            offset,
            1,
            vscode.SymbolKind.Package,
            (entity, match) => {
                const fullMatch = match[0];
                const includeSelectionMatch = match[2];
                const includeSelectionStart = fullMatch.indexOf(includeSelectionMatch) + entity.selection.start;
                entity.includeSelection = new Selection(includeSelectionStart, includeSelectionMatch.length);
            }
        );
        return entities;
    }
}