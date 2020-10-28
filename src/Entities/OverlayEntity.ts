import FunctionalEntity from "./FunctionalEntity";
import ProcedureEntity from "./ProcedureEntity";
import VariableEntity from "./VariableEntity";

export default class OverlayEntity extends FunctionalEntity {

  files: [];
  variables: VariableEntity[];
  procedures: ProcedureEntity[];

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}
