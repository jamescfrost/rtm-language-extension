import Entity from "./Entity";

export default class IncludeEntity extends Entity {
  
  includableSourceName: string;

  getDetail(): string {
    throw new Error("Method not implemented.");
  }

}