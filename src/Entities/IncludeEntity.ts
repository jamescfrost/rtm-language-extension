import Entity from "./Entity";

export default class IncludeEntity extends Entity {
  
  includableSourceName: string;

  getType(): string {
    return "Include";
  }

  getDetail(): string {
    return `$INCLUDE ${this.includableSourceName}(${this.name})`;
  }

}