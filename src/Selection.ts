export default class Selection {

  start: number;
  length: number;

  constructor(start:number, length:number) {
    this.start = start;
    this.length = length;
  }

  intersection(selection: Selection): Selection | null {
    if (this.start >= selection.start || this.start + this.length <= selection.start + selection.length) {
        return null;
    }
    const intersectionSelection = new Selection(this.start-selection.start, selection.length)
    return intersectionSelection;
  }

  after(selection: Selection):boolean {
    return (this.start >= selection.start + selection.length);
  }
}