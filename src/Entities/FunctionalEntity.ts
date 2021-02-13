import Entity from "./Entity";
import OverlayEntity from "./OverlayEntity";

export default abstract class FunctionalEntity extends Entity {

  parameters: string[];
  returns: string[];

  getParametersWithDetail(): string[] {
    const parameters: string[] = [];
    let overlay: OverlayEntity;
    if (this instanceof OverlayEntity) 
       overlay = <OverlayEntity>this;
    else if (this.owner instanceof OverlayEntity)
       overlay = <OverlayEntity>this.owner;
    else
      return this.parameters;
    this.parameters.forEach(parameter => {
      const variable = overlay.variables.find(x=>x.name == parameter)
      if (variable)
        parameters.push(variable.getDetail())
      else
        parameters.push(`Unknown: ${parameter}`)
    });
    return parameters;
  }

}
