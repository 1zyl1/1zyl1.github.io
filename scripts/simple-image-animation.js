// 性能监控变量
let performanceData = {
    startTime: performance.now(),
    renderTime: 0,
    animationFrameCount: 0,
    lastFrameTime: 0,
    frameTimes: []
};

// 性能监控函数
function monitorPerformance() {
    const now = performance.now();
    performanceData.animationFrameCount++;
    
    if (performanceData.lastFrameTime > 0) {
        const frameTime = now - performanceData.lastFrameTime;
        performanceData.frameTimes.push(frameTime);
    }
    
    performanceData.lastFrameTime = now;
    
    if (performanceData.animationFrameCount >= 60) {
        const avgFrameTime = performanceData.frameTimes.reduce((sum, time) => sum + time, 0) / performanceData.frameTimes.length;
        const fps = 1000 / avgFrameTime;
        
        console.log('性能监控数据:');
        console.log(`平均帧率: ${fps.toFixed(2)} FPS`);
        console.log(`平均帧时间: ${avgFrameTime.toFixed(2)} ms`);
        console.log(`总渲染时间: ${(now - performanceData.startTime).toFixed(2)} ms`);
        
        // 重置监控数据
        performanceData = {
            startTime: performance.now(),
            renderTime: 0,
            animationFrameCount: 0,
            lastFrameTime: 0,
            frameTimes: []
        };
    }
}

function showCakeImage() {
    console.log('开始显示图片');
    
    const container = document.getElementById('text-container');
    
    // 移除可能存在的数字"2"元素
    const existing2s = document.querySelectorAll('div');
    existing2s.forEach(el => {
        if (el.textContent === '2' && el.style.fontSize === '180px') {
            if (el.parentNode) el.parentNode.removeChild(el);
        }
    });
    
    // 创建主容器，包含图片和文字
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    `;
    
    // 创建图片容器
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        width: 100%;
        max-width: 90%;
    `;
    
    // 预加载图片
    const images = [
        { src: 'wsq.png', alt: '图片1' },
        { src: 'dg.png', alt: '图片2' },
        { src: 'wqsy.png', alt: '图片3' }
    ];
    
    let loadedImages = 0;
    
    images.forEach((imgData, index) => {
        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt;
        img.style.cssText = `
            width: 28%;
            height: auto;
            object-fit: contain;
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 1000ms ease-out, transform 1000ms ease-out;
            position: relative;
            z-index: 10;
            will-change: opacity, transform;
        `;
        
        imageContainer.appendChild(img);
        
        // 为每张图片添加加载和动画效果
        img.onload = function() {
            console.log(`${imgData.src} 加载成功`);
            loadedImages++;
            
            if (loadedImages === images.length) {
                console.log('所有图片加载完成');
                // 所有图片加载完成后开始动画
                requestAnimationFrame(() => {
                    animateImages(images, imageContainer, mainContainer);
                });
            }
        };
        
        img.onerror = function() {
            console.error(`${imgData.src} 加载失败`);
            loadedImages++;
            
            if (loadedImages === images.length) {
                console.log('图片加载完成（部分失败）');
                requestAnimationFrame(() => {
                    animateImages(images, imageContainer, mainContainer);
                });
            }
        };
    });
    
    // 将图片容器添加到主容器
    mainContainer.appendChild(imageContainer);
    
    // 将主容器添加到页面
    container.appendChild(mainContainer);
    console.log('图片容器已添加到页面');
}

function animateImages(images, imageContainer, mainContainer) {
    // 为每张图片添加动画
    images.forEach((imgData, index) => {
        const img = imageContainer.children[index];
        if (img) {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                    
                    if (index === images.length - 1) {
                        console.log('所有图片动画完成');
                        // 图片动画完成后显示文字
                        setTimeout(() => {
                            requestAnimationFrame(() => {
                                showBirthdayText(mainContainer, () => {
                                    // 文本动画完成后执行移动动画和生成按钮
                                    setTimeout(() => {
                                        requestAnimationFrame(() => {
                                            animateElementsAndCreateButton(mainContainer);
                                        });
                                    }, 500);
                                });
                            });
                        }, 500);
                    }
                });
            }, 100 + index * 200); // 每张图片延迟200ms，形成依次出现的效果
        }
    });
}

