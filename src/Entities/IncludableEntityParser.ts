import * as vscode from "vscode";
import IncludableEntity from "./IncludableEntity";
import Selection from "../Selection";
import RtmWorkspace from "../RtmWorkspace";
import EntityParser from "./EntityParser";
import SourceEntity from "./SourceEntity";
import Entity from "./Entity";

export default class IncludableEntityParser {

    constructor(private rtmWorkspace: RtmWorkspace) { }

    entityParser = new EntityParser(this.rtmWorkspace);

    parse(source: SourceEntity, owner: Entity, code: string, offset: number): IncludableEntity[] {
        const entities = this.entityParser.parse(
            IncludableEntity,
            /^\$NAME\s+([A-Z0-9\.]+\b)[\S\s]*?\n([\S\s]*?)(?=(?:\r\n|\n|\r)\$NAME\s+)/gm,
            source,
            owner,
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