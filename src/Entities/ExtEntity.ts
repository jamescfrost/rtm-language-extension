import Entity from "./Entity";

export default class ExtEntity extends Entity {
  
  getDetail(): string {
    return `Ext: ${this.name}`;
  }

}