import Selection from "../Selection";
import Entity from "./Entity";

export default abstract class LocatableEntity extends Entity {

  sourceName: string;
  selection: Selection;
  nameSelection: Selection;

  abstract getDetail(): string;

}
