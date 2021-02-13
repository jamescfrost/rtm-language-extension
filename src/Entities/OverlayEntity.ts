import FunctionalEntity from "./FunctionalEntity";
import ProcedureEntity from "./ProcedureEntity";
import VariableEntity from "./VariableEntity";
import ExtEntity from "./ExtEntity";
import FileEntity from "./FileEntity";

export default class OverlayEntity extends FunctionalEntity {

  files: FileEntity[];
  variables: VariableEntity[];
  exts: ExtEntity[];
  procedures: ProcedureEntity[];

  getType(): string {
    return "Overlay";
  }

  getDetail(): string {
    const parameters = this.getParametersWithDetail();
    return `$ENTRY ${this.name}(${parameters.join(", ")})`;
  }

}
