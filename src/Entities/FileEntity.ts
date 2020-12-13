import Entity from "./Entity";

export default class FileEntity extends Entity {
  
  getDetail(): string {
    return `File: ${this.name}`;
  }

}