import Entity from "./Entity";

export default class ExtEntity extends Entity {
  
  getType(): string {
    return "Ext";
  }
  
  getDetail(): string {
    return `${this.name}`;
  }

}