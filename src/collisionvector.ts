import { Graphics } from "pixi.js";

export default function CollisionVector(obj1: Graphics,
  obj2: Graphics,
  obj1XSpeed: number,
  obj1YSpeed: number,
  obj2XSpeed: number,
  obj2YSpeed: number,
  obj1Mass: number, obj2Mass: number
) {
  const bounds1 = obj1.getBounds();
  const bounds2 = obj2.getBounds();

  let x1 = bounds1.x + bounds1.width / 2;
  let y1 = bounds1.y + bounds1.height / 2;
  let x2 = bounds2.x + bounds2.width / 2;
  let y2 = bounds2.y + bounds2.height / 2;
  let vCollision = { x: x2 - x1, y: y2 - y1 };
  let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance }

  const vRelativeVelocity = { x: obj1XSpeed - obj2XSpeed, y: obj1YSpeed - obj2YSpeed };
  const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
  if (speed < 0) return { obj1ChangeX: 0, obj1ChangeY: 0, obj2ChangeX: 0, obj2ChangeY: 0 };

  const impulse = 2 * speed / (obj1Mass + obj2Mass);

  const obj1ChangeX = impulse * obj2Mass * vCollisionNorm.x;
  const obj1ChangeY = impulse * obj2Mass * vCollisionNorm.y;
  const obj2ChangeX = impulse * obj1Mass * vCollisionNorm.x;
  const obj2ChangeY = impulse * obj1Mass * vCollisionNorm.y;

  return { obj1ChangeX, obj1ChangeY, obj2ChangeX, obj2ChangeY };
}
