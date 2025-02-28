import { Container, Sprite, Text, Texture } from "pixi.js";

export default function CreateMovementHotkeySet(texture: Texture, up: string, left: string, down: string, right: string, x: number, y: number) {
  const container = new Container();
  const xOffset = 40;
  const yOffset = 20;
  const upKey = CreateMovementHotkey(texture, up, 0, -yOffset)
  const leftKey = CreateMovementHotkey(texture, left, -xOffset, yOffset)
  const downKey = CreateMovementHotkey(texture, down, 0, yOffset)
  const rightKey = CreateMovementHotkey(texture, right, xOffset, yOffset)
  container.addChild(upKey);
  container.addChild(leftKey);
  container.addChild(downKey);
  container.addChild(rightKey);
  container.x = x;
  container.y = y;
  return container;
}

function CreateMovementHotkey(texture: Texture, key: string, x: number, y: number) {
  const container = new Container();
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.scale.set(0.2);
  const text = new Text({ text: key, style: { fontFamily: 'Lineal', fontSize: 25 } });
  text.anchor.set(0.5);
  container.addChild(sprite);
  container.addChild(text);
  container.x = x;
  container.y = y;
  return container;
}

export function CreateSpeedText(x: number, y: number) {
  const container = new Container();
  const offSet = 15;
  const textX = new Text({
    text: 'X:',
    style: {
      fontFamily: 'Lineal',
      fontSize: 40,
    },
  });
  const textY = new Text({
    text: 'Y:',
    style: {
      fontFamily: 'Lineal',
      fontSize: 40,
    },
  });
  textX.anchor.set(0.5);
  textY.anchor.set(0.5);
  container.addChild(textX);
  container.addChild(textY);
  textX.y = -offSet;
  textY.y = offSet;
  container.x = x;
  container.y = y;
  return container;
}
