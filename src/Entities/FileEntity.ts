import Entity from "./Entity";

export default class FileEntity extends Entity {
  getType(): string {
    return "File";
  }
  
  getDetail(): string {
    return `${this.name}`;
  }

}