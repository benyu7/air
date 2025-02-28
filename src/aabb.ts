import { Graphics } from "pixi.js";

export default function testForAABB(object1: Graphics, object2: Graphics): boolean {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width
    && bounds1.x + bounds1.width > bounds2.x
    && bounds1.y < bounds2.y + bounds2.height
    && bounds1.y + bounds1.height > bounds2.y;
};

export function testForCircleCollision(object1: Graphics, object2: Graphics) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  let x1 = bounds1.x + bounds1.width / 2;
  let y1 = bounds1.y + bounds1.height / 2;
  let x2 = bounds2.x + bounds2.width / 2;
  let y2 = bounds2.y + bounds2.height / 2;

  const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return distance <= (bounds1.width / 2 + bounds2.width / 2)
}

export function topWallCollision(ball: Graphics, box: Graphics) {
  const bounds1 = ball.getBounds();
  const bounds2 = box.getBounds();
  const y1 = bounds1.y;
  const y2 = bounds2.y;

  return y1 < y2;
}

export function botWallCollision(ball: Graphics, box: Graphics) {
  const bounds1 = ball.getBounds();
  const bounds2 = box.getBounds();
  const y1 = bounds1.y;
  const h1 = bounds1.height;
  const y2 = bounds2.y;
  const h2 = bounds2.height;

  return y1 + h1 > y2 + h2;
}

export function vertWallCollision(ball: Graphics, box: Graphics): boolean {
  const bounds1 = ball.getBounds();
  const bounds2 = box.getBounds();
  const x1 = bounds1.x;
  const w1 = bounds1.width;
  const x2 = bounds2.x;
  const w2 = bounds2.width;

  return !(x1 >= x2 && x1 + w1 <= x2 + w2);
}
