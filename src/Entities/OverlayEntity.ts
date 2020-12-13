import FunctionalEntity from "./FunctionalEntity";
import ProcedureEntity from "./ProcedureEntity";
import VariableEntity from "./VariableEntity";
import ExtEntity from "./ExtEntity";

export default class OverlayEntity extends FunctionalEntity {

  files: [];
  variables: VariableEntity[];
  exts: ExtEntity[];
  procedures: ProcedureEntity[];

  getDetail(): string {
    return `Overlay: $ENTRY ${this.name}(${this.parameters.join(", ")})`;
  }

}
