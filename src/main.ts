import { Application, Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import testForAABB from "./aabb";

const app = new Application();
let gameStarted = false;
let ball: Graphics;
let ballDirection: number;
const startBallSpeed = 5;
const maxBallSpeed = 20;
let ballSpeed = 5;
let playerSpeed = 5;
let text: Text;
let topScoreText: Text;
let botScoreText: Text;
let topScore: number = 0;
let botScore: number = 0;
let containerD: Container;
let containerF: Container;
let containerJ: Container;
let containerK: Container;
let pressedD = false;
let pressedF = false;
let pressedJ = false;
let pressedK = false;

(async () => {
  await setup();
})();

async function setup() {
  KeyboardEvents();
  Assets.addBundle('fonts', [
    { alias: 'ChaChicle', src: 'https://pixijs.com/assets/webfont-loader/ChaChicle.ttf' },
    { alias: 'Lineal', src: 'https://pixijs.com/assets/webfont-loader/Lineal.otf' },
    { alias: 'Dotrice Regular', src: 'https://pixijs.com/assets/webfont-loader/Dotrice-Regular.woff' },
    { alias: 'Crosterian', src: 'https://pixijs.com/assets/webfont-loader/Crosterian.woff2' },
  ]);

  await Assets.loadBundle('fonts');

  await app.init({ background: '#1099bb', resizeTo: window });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const boxWidth = app.screen.width / 2;
  const boxHeight = app.screen.height * 3 / 4;
  const width = 120;
  const height = 20;
  const ballRadius = 10;

  ballDirection = Math.random() * Math.PI * 2;

  let box = new Graphics()
    .rect((app.screen.width) / 2 - (boxWidth / 2), (app.screen.height) / 2 - boxHeight / 2, boxWidth, boxHeight)
    .fill('pink');

  let top = new Graphics()
    .rect((app.screen.width - width) / 2, (app.screen.height) / 6 - height / 2, width, height)
    .fill('navy');
  top.pivot = 0.5;

  let bot = new Graphics()
    .rect((app.screen.width - width) / 2, (app.screen.height * 5) / 6 - height / 2, width, height)
    .fill('navy');

  app.stage.addChild(box);
  app.stage.addChild(top);
  app.stage.addChild(bot);

  ball = new Graphics()
    .circle(app.screen.width / 2, app.screen.height / 2, ballRadius)
    .fill('purple');

  app.stage.addChild(ball);

  text = new Text({ text: 'START', style: { fontFamily: 'Lineal', fontSize: 100 } })
  text.eventMode = 'static';
  text.cursor = 'pointer';
  text.on('pointerdown', Start);
  text.x = app.screen.width / 2 - text.width / 2;
  text.y = app.screen.height / 2 - text.height / 2;

  app.stage.addChild(text);

  topScoreText = new Text({ text: '0', style: { fontFamily: 'Lineal', fontSize: 50 } });
  topScoreText.anchor.set(0.5);
  topScoreText.x = app.screen.width / 2;
  topScoreText.y = app.screen.height / 2 - boxHeight / 4;

  botScoreText = new Text({ text: '0', style: { fontFamily: 'Lineal', fontSize: 50 } });
  botScoreText.anchor.set(0.5);
  botScoreText.x = app.screen.width / 2;
  botScoreText.y = app.screen.height / 2 + boxHeight / 4;

  app.stage.addChild(topScoreText);
  app.stage.addChild(botScoreText);

  let keyiconTexture = await Assets.load('assets/keyicon.png');
  containerD = new Container();
  containerF = new Container();
  containerJ = new Container();
  containerK = new Container();
  let tooltipD = new Sprite(keyiconTexture);
  let tooltipF = new Sprite(keyiconTexture);
  let tooltipJ = new Sprite(keyiconTexture);
  let tooltipK = new Sprite(keyiconTexture);
  tooltipD.anchor.set(0.5);
  tooltipF.anchor.set(0.5);
  tooltipJ.anchor.set(0.5);
  tooltipK.anchor.set(0.5);
  containerD.x = app.screen.width / 2 - boxWidth * 0.4;
  containerD.y = app.screen.height / 2 - boxHeight * 0.35;
  containerF.x = app.screen.width / 2 + boxWidth * 0.4;
  containerF.y = app.screen.height / 2 - boxHeight * 0.35;
  containerJ.x = app.screen.width / 2 - boxWidth * 0.4;
  containerJ.y = app.screen.height / 2 + boxHeight * 0.35;
  containerK.x = app.screen.width / 2 + boxWidth * 0.4;
  containerK.y = app.screen.height / 2 + boxHeight * 0.35;
  tooltipD.scale = 0.3;
  tooltipF.scale = 0.3;
  tooltipJ.scale = 0.3;
  tooltipK.scale = 0.3;

  const textD = new Text({ text: 'D', style: { fontFamily: 'Lineal', fontSize: 35 } });
  const textF = new Text({ text: 'F', style: { fontFamily: 'Lineal', fontSize: 35 } });
  const textJ = new Text({ text: 'J', style: { fontFamily: 'Lineal', fontSize: 35 } });
  const textK = new Text({ text: 'K', style: { fontFamily: 'Lineal', fontSize: 35 } });
  textD.anchor.set(0.5);
  textF.anchor.set(0.5);
  textJ.anchor.set(0.5);
  textK.anchor.set(0.5);
  containerD.addChild(tooltipD);
  containerD.addChild(textD);
  containerF.addChild(tooltipF);
  containerF.addChild(textF);
  containerJ.addChild(tooltipJ);
  containerJ.addChild(textJ);
  containerK.addChild(tooltipK);
  containerK.addChild(textK);

  let elapsed = 0.0;
  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime;
    if (pressedD) top.x = Math.max(-boxWidth / 2 + width / 2, top.x - playerSpeed);
    if (pressedF) top.x = Math.min(boxWidth / 2 - width / 2, top.x + playerSpeed);
    if (pressedJ) bot.x = Math.max(-boxWidth / 2 + width / 2, bot.x - playerSpeed);
    if (pressedK) bot.x = Math.min(boxWidth / 2 - width / 2, bot.x + playerSpeed);
    const horiWallCollision = ball.y > boxHeight / 2 - ballRadius
      || ball.y < -(boxHeight / 2 - ballRadius)
      || testForAABB(ball, bot)
      || testForAABB(ball, top);
    const vertWallCollision = ball.x > boxWidth / 2 - ballRadius
      || ball.x < -(boxWidth / 2 - ballRadius)
    if (horiWallCollision) {
      ballDirection = Math.PI - ballDirection;
      if (gameStarted) ballSpeed = Math.min(maxBallSpeed, ballSpeed * 1.1);
    }
    if (vertWallCollision) {
      ballDirection *= -1;
    }
    ball.x += Math.sin(ballDirection) * ballSpeed;
    ball.y += Math.cos(ballDirection) * ballSpeed;

    if (ball.y > boxHeight / 2 - ballRadius) {
      TopWin();
    }

    if (ball.y < -(boxHeight / 2 - ballRadius)) {
      BotWin();
    }
  })
}

