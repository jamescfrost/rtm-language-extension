import Selection from "../Selection";
import Entity from "./Entity";

export default class IncludableEntity extends Entity {
  
  includeSelection: Selection;
  
  getDetail(): string {
    return `Includable: $NAME ${this.name}`;
  }
  
}