import FunctionalEntity from "./FunctionalEntity";

export default class ProcedureEntity extends FunctionalEntity {
  getDetail(): string {
    const parameters = this.getParametersWithDetail();
    return `Procedure: ${this.name} PROC(${parameters.join(", ")})`;
  }
}
