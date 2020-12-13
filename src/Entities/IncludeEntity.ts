import Entity from "./Entity";

export default class IncludeEntity extends Entity {
  
  includableSourceName: string;

  getDetail(): string {
    return `Include: $INCLUDE ${this.includableSourceName}(${this.name})`;
  }

}