import Selection from "../Selection";
import Entity from "./Entity";

export default class IncludableEntity extends Entity {
    
  includeSelection: Selection;
  
  getType(): string {
    return "Includable";
  }

  getDetail(): string {
    return `$NAME ${this.name}`;
  }
  
}