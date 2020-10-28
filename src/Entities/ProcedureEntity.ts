import FunctionalEntity from "./FunctionalEntity";

export default class ProcedureEntity extends FunctionalEntity {
  getDetail(): string {
    return `${this.name} PROC(${this.parameters.join(", ")})`;
  }
}
