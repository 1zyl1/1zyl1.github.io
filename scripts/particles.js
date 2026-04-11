class Particle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = 2; // 固定半径，确保大小均匀
        this.color = this.getRandomColor();
        this.velocity = {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3
        };
        this.friction = 0.98;
        this.gravity = 0;
        this.opacity = 1;
        this.targetX = x;
        this.targetY = y;
    }

    getRandomColor() {
        // 生成柔和的白色系颜色
        const r = Math.floor(200 + Math.random() * 55);
        const g = Math.floor(200 + Math.random() * 55);
        const b = Math.floor(200 + Math.random() * 55);
        return `rgb(${r}, ${g}, ${b})`;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        // 可以选择圆形或方形
        if (Math.random() > 0.5) {
            // 圆形
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        } else {
            // 方形
            ctx.rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        // 添加发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(distance * 0.08, 4);

        this.velocity.x += (dx / distance) * force;
        this.velocity.y += (dy / distance) * force;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (distance < 1) {
            this.opacity = 1;
        }
    }

    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    reset() {
        this.opacity = 0;
        this.velocity = {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5
        };
    }
}

class ParticleTextAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.texts = ['HI!李晴同学.杨木老师', '祝你22岁', '生日快乐'];
        this.currentTextIndex = 0;
        this.animationPhase = 'init'; // init, forming, formed, transitioning
        this.transitionProgress = 0;
        this.fontSize = 60;
        this.textCenterX = 0;
        this.textCenterY = 0;
        this.textPositions = [];
        this.nextTextPositions = [];
        this.animationSpeed = 1/60; // 60fps
        this.particleCount = 600; // 增加粒子数量，提高文字辨识度
        this.isAnimating = false;
        this.formingTime = 60; // 1秒 @ 60fps
        this.displayTime = 180; // 3秒 @ 60fps
        this.formingCounter = 0;

        this.resizeCanvas();
        this.initParticles();
        this.bindEvents();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.textCenterX = this.canvas.width / 2;
        this.textCenterY = this.canvas.height / 2;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 2 + 1;
            const particle = new Particle(x, y, radius);
            this.particles.push(particle);
        }
    }

    getTextPositions(text) {
        const positions = [];
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;

        tempCtx.font = `bold ${this.fontSize}px 'FZHei-B01S', 'FZSong-Z02S', 'Microsoft YaHei', sans-serif`;
        tempCtx.fillStyle = '#ffffff';
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';
        tempCtx.fillText(text, this.textCenterX, this.textCenterY);

        const imageData = tempCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let y = 0; y < this.canvas.height; y += 3) {
            for (let x = 0; x < this.canvas.width; x += 3) {
                const index = (y * this.canvas.width + x) * 4;
                if (data[index + 3] > 128) {
                    positions.push({ x, y });
                }
            }
        }

        return positions;
    }

    startAnimation() {
        this.isAnimating = true;
        this.animationPhase = 'init';
        this.currentTextIndex = 0;
        this.transitionProgress = 0;
        this.formingCounter = 0;
        this.initParticles();
    }

    update() {
        if (!this.isAnimating) return;

        switch (this.animationPhase) {
            case 'init':
                this.initAnimation();
                break;
            case 'forming':
                this.formText();
                break;
            case 'formed':
                this.waitBeforeTransition();
                break;
            case 'transitioning':
                this.transitionToNextText();
                break;
        }

        this.particles.forEach(particle => particle.update());
    }

    initAnimation() {
        const text = this.texts[this.currentTextIndex];
        this.textPositions = this.getTextPositions(text);

        this.particles.forEach((particle, index) => {
            if (index < this.textPositions.length) {
                particle.setTarget(this.textPositions[index].x, this.textPositions[index].y);
            } else {
                particle.setTarget(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            }
        });

        this.animationPhase = 'forming';
        this.formingCounter = 0;
    }

    formText() {
        this.formingCounter++;
        
        if (this.formingCounter >= this.formingTime) {
            this.animationPhase = 'formed';
            this.transitionProgress = 0;
        }
    }

    waitBeforeTransition() {
        this.transitionProgress++;
        if (this.transitionProgress >= this.displayTime) {
            this.transitionProgress = 0;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            const nextText = this.texts[this.currentTextIndex];
            this.nextTextPositions = this.getTextPositions(nextText);
            this.animationPhase = 'transitioning';
        }
    }

    transitionToNextText() {
        this.formingCounter++;

        this.particles.forEach((particle, index) => {
            if (index < this.nextTextPositions.length) {
                const targetX = this.nextTextPositions[index].x;
                const targetY = this.nextTextPositions[index].y;
                particle.setTarget(targetX, targetY);
            } else {
                particle.setTarget(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
            }
        });

        if (this.formingCounter >= this.formingTime) {
            this.textPositions = this.nextTextPositions;
            this.animationPhase = 'formed';
            this.transitionProgress = 0;
            this.formingCounter = 0;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const particleAnimation = new ParticleTextAnimation('particles-canvas');
    particleAnimation.startAnimation();
});
