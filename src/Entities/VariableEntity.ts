import Entity from "./Entity";

export default class VariableEntity extends Entity {

  editMask: string;

  getDetail(): string {
    return `Variable: ${this.name} ${this.editMask}`;
  }

}
