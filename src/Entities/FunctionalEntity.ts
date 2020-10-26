import LocatableEntity from "./LocatableEntity";

export default class FunctionalEntity extends LocatableEntity {
  
  getDetail(): string {
    throw new Error("Method not implemented.");
  }

  parameters: string[];
  returns: string[];

}
