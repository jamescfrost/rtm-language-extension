import * as vscode from "vscode";
import Entity from "./Entity";
import Source from "../Source";
import Selection from "../Selection";

export default abstract class EntityParser {

  abstract parse(source: Source, code: string, offset: number): Entity[];

}
