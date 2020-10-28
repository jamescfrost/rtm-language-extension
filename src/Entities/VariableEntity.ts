import Entity from "./Entity";

export default class VariableEntity extends Entity {

  editMask: string;

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}
