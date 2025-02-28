import { Graphics } from "pixi.js";

export function CreatePuck(centreX: number, centreY: number, puckRadius: number, color: string, y: number) {
  const puck = new Graphics()
    .circle(centreX, centreY, puckRadius)
    .fill(color);
  puck.y = y;
  return puck;
}