function showBirthdayText(container, callback) {
    console.log('开始显示生日文字');
    
    // 创建文字容器
    const textContainer = document.createElement('div');
    textContainer.id = 'text-container-element';
    textContainer.style.cssText = `
        margin-top: 40px;
        text-align: center;
        position: relative;
        z-index: 10;
        transition: transform 0.8s ease-out;
    `;
    
    // 创建文字元素
    const text = document.createElement('div');
    text.textContent = 'Happy Birthday To You!';
    text.style.cssText = `
        font-size: 48px;
        font-family: 'Brush Script MT', cursive;
        font-weight: bold;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #ff9ff3);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 1;
        position: relative;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        background-position: 0% 50%;
        animation: gradientAnimation 3s ease infinite, handWriting 6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        clip-path: inset(0 100% 0 0);
        will-change: clip-path;
    `;
    
    // 复用样式，避免重复创建
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes gradientAnimation {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes handWriting {
                0% {
                    clip-path: inset(0 100% 0 0);
                }
                100% {
                    clip-path: inset(0 0 0 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    textContainer.appendChild(text);
    container.appendChild(textContainer);
    
    // 文本动画完成后执行回调
    setTimeout(() => {
        console.log('生日文字显示完成');
        if (callback) callback();
    }, 6000); // 文本动画时长为6秒
}

function animateElementsAndCreateButton(container) {
    console.log('开始执行元素移动动画并创建按钮');
    
    // 获取图片容器和文本容器
    const imageContainer = container.querySelector('div:not(#text-container-element)');
    const textContainer = document.getElementById('text-container-element');
    
    if (imageContainer && textContainer) {
        // 设置过渡效果
        imageContainer.style.transition = 'transform 0.8s ease-out';
        imageContainer.style.willChange = 'transform';
        textContainer.style.willChange = 'transform';
        
        // 执行移动动画
        const moveDistance = 15; // 移动距离为15像素
        requestAnimationFrame(() => {
            imageContainer.style.transform = `translateY(-${moveDistance}px)`;
            textContainer.style.transform = `translateY(${moveDistance}px)`;
            
            // 动画完成后创建按钮
            setTimeout(() => {
                requestAnimationFrame(() => {
                    createWishButton(container);
                });
            }, 800); // 等待动画完成
        });
    }
}

function createWishButton(container) {
    console.log('创建许愿按钮');
    
    // 创建按钮元素
    const button = document.createElement('button');
    button.textContent = '许愿';
    button.style.cssText = `
        margin: 20px 0;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        color: #2E7D32;
        font-family: 'Brush Script MT', 'Caveat', 'Segoe Script', cursive;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(46, 125, 50, 0.5);
        border-radius: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 20;
        position: relative;
        will-change: background, transform, box-shadow;
    `;
    
    // 添加悬停效果
    button.addEventListener('mouseenter', function() {
        requestAnimationFrame(() => {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            this.style.borderColor = 'rgba(46, 125, 50, 0.8)';
            this.style.color = '#1B5E20';
        });
    });
    
    button.addEventListener('mouseleave', function() {
        requestAnimationFrame(() => {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            this.style.borderColor = 'rgba(46, 125, 50, 0.5)';
            this.style.color = '#2E7D32';
        });
    });
    
    // 添加点击反馈
    button.addEventListener('click', function() {
        requestAnimationFrame(() => {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    this.style.transform = 'scale(1)';
                    // 移除烟花效果，添加爱心数字和火苗效果
                    createHeartEffect();
                });
            }, 150);
        });
    });
    
    // 将按钮添加到容器中，放在图片和文本之间
    const textContainer = document.getElementById('text-container-element');
    if (textContainer) {
        container.insertBefore(button, textContainer);
    } else {
        container.appendChild(button);
    }
    
    // 添加按钮淡入效果
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        requestAnimationFrame(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        });
    }, 100);
}

// 启动性能监控
function startPerformanceMonitoring() {
    function monitor() {
        monitorPerformance();
        requestAnimationFrame(monitor);
    }
    requestAnimationFrame(monitor);
}

// 启动性能监控
startPerformanceMonitoring();

