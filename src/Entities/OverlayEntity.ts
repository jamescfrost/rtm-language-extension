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

  getDetail(): string {
    const parameters = this.getParametersWithDetail();
    return `Overlay: $ENTRY ${this.name}(${parameters.join(", ")})`;
  }

}