function Start() {
  ball.x = 0;
  ball.y = 0;
  ballDirection = Math.random() * Math.PI * 2;
  app.stage.removeChild(text);
  app.stage.addChild(containerD);
  app.stage.addChild(containerF);
  app.stage.addChild(containerJ);
  app.stage.addChild(containerK);
  gameStarted = true;
}

function TopWin() {
  if (!gameStarted) return;
  GameOver();
  topScore++;
  topScoreText.text = topScore;
}

function BotWin() {
  if (!gameStarted) return;
  GameOver();
  botScore++;
  botScoreText.text = botScore;
}
function GameOver() {
  ballSpeed = startBallSpeed;
  app.stage.addChild(text);
  gameStarted = false;
  app.stage.removeChild(containerD);
  app.stage.removeChild(containerF);
  app.stage.removeChild(containerJ);
  app.stage.removeChild(containerK);
}

function KeyboardEvents() {
  document.addEventListener("keydown", (event) => {
    if (event.key == 'd') pressedD = true;
    if (event.key == 'f') pressedF = true;
    if (event.key == 'j') pressedJ = true;
    if (event.key == 'k') pressedK = true;
  });

  document.addEventListener("keyup", (event) => {
    if (event.key == 'd') pressedD = false;
    if (event.key == 'f') pressedF = false;
    if (event.key == 'j') pressedJ = false;
    if (event.key == 'k') pressedK = false;
  });
}
