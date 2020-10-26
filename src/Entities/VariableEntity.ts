import LocatableEntity from "./LocatableEntity";

export default class VariableEntity extends LocatableEntity {

  editMask: string;

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}
