class TextTransitionAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.texts = ['HI!李晴同学.杨木老师', '祝你22岁', '生日快乐'];
        this.currentTextIndex = 0;
        this.isAnimating = false;
        this.animationDuration = 1000; // 1秒过渡
        this.displayDuration = 3000; // 3秒显示
        this.currentTextElement = null;
        this.nextTextElement = null;

        this.init();
        this.startAnimation();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.perspective = '1000px';

        this.createTextElement();
    }

    createTextElement(text = this.texts[0]) {
        const element = document.createElement('div');
        element.style.cssText = `
            position: absolute;
            font-size: 100px;
            font-family: 'FZHei-B01S', 'FZSong-Z02S', 'Microsoft YaHei', sans-serif;
            font-weight: bold;
            color: white;
            text-align: center;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            white-space: nowrap;
            transform: translateZ(0);
            opacity: 0;
            letter-spacing: 2px;
        `;
        element.textContent = text;
        this.container.appendChild(element);
        return element;
    }

    startAnimation() {
        this.isAnimating = true;
        this.currentTextIndex = 0;
        this.currentTextElement = this.createTextElement(this.texts[0]);
        this.fadeIn(this.currentTextElement, () => {
            this.scheduleNextTransition();
        });
    }

    scheduleNextTransition() {
        setTimeout(() => {
            if (this.currentTextIndex < this.texts.length - 1) {
                this.transitionToNextText();
            } else {
                this.fadeOutAndCleanup();
            }
        }, this.displayDuration);
    }

    transitionToNextText() {
        const nextIndex = this.currentTextIndex + 1;
        this.nextTextElement = this.createTextElement(this.texts[nextIndex]);

        this.crossFade(this.currentTextElement, this.nextTextElement, () => {
            this.container.removeChild(this.currentTextElement);
            this.currentTextElement = this.nextTextElement;
            this.currentTextIndex = nextIndex;
            this.scheduleNextTransition();
        });
    }

    fadeOutAndCleanup() {
        this.fadeOut(this.currentTextElement, () => {
            if (this.currentTextElement) {
                this.container.removeChild(this.currentTextElement);
                this.currentTextElement = null;
            }
            this.isAnimating = false;
            console.log('文本动画完成，所有文字已消失');
            
            // 启动图片显示动画
            setTimeout(() => {
                console.log('调用简化版图片动画');
                showCakeImage();
            }, 500);
        });
    }

    fadeIn(element, callback) {
        element.style.opacity = '0';
        element.style.transform = 'translateZ(0) scale(0.8)';
        element.style.transition = `opacity ${this.animationDuration}ms ease-out, transform ${this.animationDuration}ms ease-out`;

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateZ(0) scale(1)';
        }, 10);

        setTimeout(callback, this.animationDuration);
    }

    fadeOut(element, callback) {
        element.style.transition = `opacity ${this.animationDuration}ms ease-in, transform ${this.animationDuration}ms ease-in`;
        element.style.opacity = '0';
        element.style.transform = 'translateZ(0) scale(1.2)';

        setTimeout(callback, this.animationDuration);
    }

    crossFade(outElement, inElement, callback) {
        inElement.style.opacity = '0';
        inElement.style.transform = 'translateZ(0) scale(0.8)';
        inElement.style.transition = `opacity ${this.animationDuration}ms ease-out, transform ${this.animationDuration}ms ease-out`;

        outElement.style.transition = `opacity ${this.animationDuration}ms ease-in, transform ${this.animationDuration}ms ease-in`;

        setTimeout(() => {
            inElement.style.opacity = '1';
            inElement.style.transform = 'translateZ(0) scale(1)';
            outElement.style.opacity = '0';
            outElement.style.transform = 'translateZ(0) scale(1.2)';
        }, 10);

        setTimeout(callback, this.animationDuration);
    }

    stopAnimation() {
        this.isAnimating = false;
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const textAnimation = new TextTransitionAnimation('text-container');
});
