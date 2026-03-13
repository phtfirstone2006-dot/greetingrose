const sketch4 = (p) => {
  let particles = [];
  let fireflies = [];
  let bubbles = [];
  const maxBubbles = 30;
  let nextBubbleTime = 0;
  let canvas;

  let fallingPetals = [];
  let bigFallingPetals = [];
  let wishes = [];
  let giantCenterRose = null;
  let bloomPetals = [];
  let bloomActive = false;

  // Title animation variables
  let titleStartTime = 0;
  let lcxceoImage = null;
  let animationStarted = false;

  // MÀU CHỦ ĐẠO: #0066CC (RGB: 0, 102, 204)
  const BLUE_BASE = { r: 0, g: 102, b: 204 };

  // Wish phrases
  const wishTemplates = [
    "6/4 đỉnh 8386\n{name} mãi phong độ luôn 😎",
    "6/4 của {name}\nngầu như nam chính phim luôn ✨",
    "Chàng trai trăm người mê\n{name} mãi đỉnh mãi đỉnh 🔥",
    "{name} ơi, 6/4 hôm nay\ncool ngầu vô đối luôn nha 😆",
    "Chúc {name} có tất cả\nngoại trừ deadline và stress 😌",
    "6/4 này {name}\nCười thật tươi và ăn thật nhiều 😋",
    "Chúc {name} 6/4 thật ý nghĩa\nHọc ít thôi mà điểm vẫn cao 📚",
    "{name} ơi, vạn sự như ý\nGame thắng liên tục luôn nha 🎮",
    "6/4 này {name}\nđẹp trai vượt mức cho phép 😏",
    "6/4 vui nhé {name}\nLuôn mạnh mẽ và thành công 💪",
    "Chúc {name}\nLuôn là cây hài của CLB 😂",
    "6/4 của {name}\nPhong độ ngời ngời như idol 🌟",
    "Chúc {name}\nLuôn vui vẻ và tràn đầy năng lượng ⚡",
    "6/4 này {name}\nĐược mọi người khen đẹp trai hoài 😆",
    "{name} ơi\nChúc hôm nay may mắn ngập tràn 🍀",
    "6/4 chúc {name}\nHọc giỏi – chơi giỏi – ngủ cũng giỏi 😴",
    "Chúc {name}\nLuôn là chiến thần của CLB 🔥",
    "6/4 của {name}\nCười nhiều hơn học bài một chút 😁",
    "{name} ơi\nChúc bạn luôn vui và thật phong độ 😎",
    "6/4 này {name}\nMãi là chàng trai năng lượng nhất CLB "
  ];

  function buildWishMessage() {
    const rawName = (window.receiverName && window.receiverName.trim()) || "bạn";
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const index = p.floor(p.random(wishTemplates.length));
    const template = wishTemplates[index];
    return template.replace(/\{name\}/g, name);
  }

  function petalShape(size) {
    const s = size;
    p.beginShape();
    p.vertex(0, -s * 0.5);
    p.bezierVertex( s * 0.38, -s * 0.18,  s * 0.38, s * 0.18, 0,  s * 0.5);
    p.bezierVertex(-s * 0.38,  s * 0.18, -s * 0.38, -s * 0.18, 0, -s * 0.5);
    p.endShape(p.CLOSE);
  }

  p.setup = () => {
    const parent = document.getElementById('section4');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section4');
    p.frameRate(60);

    titleStartTime = p.millis();

    for (let i = 0; i < 120; i++) particles.push(new Particle());
    for (let i = 0; i < 20; i++) fireflies.push(new Firefly(p.random(2, 1)));

    for (let i = 0; i < 30; i++) fallingPetals.push(new FallingPetal(p.random(w), p.random(-h, h)));
    for (let i = 0; i < 8;  i++) bigFallingPetals.push(new BigFallingPetal(p.random(w), p.random(-h, h)));

    giantCenterRose = new GiantStationary(w / 2, h / 2);
    nextBubbleTime = p.millis() + p.random(300, 3000);
  };

  function triggerBloom(centerX, centerY) {
    bloomPetals = [];
    const bloomCount = 28;
    const now = p.millis();
    for (let i = 0; i < bloomCount; i++) {
      bloomPetals.push(new BloomPetal(centerX, centerY, now + i * 35));
    }
    bloomActive = true;
  }

  p.draw = () => {
    setGradientBackground();
    drawCursorGlow();

    for (let ptl of particles) { ptl.update(); ptl.show(); }
    for (let ff  of fireflies)  { ff.update();  ff.show();  }

    if (bloomActive) {
      const currentTime = p.millis();
      for (let i = bloomPetals.length - 1; i >= 0; i--) {
        bloomPetals[i].update(currentTime);
        bloomPetals[i].display();
        if (bloomPetals[i].done) bloomPetals.splice(i, 1);
      }
      if (bloomPetals.length === 0) bloomActive = false;
    }

    for (let petal of fallingPetals)    { petal.move(); petal.display(); }
    for (let petal of bigFallingPetals) { petal.move(); petal.display(); }

    if (giantCenterRose) giantCenterRose.display();

    for (let i = wishes.length - 1; i >= 0; i--) {
      wishes[i].update();
      wishes[i].display();
      if (wishes[i].alpha <= 0) wishes.splice(i, 1);
    }

    handleBubbles();

    const currentReceiverName = window.receiverName || "";

    if (window.animationStarted && !animationStarted) {
      animationStarted = true;
      titleStartTime = p.millis();
      triggerBloom(p.width / 2, p.height / 2);
    }

    if (animationStarted) {
      const titleSize = p.width < 768 ? p.width * 0.06 : 60;
      const titlePopDuration = 3000;
      const titleFadeDuration = 1500;
      const elapsedTime  = p.millis() - titleStartTime;
      const popProgress  = p.constrain(elapsedTime / titlePopDuration, 0, 1);
      const fadeProgress = p.constrain((elapsedTime - titlePopDuration) / titleFadeDuration, 0, 1);
      const easeProgress = 1 - p.pow(1 - popProgress, 2);
      const scale = p.lerp(0.5, 1, easeProgress);
      const titleAlpha = p.lerp(255, 0, fadeProgress);

      p.push();
      p.translate(p.width / 2, p.height / 2);
      p.textAlign(p.CENTER, p.CENTER);
      p.noStroke();
      p.textFont('Dancing Script');

      if (currentReceiverName.length > 0) {
        const lineHeight = titleSize * scale * 1.2;
        p.fill(255, titleAlpha);
        p.textSize(titleSize * scale);
        p.text("CLB QGPro xin chúc", 0, -lineHeight);
        p.fill(0, 191, 255, titleAlpha); // Xanh sáng cho tên
        p.textSize(titleSize * 1.28 * scale);
        p.text(currentReceiverName, 0, 0);
        p.fill(255, titleAlpha);
        p.textSize(titleSize * scale);
        p.text("ngày 6/4 tuyệt vời", 0, lineHeight);
      } else {
        p.fill(255, titleAlpha);
        p.textSize(titleSize * scale);
        p.text("CLB QGPro xin chúc\ncác bạn QGPro ngày 6/4 tuyệt vời", 0, 0);
      }
      p.pop();
    }
  };

  p.windowResized = () => {
    const parent = document.getElementById('section4');
    p.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  p.mousePressed = () => {
    if (giantCenterRose && giantCenterRose.isClicked(p.mouseX, p.mouseY)) {
      wishes.push(new Wish(giantCenterRose.x, giantCenterRose.y, buildWishMessage(), giantCenterRose));
      return false;
    }
    for (let b of bigFallingPetals) {
      if (p.dist(p.mouseX, p.mouseY, b.x, b.y) < b.size) {
        wishes.push(new Wish(b.x, b.y, buildWishMessage(), b));
        return false;
      }
    }
  };

  function setGradientBackground() {
    const ctx = p.drawingContext;
    const grad = ctx.createLinearGradient(0, 0, 0, p.height);
    grad.addColorStop(0, '#050B1A'); // Đổi sang tông xanh đen
    grad.addColorStop(1, '#02030D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, p.width, p.height);
  }

  function drawCursorGlow() {
    const r = 320;
    const grad = p.drawingContext.createRadialGradient(p.mouseX, p.mouseY, 0, p.mouseX, p.mouseY, r);
    grad.addColorStop(0, 'rgba(10, 35, 80, 1.2)'); // Glow xanh
    grad.addColorStop(1, 'rgba(10, 35, 80, 0)');
    p.drawingContext.fillStyle = grad;
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
  }

  function handleBubbles() {
    const now = p.millis();
    if (now > nextBubbleTime && bubbles.length < maxBubbles) {
      const x = p.mouseX || p.width / 2;
      const y = p.mouseY || p.height / 2;
      bubbles.push(new Bubble(x + p.random(-5, 5), y + p.random(-5, 5)));
      nextBubbleTime = now + p.random(100, 1000);
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].show();
      if (bubbles[i].pos.y + bubbles[i].size < 0) bubbles.splice(i, 1);
    }
  }

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.1, 0.1));
      this.size = p.random(1, 3);
      this.alpha = p.random(50, 150);
    }
    update() {
      this.pos.add(this.vel);
      if (this.pos.x > p.width) this.pos.x = 0; else if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0; else if (this.pos.y < 0) this.pos.y = p.height;
    }
    show() {
      p.noStroke();
      p.fill(180, 220, 255, this.alpha); // Hạt bụi xanh
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  class Firefly {
    constructor(size) {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.size = size;
      this.baseAlpha = 25;
      this.speed = p5.Vector.random2D().mult(p.random(0.1, 2));
    }
    update() {
      this.pos.add(this.speed);
      if (this.pos.x > p.width) this.pos.x = 0; else if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0; else if (this.pos.y < 0) this.pos.y = p.height;
    }
    show() {
      const d = p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
      let bf = p.constrain(1 - d / 400, 0, 1);
      const glowAlpha = bf * 200;
      p.noStroke();
      p.fill(200, 230, 255, this.baseAlpha + bf * 230);
      p.ellipse(this.pos.x, this.pos.y, this.size);
      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = p.color(100, 200, 255, glowAlpha);
      p.ellipse(this.pos.x, this.pos.y, this.size + 8);
      p.drawingContext.shadowBlur = 0;
    }
  }

  class Bubble {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1, -2));
      this.alpha = 50;
      this.size = p.random(3, 8);
    }
    update() { this.pos.add(this.vel); }
    show() {
      p.noStroke();
      p.fill(200, 220, 255, this.alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  class FallingPetal {
    constructor(x, y) {
      this.x = x; this.y = y;
      const sm = p.width < 768 ? 0.5 : 1;
      this.size = p.random(14, 28) * sm;
      this.speed = p.random(0.5, 1.6);
      this.drift = p.random(-0.4, 0.4);
      this.rotation = p.random(p.TWO_PI);
      this.rotSpeed = p.random(-0.025, 0.025);
      this.sway = p.random(p.TWO_PI);
      this.swaySpeed = p.random(0.012, 0.032);
      this.swayAmt = p.random(0.4, 1.1);
      this.alpha = p.random(100, 180);
      // Palette Xanh dương: #0066CC và các biến thể
      this.r = 0;
      this.g = p.random(80, 130);
      this.b = p.random(200, 255);
    }
    move() {
      this.y += this.speed;
      this.sway += this.swaySpeed;
      this.x += p.sin(this.sway) * this.swayAmt + this.drift;
      this.rotation += this.rotSpeed;
      if (this.y - this.size > p.height) { this.y = -this.size; this.x = p.random(p.width); }
    }
    display() {
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.rotation);
      p.noStroke();
      for (let i = 5; i > 0; i--) {
        p.fill(this.r, this.g, this.b, (this.alpha / 5) * i * 0.18);
        petalShape(this.size + i * 5);
      }
      p.fill(this.r, this.g, this.b, this.alpha);
      petalShape(this.size);
      p.pop();
    }
  }

  class BigFallingPetal extends FallingPetal {
    constructor(x, y) {
      super(x, y);
      const sm = p.width < 768 ? 0.5 : 1;
      this.size = p.random(55, 100) * sm;
      this.alpha = p.random(160, 220);
      this.r = 0; this.g = p.random(100, 150); this.b = 255;
    }
  }

  class BloomPetal {
    constructor(centerX, centerY, startTime) {
      this.cx = centerX; this.cy = centerY; this.startTime = startTime;
      this.duration = p.random(1100, 1800);
      this.angle = p.random(p.TWO_PI);
      const maxDim = Math.min(p.width, p.height);
      this.maxDistance = p.random(maxDim * 0.18, maxDim * 0.40);
      this.baseSize = p.random(20, 60);
      this.visible = false; this.done = false;
      this.progress = 0; this.x = centerX; this.y = centerY;
      this.rotation = p.random(p.TWO_PI);
      this.r = 0; this.g = p.random(100, 160); this.b = 255;
    }
    update(currentTime) {
      const elapsed = currentTime - this.startTime;
      if (elapsed < 0) return;
      this.visible = true;
      this.progress = p.constrain(elapsed / this.duration, 0, 1);
      const ease = 1 - p.pow(1 - this.progress, 3);
      this.x = this.cx + p.cos(this.angle) * this.maxDistance * ease;
      this.y = this.cy + p.sin(this.angle) * this.maxDistance * ease;
      const ms = p.width < 768 ? 0.55 : 1;
      this.size = this.baseSize * (0.55 + ease * 0.9) * ms;
      this.alpha = p.lerp(255, 0, this.progress);
      this.rotation += 0.035;
      if (this.progress >= 1) this.done = true;
    }
    display() {
      if (!this.visible || this.done) return;
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.rotation);
      p.noStroke();
      for (let i = 6; i > 0; i--) {
        p.fill(this.r, this.g, this.b, (this.alpha / 6) * i * 0.22);
        petalShape(this.size + i * 7);
      }
      p.fill(this.r, this.g, this.b, this.alpha);
      petalShape(this.size);
      p.pop();
    }
  }

  class GiantStationary {
    constructor(x, y) {
      this.x = x; this.y = y;
      const sm = p.width < 768 ? 0.4 : 1;
      this.size = 300 * sm;
      this.alpha = 200;
    }
    isClicked(mx, my) { return p.dist(mx, my, this.x, this.y) < this.size * 0.5; }
    display() {
      p.push();
      p.translate(this.x, this.y);
      p.noStroke();
      const s = this.size;
      const t = p.frameCount * 0.008;

      for (let i = 18; i > 0; i--) {
        p.fill(0, 102, 204, (this.alpha / i) * 0.07);
        p.circle(0, 0, s + i * 12);
      }

      // Lớp cánh hoa chuyển dần từ Xanh đậm sang Xanh nhạt
      const layers = [
        { count: 9, radius: s * 0.46, pSize: s * 0.29, speed: 0.25, r: 0,   g: 51,  b: 102 },
        { count: 8, radius: s * 0.34, pSize: s * 0.26, speed: 0.40, r: 0,   g: 76,  b: 153 },
        { count: 7, radius: s * 0.22, pSize: s * 0.22, speed: 0.60, r: 0,   g: 102, b: 204 },
        { count: 6, radius: s * 0.12, pSize: s * 0.18, speed: 0.85, r: 51,  g: 153, b: 255 },
        { count: 5, radius: s * 0.05, pSize: s * 0.13, speed: 1.20, r: 153, g: 204, b: 255 },
      ];

      for (const layer of layers) {
        for (let i = 0; i < layer.count; i++) {
          const angle = (p.TWO_PI / layer.count) * i + t * layer.speed;
          p.push();
          p.translate(p.cos(angle) * layer.radius, p.sin(angle) * layer.radius);
          p.rotate(angle + p.HALF_PI);
          for (let g = 4; g > 0; g--) {
            p.fill(layer.r, layer.g, layer.b, (this.alpha / 4) * g * 0.18);
            petalShape(layer.pSize + g * 5);
          }
          p.fill(layer.r, layer.g, layer.b, this.alpha);
          petalShape(layer.pSize);
          p.pop();
        }
      }
      p.fill(200, 240, 255, this.alpha); // Nhụy xanh trắng sáng
      p.circle(0, 0, s * 0.055);
      p.pop();
    }
  }

  class Wish {
    constructor(x, y, text, target) {
      this.target = target; this.offsetY = 0; this.text = text; this.alpha = 255;
      this.velocityY = (target instanceof GiantStationary) ? -2 : -1;
      const sm = p.width < 768 ? 0.5 : 1;
      this.size = p.random(24, 36) * sm;
      this.lifespan = 400; this.age = 0;
    }
    update() {
      this.age++; this.offsetY += this.velocityY;
      this.alpha = p.map(this.age, 0, this.lifespan, 255, 0);
    }
    display() {
      p.push();
      p.fill(220, 240, 255, this.alpha); // Chữ lời chúc xanh nhạt
      p.textSize(this.size); p.textAlign(p.CENTER, p.CENTER);
      p.textFont('Quicksand');
      p.text(this.text, this.target.x, this.target.y + this.offsetY);
      p.pop();
    }
  }
};

new p5(sketch4, 'section4');