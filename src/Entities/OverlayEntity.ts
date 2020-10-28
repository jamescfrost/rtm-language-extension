import FunctionalEntity from "./FunctionalEntity";
import ProcedureEntity from "./ProcedureEntity";
import VariableEntity from "./VariableEntity";

export default class OverlayEntity extends FunctionalEntity {

  files: [];
  variables: VariableEntity[];
  procedures: ProcedureEntity[];

  getDetail(): string {
    return `$ENTRY ${this.name}(${this.parameters.join(", ")})`;
  }

}