// 爱心数字和火苗效果
function createHeartEffect() {
    console.log('创建爱心数字和火苗效果');
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.id = 'heart-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        z-index: 1000;
        opacity: 0;
        transition: opacity 1s ease;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    document.body.appendChild(overlay);
    
    // 显示遮罩层
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    // 创建爱心容器
    const heartContainer = document.createElement('div');
    heartContainer.id = 'heart-container';
    heartContainer.style.cssText = `
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 620px;
        height: 500px;
    `;
    overlay.appendChild(heartContainer);
    
    // 添加图片 xxx.png
    const imageElement = document.createElement('img');
    imageElement.src = 'xxx.png';
    imageElement.alt = 'xxx';
    imageElement.style.cssText = `
        width: 300px;
        height: auto;
        object-fit: contain;
        display: block;
        margin-bottom: 30px;
        position: relative;
        z-index: 10;
    `;
    heartContainer.appendChild(imageElement);
    
    // 图片加载完成后调整发光效果容器大小
    imageElement.onload = function() {
        // 创建发光效果容器
        const glowContainer = document.createElement('div');
        const imageWidth = imageElement.offsetWidth;
        const imageHeight = imageElement.offsetHeight;
        const maxDimension = Math.max(imageWidth, imageHeight);
        
        glowContainer.style.cssText = `
            position: absolute;
            top: ${imageElement.offsetTop + imageHeight / 2}px;
            left: ${imageElement.offsetLeft + imageWidth / 2}px;
            transform: translate(-50%, -50%);
            width: ${maxDimension * 1.5}px;
            height: ${maxDimension * 1.5}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%);
            animation: pulse 3s ease-in-out infinite;
            z-index: 5;
            pointer-events: none;
        `;
        heartContainer.appendChild(glowContainer);
    };
    
    // 图片加载失败时的处理
    imageElement.onerror = function() {
        // 创建发光效果容器（使用默认尺寸）
        const glowContainer = document.createElement('div');
        glowContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%);
            animation: pulse 3s ease-in-out infinite;
            z-index: 5;
            pointer-events: none;
        `;
        heartContainer.appendChild(glowContainer);
    };
    
    // 添加动画样式
    if (!document.getElementById('glow-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'glow-animation-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.6;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0.9;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加文字
    const textElement = document.createElement('div');
    textElement.style.cssText = `
        position: relative;
        text-align: center;
        font-size: 24px;
        font-family: '楷体', 'Microsoft YaHei', 'Noto Serif SC', serif;
        color: #333;
        line-height: 1.2;
        width: 600px;
        white-space: nowrap;
        letter-spacing: 1px;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
    `;
    textElement.textContent = '心之所想，行之所向；所愿皆所成，所念皆所得';
    heartContainer.appendChild(textElement);
    
    // 添加玻璃质感按钮
    const button = document.createElement('button');
    button.style.cssText = `
        position: relative;
        margin-top: 30px;
        padding: 14px 28px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 25px;
        color: #FFC0CB;
        font-size: 16px;
        font-family: 'Microsoft YaHei', sans-serif;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
        outline: none;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        visibility: hidden;
    `;
    button.textContent = '我有一些话与你说';
    
    // 添加按钮悬停效果
    button.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.3)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
        this.style.borderColor = 'rgba(255, 192, 203, 0.5)';
        this.style.color = '#FFB6C1';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        this.style.color = '#FFC0CB';
    });
    
    // 按钮点击效果
    button.addEventListener('click', function() {
        console.log('按钮被点击');
        
        // 实现界面转换
        transitionToNewInterface();
    });
    
    // 界面转换函数
    function transitionToNewInterface() {
        // 获取当前遮罩层
        const overlay = document.getElementById('heart-overlay');
        
        // 创建过渡效果
        overlay.style.transition = 'opacity 1s ease-in-out';
        overlay.style.opacity = '0';
        
        // 过渡完成后移除原有元素
        setTimeout(function() {
            // 移除遮罩层
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // 创建新的白板元素作为主要交互区域
            createWhiteboardPanel();
        }, 1000);
    }
    
    // 创建白板元素
    function createWhiteboardPanel() {
        // 文字内容数组
        const texts = [
            'To 李晴同学.杨木老师',
            '　　这一年，时光的河流又载着你往前了一程。想祝你继续拥有看见一朵云、听到一首歌、读到一句诗就能感到幸福的敏锐。祝你像一棵树，向下沉稳地扎根，向上自由地生长。不辜负太阳的照耀，也不拒绝风雨的洗礼，每一个年轮都记录着独一无二的故事。',
            '　　在追寻梦想的路上，记得照顾好自己的胃和心情。在感到疲惫的时候，永远可以退回到我们这个小世界里，做回那个不用长大的孩子。我的意思是，无论你奔向何方，身后永远有我，和这个为你点亮的生日。',
            '　　生日快乐，愿你的世界，永远有光，有风，有温柔的回响。愿你：眼中有星辰，心中有山海。手里有热爱的书本，身边有长伴的灯火。',
            'From 宋弥',
            '2026.4.12'
        ];
        
        // 创建白板元素
        const whiteboard = document.createElement('div');
        whiteboard.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60%;
            height: 70%;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 1s ease-in-out;
            z-index: 999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 40px;
            overflow-y: auto;
        `;
        
        // 添加文字内容
        const letterContent = document.createElement('div');
        letterContent.style.cssText = `
            font-family: 'Brush Script MT', 'Caveat', 'Segoe Script', cursive;
            font-size: 20px;
            line-height: 1.6;
            color: #333;
            width: 90%;
            margin: 0 auto;
        `;
        
        // 创建称呼行
        const salutation = document.createElement('div');
        salutation.style.textAlign = 'left';
        salutation.style.fontSize = '24px';
        salutation.style.fontWeight = 'bold';
        letterContent.appendChild(salutation);
        
        // 创建空行
        const emptyLine1 = document.createElement('div');
        emptyLine1.textContent = '';
        letterContent.appendChild(emptyLine1);
        
        // 创建第一段
        const paragraph1 = document.createElement('div');
        paragraph1.style.textAlign = 'left';
        letterContent.appendChild(paragraph1);
        
        // 创建空行
        const emptyLine2 = document.createElement('div');
        emptyLine2.textContent = '';
        letterContent.appendChild(emptyLine2);
        
        // 创建第二段
        const paragraph2 = document.createElement('div');
        paragraph2.style.textAlign = 'left';
        letterContent.appendChild(paragraph2);
        
        // 创建空行
        const emptyLine3 = document.createElement('div');
        emptyLine3.textContent = '';
        letterContent.appendChild(emptyLine3);
        
        // 创建第三段
        const paragraph3 = document.createElement('div');
        paragraph3.style.textAlign = 'left';
        letterContent.appendChild(paragraph3);
        
        // 创建空行
        const emptyLine4 = document.createElement('div');
        emptyLine4.textContent = '';
        letterContent.appendChild(emptyLine4);
        
        // 创建署名行
        const signature = document.createElement('div');
        signature.style.textAlign = 'right';
        signature.style.fontSize = '24px';
        signature.style.fontWeight = 'bold';
        letterContent.appendChild(signature);
        
        // 创建日期行
        const dateLine = document.createElement('div');
        dateLine.style.textAlign = 'right';
        dateLine.style.fontSize = '20px';
        dateLine.style.marginTop = '10px';
        letterContent.appendChild(dateLine);
        
        // 目标元素数组
        const elements = [salutation, paragraph1, paragraph2, paragraph3, signature, dateLine];
        
        // 逐个字符显现动画
        function typeWriter(element, text, index = 0, speed = 50) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                setTimeout(() => {
                    typeWriter(element, text, index + 1, speed);
                }, speed);
            } else if (elements.indexOf(element) < elements.length - 1) {
                // 当前元素完成后，开始下一个元素
                const nextIndex = elements.indexOf(element) + 1;
                setTimeout(() => {
                    typeWriter(elements[nextIndex], texts[nextIndex]);
                }, 100);
            }
        }
        
        // 开始动画
        setTimeout(() => {
            typeWriter(elements[0], texts[0]);
        }, 500);
        whiteboard.appendChild(letterContent);
        
        // 添加到页面
        document.body.appendChild(whiteboard);
        
        // 创建绿色玻璃态按钮
        const greenButton = document.createElement('button');
        greenButton.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 40px;
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(46, 125, 50, 0.2));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(76, 175, 80, 0.4);
            border-radius: 30px;
            font-size: 20px;
            font-family: 'Brush Script MT', 'Caveat', cursive;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(76, 175, 80, 0.2);
            outline: none;
            white-space: nowrap;
            overflow: visible;
            z-index: 1000;
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        `;
        
        // 创建渐变文字效果
        const buttonText = document.createElement('span');
        buttonText.textContent = '开启我的22岁！';
        buttonText.style.cssText = `
            background: linear-gradient(45deg, #4CAF50, #81C784, #4CAF50);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientShift 3s ease-in-out infinite;
            display: inline-block;
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        // 组装按钮
        greenButton.appendChild(buttonText);
        whiteboard.appendChild(greenButton);
        
        // 添加按钮点击事件 - 视觉过渡效果
        greenButton.addEventListener('click', function() {
            // 创建覆盖图像
            const xinImage = document.createElement('img');
            xinImage.src = 'xin.png';
            xinImage.alt = 'xin';
            
            // 获取白板尺寸
            const whiteboardWidth = whiteboard.offsetWidth;
            const whiteboardHeight = whiteboard.offsetHeight;
            
            // 设置图像样式，使其覆盖整个白板
            xinImage.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: ${whiteboardWidth}px;
                height: ${whiteboardHeight}px;
                object-fit: cover;
                opacity: 0;
                transition: opacity 2s ease-in-out;
                z-index: 2000;
            `;
            
            // 添加到白板
            whiteboard.appendChild(xinImage);
            
            // 触发重排
            xinImage.offsetHeight;
            
            // 图像逐渐显现
            xinImage.style.opacity = '1';
            
            // 动画完成后，移除其他元素
            setTimeout(() => {
                // 隐藏所有其他元素
                const allElements = whiteboard.children;
                for (let i = 0; i < allElements.length; i++) {
                    if (allElements[i] !== xinImage) {
                        allElements[i].style.display = 'none';
                    }
                }
            }, 2000);
        });
        
        // 添加按钮悬停效果
        greenButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(46, 125, 50, 0.3))';
            this.style.transform = 'translateX(-50%) translateY(-3px)';
            this.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(76, 175, 80, 0.3)';
        });
        
        greenButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(46, 125, 50, 0.2))';
            this.style.transform = 'translateX(-50%)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(76, 175, 80, 0.2)';
        });
        
        // 触发重排后开始淡入动画
        requestAnimationFrame(function() {
            whiteboard.style.opacity = '1';
        });
        
        // 计算文字显示完成时间
        let totalChars = 0;
        texts.forEach(text => {
            totalChars += text.length;
        });
        
        // 文字显示速度为50ms/字符，加上每个元素100ms的延迟，再加上初始500ms延迟
        const textAnimationTime = (totalChars * 50) + ((texts.length - 1) * 100) + 500;
        
        // 文字显示完成后，开始4秒倒计时，然后显示按钮
        setTimeout(() => {
            // 4秒倒计时
            setTimeout(() => {
                // 按钮平滑显现
                requestAnimationFrame(() => {
                    greenButton.style.opacity = '0';
                    greenButton.style.transform = 'translateX(-50%) translateY(20px)';
                    greenButton.style.transition = 'opacity 1s ease, transform 1s ease';
                    
                    // 触发重排
                    greenButton.offsetHeight;
                    
                    // 开始动画
                    requestAnimationFrame(() => {
                        greenButton.style.opacity = '1';
                        greenButton.style.transform = 'translateX(-50%)';
                    });
                });
            }, 4000); // 4秒倒计时
        }, textAnimationTime);
    }
    
    heartContainer.appendChild(button);
    
    // 文字完全呈现后开始计时，22秒后执行按钮显现动画
    setTimeout(function() {
        fadeInButton();
    }, 22000);
    
    // 按钮淡入动画函数
    function fadeInButton() {
        // 确保按钮可见
        button.style.visibility = 'visible';
        // 使用requestAnimationFrame确保动画流畅
        requestAnimationFrame(function() {
            // 设置过渡效果
            button.style.transition = 'opacity 1.5s ease-in-out';
            // 开始淡入
            button.style.opacity = '1';
        });
    }
    

    

    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glowPulse {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.6;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 8秒后移除效果 - 已注释，实现持久化显示
    /*
    setTimeout(() => {
        requestAnimationFrame(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 1000);
        });
    }, 8000);
    */
}
