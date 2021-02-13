import FunctionalEntity from "./FunctionalEntity";

export default class ProcedureEntity extends FunctionalEntity {
  getType(): string {
    return "Procedure";
  }

  getDetail(): string {
    const parameters = this.getParametersWithDetail();
    return `${this.name} PROC(${parameters.join(", ")})`;
  }
}
