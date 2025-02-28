import { Application, Assets, Graphics, Text } from "pixi.js";
import { botWallCollision, testForCircleCollision, topWallCollision, vertWallCollision } from "./aabb";
import CollisionVector from "./collisionvector";
import CreateMovementHotkeySet, { CreateSpeedText } from "./keyicon";
import { CreatePuck } from "./puck";

const app = new Application();
let boxWidth: number;
let boxHeight: number;
let ball: Graphics;
let ballXSpeed = 0;
let ballYSpeed = 0;
let topPuckXSpeed = 0;
let topPuckYSpeed = 0;
let botPuckXSpeed = 0;
let botPuckYSpeed = 0;
const ballRadius = 10;
const goalRadius = 150;
const puckRadius = 20;
const ballMass = 1;
const puckMass = 3;
let topScore = 0;
let botScore = 0;
let topUp = false;
let topLeft = false;
let topDown = false;
let topRight = false;
let botUp = false;
let botLeft = false;
let botDown = false;
let botRight = false;
const rose = '#a2666f';
const coral = '#f49390';
// const pink = '#f45866';
// const magenta = '#c45ab3';
const tekhelet = '#631a86';

(async () => {
  await setup();
})();

async function setup() {
  KeyboardEvents();
  Assets.addBundle('fonts', [
    { alias: 'Lineal', src: 'https://pixijs.com/assets/webfont-loader/Lineal.otf' },
  ]);

  await Assets.loadBundle('fonts');
  await app.init({ background: rose, resizeTo: window });
  let keyIconTexture = await Assets.load('assets/keyicon.png');

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  boxWidth = app.screen.width / 3;
  boxHeight = app.screen.height * 0.8;

  let box = new Graphics()
    .rect((app.screen.width) / 2 - (boxWidth / 2), (app.screen.height) / 2 - boxHeight / 2, boxWidth, boxHeight)
    .fill('#c45ab3');

  app.stage.addChild(box);

  let middleLine = new Graphics()
    .moveTo((app.screen.width - boxWidth) / 2, app.screen.height / 2)
    .lineTo((app.screen.width + boxWidth) / 2, app.screen.height / 2)
    .stroke({ color: '0xffffff', pixelLine: true });
  let topLine = new Graphics()
    .moveTo((app.screen.width - boxWidth) / 2, app.screen.height * 0.4)
    .lineTo((app.screen.width + boxWidth) / 2, app.screen.height * 0.4)
    .stroke({ color: '0xffffff', pixelLine: true });
  let botLine = new Graphics()
    .moveTo((app.screen.width - boxWidth) / 2, app.screen.height * 0.6)
    .lineTo((app.screen.width + boxWidth) / 2, app.screen.height * 0.6)
    .stroke({ color: '0xffffff', pixelLine: true });
  const topArc = new Graphics()
    .arc(app.screen.width * 0.5, app.screen.height / 2 - boxHeight / 2
      , goalRadius, 0, Math.PI)
    .stroke({ width: 5, color: 0xffffff });
  const botArc = new Graphics()
    .arc(app.screen.width * 0.5, app.screen.height / 2 + boxHeight / 2
      , goalRadius, Math.PI, Math.PI * 2)
    .stroke({ width: 5, color: 0xffffff });

  const topScoreText = new Text({ text: '0', style: { fontFamily: 'Lineal', fontSize: 50 } })
  topScoreText.anchor.set(0.5);
  topScoreText.x = app.screen.width / 2;
  topScoreText.y = app.screen.height / 2 - app.screen.height * 0.05;
  const botScoreText = new Text({ text: '0', style: { fontFamily: 'Lineal', fontSize: 50 } })
  botScoreText.anchor.set(0.5);
  botScoreText.x = app.screen.width / 2;
  botScoreText.y = app.screen.height / 2 + app.screen.height * 0.05;

  app.stage.addChild(middleLine);
  app.stage.addChild(topLine);
  app.stage.addChild(botLine);
  app.stage.addChild(topArc);
  app.stage.addChild(botArc);
  app.stage.addChild(topScoreText);
  app.stage.addChild(botScoreText);

  const botMovementHotkeys = CreateMovementHotkeySet(keyIconTexture, 'W', 'A', 'S', 'D', app.screen.width * 0.62, app.screen.height * 0.7);
  const topMovementHotkeys = CreateMovementHotkeySet(keyIconTexture, 'i', '-', 'v', '_', app.screen.width * 0.38, app.screen.height * 0.3);
  app.stage.addChild(botMovementHotkeys);
  app.stage.addChild(topMovementHotkeys);

  const topSpeed = CreateSpeedText(screen.width * 0.62, app.screen.height * 0.3);
  const botSpeed = CreateSpeedText(screen.width * 0.38, app.screen.height * 0.7);
  app.stage.addChild(topSpeed);
  app.stage.addChild(botSpeed);

  ball = new Graphics()
    .circle(app.screen.width / 2, app.screen.height / 2, ballRadius)
    .fill(tekhelet);
  ball.x = Math.random() * 20 - 10;
  ball.y = boxHeight / 5 + ballRadius;
  const topPuck = CreatePuck(app.screen.width / 2, app.screen.height / 2, puckRadius, coral, -boxHeight * 0.45)
  const botPuck = CreatePuck(app.screen.width / 2, app.screen.height / 2, puckRadius, coral, boxHeight * 0.45)

  app.stage.addChild(ball);
  app.stage.addChild(topPuck);
  app.stage.addChild(botPuck);

  let elapsed = 0.0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    if (botUp) { botPuckYSpeed -= 0.1 }
    if (botDown) { botPuckYSpeed += 0.1 }
    if (botLeft) { botPuckXSpeed -= 0.1 }
    if (botRight) { botPuckXSpeed += 0.1 }
    if (topUp) { topPuckYSpeed -= 0.1 }
    if (topDown) { topPuckYSpeed += 0.1 }
    if (topLeft) { topPuckXSpeed -= 0.1 }
    if (topRight) { topPuckXSpeed += 0.1 }

    botPuck.y += botPuckYSpeed;
    botPuck.y = Math.min(botPuck.y, boxHeight / 2);
    botPuck.y = Math.max(botPuck.y, app.screen.height * 0.1);
    botPuck.x += botPuckXSpeed;
    botPuck.x = Math.min(botPuck.x, boxWidth / 2);
    botPuck.x = Math.max(botPuck.x, -boxWidth / 2);

    topPuck.y += topPuckYSpeed;
    topPuck.y = Math.min(topPuck.y, -app.screen.height * 0.1);
    topPuck.y = Math.max(topPuck.y, -boxHeight / 2);
    topPuck.x += topPuckXSpeed;
    topPuck.x = Math.min(topPuck.x, boxWidth / 2);
    topPuck.x = Math.max(topPuck.x, -boxWidth / 2);

    ball.x += ballXSpeed;
    ball.y += ballYSpeed;

    if (vertWallCollision(ball, box)) {
      ballXSpeed *= -1;
    }
    if (topWallCollision(ball, box)) {
      const bounds1 = ball.getBounds();
      const x = bounds1.x + bounds1.width / 2;
      const xRange = x > app.screen.width * 0.5 - goalRadius && x < app.screen.width * 0.5 + goalRadius;
      if (xRange) {
        botScore++;
        botScoreText.text = botScore;
      }
      ballYSpeed *= -1;
    }
    if (botWallCollision(ball, box)) {
      const bounds1 = ball.getBounds();
      const x = bounds1.x + bounds1.width / 2;
      const xRange = x > app.screen.width * 0.5 - goalRadius && x < app.screen.width * 0.5 + goalRadius;
      if (xRange) {
        topScore++;
        topScoreText.text = topScore;
      }
      ballYSpeed *= -1;
    }
    if (testForCircleCollision(ball, botPuck)) {
      const { obj1ChangeX, obj1ChangeY, obj2ChangeX, obj2ChangeY } = CollisionVector(ball, botPuck, ballXSpeed, ballYSpeed, botPuckXSpeed, botPuckYSpeed, ballMass, puckMass);
      ballXSpeed -= obj1ChangeX;
      ballYSpeed -= obj1ChangeY;
      botPuckXSpeed += obj2ChangeX;
      botPuckYSpeed += obj2ChangeY;
    }
    if (testForCircleCollision(ball, topPuck)) {
      const { obj1ChangeX, obj1ChangeY, obj2ChangeX, obj2ChangeY } = CollisionVector(ball, topPuck, ballXSpeed, ballYSpeed, topPuckXSpeed, topPuckYSpeed, ballMass, puckMass);
      ballXSpeed -= obj1ChangeX;
      ballYSpeed -= obj1ChangeY;
      topPuckXSpeed += obj2ChangeX;
      topPuckYSpeed += obj2ChangeY;
    }

    (topSpeed.children[0] as Text).text = 'X: ' + Math.round(topPuckXSpeed * 10);
    (topSpeed.children[1] as Text).text = 'Y: ' + Math.round(topPuckYSpeed * 10);
    (botSpeed.children[0] as Text).text = 'X: ' + Math.round(botPuckXSpeed * 10);
    (botSpeed.children[1] as Text).text = 'Y: ' + Math.round(botPuckYSpeed * 10);
  })

  function KeyboardEvents() {
    document.addEventListener("keydown", (event) => {
      if (event.key == 'ArrowUp') topUp = true;
      if (event.key == 'ArrowLeft') topLeft = true;
      if (event.key == 'ArrowDown') topDown = true;
      if (event.key == 'ArrowRight') topRight = true;
      if (event.key == 'w') botUp = true;
      if (event.key == 'a') botLeft = true;
      if (event.key == 's') botDown = true;
      if (event.key == 'd') botRight = true;
    })

    document.addEventListener("keyup", (event) => {
      if (event.key == 'ArrowUp') topUp = false;
      if (event.key == 'ArrowLeft') topLeft = false;
      if (event.key == 'ArrowDown') topDown = false;
      if (event.key == 'ArrowRight') topRight = false;
      if (event.key == 'w') botUp = false;
      if (event.key == 'a') botLeft = false;
      if (event.key == 's') botDown = false;
      if (event.key == 'd') botRight = false;
    })
  }
}


