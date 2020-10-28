import Selection from "../Selection";
import Entity from "./Entity";

export default class IncludableEntity extends Entity {
  
  includeSelection: Selection;
  
  getDetail(): string {
    throw new Error("Method not implemented.");
  }
  
}