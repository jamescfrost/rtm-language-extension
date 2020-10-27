import LocatableEntity from "./LocatableEntity";

export default class IncludeEntity extends LocatableEntity {
  
  includableSourceName: string;

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}