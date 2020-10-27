import LocatableEntity from "./LocatableEntity";
import Selection from "../Selection";

export default class IncludableEntity extends LocatableEntity {
  
  includeSelection: Selection;
  
  getDetail(): string {
    throw new Error("Method not implemented.");
  }
  
}