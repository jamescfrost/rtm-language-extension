import Entity from "./Entity";

export default class IncludeEntity extends Entity {
  
  includableSourceName: string;

  getDetail(): string {
    return `$INCLUDE ${this.includableSourceName}(${this.name})`;
  }

}