import Entity from "./Entity";

export default class FunctionalEntity extends Entity {
  
  getDetail(): string {
    throw new Error("Method not implemented.");
  }

  parameters: string[];
  returns: string[];

}
