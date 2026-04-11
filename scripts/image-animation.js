class ImageDisplayAnimation {
    constructor(containerId, imagePath) {
        this.container = document.getElementById(containerId);
        this.imagePath = imagePath;
        this.imageElement = null;
        this.isAnimating = false;
        this.animationDuration = 1000; // 1秒过渡
        this.init();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
    }

    startAnimation(callback) {
        this.isAnimating = true;
        this.loadImage(callback);
    }

    loadImage(callback) {
        const img = new Image();
        img.onload = () => {
            console.log('图片加载成功:', this.imagePath);
            console.log('图片尺寸:', img.width, 'x', img.height);
            this.createImageElement(img);
            this.animateImage(callback);
        };
        img.onerror = (error) => {
            console.error('图片加载失败:', this.imagePath);
            console.error('错误详情:', error);
            this.isAnimating = false;
            if (callback) callback();
        };
        img.src = this.imagePath;
        console.log('开始加载图片:', this.imagePath);
    }

    createImageElement(img) {
        this.imageElement = document.createElement('img');
        this.imageElement.src = this.imagePath;
        this.imageElement.alt = '蛋糕';
        this.imageElement.style.cssText = `
            max-width: 80%;
            max-height: 80%;
            object-fit: contain;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity ${this.animationDuration}ms ease-out, transform ${this.animationDuration}ms ease-out;
            will-change: opacity, transform;
            z-index: 10;
            position: relative;
        `;
        this.container.appendChild(this.imageElement);
        console.log('图片元素已创建并添加到容器');
        console.log('容器内容:', this.container.innerHTML);
    }

    animateImage(callback) {
        console.log('开始图片动画');
        console.log('图片元素:', this.imageElement);
        setTimeout(() => {
            if (this.imageElement) {
                console.log('执行淡入动画');
                this.imageElement.style.opacity = '1';
                this.imageElement.style.transform = 'scale(1)';
            } else {
                console.error('图片元素不存在');
            }
            
            setTimeout(() => {
                this.isAnimating = false;
                console.log('图片动画完成');
                if (callback) callback();
            }, this.animationDuration);
        }, 100);
    }

    stopAnimation() {
        this.isAnimating = false;
    }
}
