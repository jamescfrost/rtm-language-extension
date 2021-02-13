import Entity from "./Entity";

export default class VariableEntity extends Entity {
  getType(): string {
    return "Variable";
  }

  editMask: string;

  getDetail(): string {
    return `${this.name} ${this.editMask}`;
  }

}
