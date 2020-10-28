import Entity from "./Entity";

export default class VariableEntity extends Entity {

  editMask: string;

  getDetail(): string {
    return `${this.name} ${this.editMask}`;
  }

}
