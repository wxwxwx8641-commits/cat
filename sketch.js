
// 四张动画图片
let frames = [];
let stars = [];

// 图片播放顺序：1 → 2 → 3 → 4 → 3 → 2
let animationOrder = [0, 1, 2, 3, 2, 1];

let currentFrame = 0;
let frameDuration = 150;
let lastFrameTime = 0;

// 图片在画布上的位置和尺寸
let imgX, imgY, imgW, imgH;

function preload() {
  frames[0] = loadImage("frame1.JPG");
  frames[1] = loadImage("frame2.JPG");
  frames[2] = loadImage("frame3.JPG");
  frames[3] = loadImage("frame4.JPG");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
}

function draw() {
  background(15, 15, 35);

  // 计算图片大小，让图片完整显示
  let img = frames[0];
  let s = min(width / img.width, height / img.height);

  imgW = img.width * s;
  imgH = img.height * s;
  imgX = (width - imgW) / 2;
  imgY = (height - imgH) / 2;

  // 自动切换动画帧
  if (millis() - lastFrameTime > frameDuration) {
    currentFrame = (currentFrame + 1) % animationOrder.length;
    lastFrameTime = millis();
  }

  let frameIndex = animationOrder[currentFrame];

  // 显示当前图片
  image(frames[frameIndex], imgX, imgY, imgW, imgH);

  // 绘制闪烁星星
  for (let i = stars.length - 1; i >= 0; i--) {
    let star = stars[i];

    star.life--;

    let blink = map(
      sin(frameCount * star.speed + star.phase),
      -1, 1, 50, 255
    );

    let alpha = map(star.life, 0, 120, 0, 255);
    let a = min(blink, alpha);

    push();
    translate(star.x, star.y);
    noStroke();
    fill(255, 245, 190, a);
    circle(0, 0, star.size);

    stroke(255, 245, 210, a);
    strokeWeight(1);
    line(-star.size * 1.5, 0, star.size * 1.5, 0);
    line(0, -star.size * 1.5, 0, star.size * 1.5);
    pop();

    if (star.life <= 0) {
      stars.splice(i, 1);
    }
  }
}

// 统一处理鼠标点击和手机触屏
function createStarsAt(x, y) {

  // 只允许点击图片上半部分
  if (
    x < imgX || x > imgX + imgW ||
    y < imgY || y > imgY + imgH / 2
  ) {
    return;
  }

  let count = floor(random(6, 14));

  for (let i = 0; i < count; i++) {
    stars.push({
      x: constrain(random(x - 40, x + 40), imgX, imgX + imgW),
      y: constrain(random(y - 40, y + 40), imgY, imgY + imgH / 2),
      size: random(2, 6),
      speed: random(0.05, 0.15),
      phase: random(TWO_PI),
      life: 120
    });
  }
}

// 电脑鼠标点击
function mousePressed() {
  createStarsAt(mouseX, mouseY);
}

// 手机触屏
function touchStarted() {
  if (touches.length > 0) {
    createStarsAt(touches[0].x, touches[0].y);
  }

  return false;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
