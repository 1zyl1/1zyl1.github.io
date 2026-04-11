document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    
    // 移除可能存在的数字"2"元素
    removeNumber2Elements();
    
    // 创建背景方块效果
    createBackgroundBlocks();
    
    const handleVisibilityChange = () => {
        if (document.hidden) {
            body.style.animationPlayState = 'paused';
        } else {
            body.style.animationPlayState = 'running';
        }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
        body.style.animation = 'none';
    }
    
    const audio = document.getElementById('bg-music');
    let audioInitialized = false;
    
    console.log('音频元素:', audio);
    console.log('音频文件路径:', audio ? audio.src : '音频元素未找到');
    
    // 尝试自动播放音频
    const playAudio = () => {
        if (!audio) {
            console.error('音频元素未找到');
            return;
        }
        
        if (audioInitialized) {
            console.log('音频已初始化');
            return;
        }
        
        audioInitialized = true;
        console.log('开始初始化音频');
        
        // 先设置为静音，尝试自动播放
        audio.muted = true;
        audio.volume = 1.0;
        console.log('音频音量设置为:', audio.volume);
        console.log('音频静音状态:', audio.muted);
        
        const playPromise = audio.play();
        console.log('播放承诺:', playPromise);
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('音频开始播放（静音状态）');
                // 播放成功后，取消静音
                audio.muted = false;
                console.log('已取消静音');
            })
            .catch(error => {
                console.log('自动播放被阻止，等待用户交互:', error.message);
                
                const enableAudio = () => {
                    console.log('用户交互触发音频播放');
                    audio.muted = false;
                    audio.play().then(() => {
                        console.log('音频播放已启用');
                    }).catch(err => {
                        console.error('用户交互后音频播放失败:', err.message);
                    });
                    
                    document.removeEventListener('click', enableAudio);
                    document.removeEventListener('touchstart', enableAudio);
                    document.removeEventListener('keydown', enableAudio);
                };
                
                document.addEventListener('click', enableAudio);
                document.addEventListener('touchstart', enableAudio);
                document.addEventListener('keydown', enableAudio);
                console.log('已添加用户交互监听器');
            });
        } else {
            console.log('play() 方法返回 undefined');
        }
    };
    
    // 立即尝试播放音频
    if (audio) {
        console.log('音频当前状态:', audio.readyState);
        playAudio();
        
        // 监听音频加载完成事件
        audio.addEventListener('canplaythrough', () => {
            console.log('音频可以播放');
            if (!audioInitialized) {
                playAudio();
            }
        }, { once: true });
        
        // 监听音频错误事件
        audio.addEventListener('error', (e) => {
            console.log('音频加载错误:', e);
            const errorMessages = {
                1: '音频加载被中止',
                2: '网络错误导致音频加载失败',
                3: '音频解码错误，文件可能已损坏或不支持',
                4: '音频文件格式不支持'
            };
            
            const errorCode = audio.error ? audio.error.code : 0;
            const errorMessage = errorMessages[errorCode] || '未知错误';
            console.error(`音频加载失败：${errorMessage} (错误代码：${errorCode})`);
        });
    }
});

// 创建背景方块效果
function createBackgroundBlocks() {
    // 创建背景容器
    const backgroundContainer = document.createElement('div');
    backgroundContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
    `;
    document.body.appendChild(backgroundContainer);
    
    // 方块配置
    const blockCount = 20; // 方块数量
    const minSize = 10; // 最小方块大小
    const maxSize = 50; // 最大方块大小
    const minSpeed = 100; // 最小速度 (px/s) - 原速度的五倍
    const maxSpeed = 300; // 最大速度 (px/s) - 原速度的五倍
    const minOpacity = 0.3; // 最小透明度
    const maxOpacity = 0.7; // 最大透明度
    
    // 创建方块
    for (let i = 0; i < blockCount; i++) {
        setTimeout(() => {
            createBlock(backgroundContainer, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity);
        }, Math.random() * 5000); // 随机初始延迟
    }
}

// 创建单个方块
function createBlock(container, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity) {
    const block = document.createElement('div');
    
    // 随机大小
    const size = Math.random() * (maxSize - minSize) + minSize;
    
    // 随机水平位置
    const left = Math.random() * 100;
    
    // 随机透明度
    const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
    
    // 随机速度
    const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
    
    // 计算动画时长
    const windowHeight = window.innerHeight;
    const animationDuration = (windowHeight + size) / speed * 1000; // 转换为毫秒
    
    block.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: -${size}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 4px;
        animation: moveUp ${animationDuration}ms linear infinite;
    `;
    
    container.appendChild(block);
    
    // 动画完成后重新创建方块
    block.addEventListener('animationend', function() {
        this.remove();
        setTimeout(() => {
            createBlock(container, minSize, maxSize, minSpeed, maxSpeed, minOpacity, maxOpacity);
        }, Math.random() * 2000);
    });
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes moveUp {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-100vh);
        }
    }
    @keyframes slideDown {
        0% {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        100% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 移除数字"2"元素的函数
function removeNumber2Elements() {
    console.log('开始移除数字"2"元素');
    
    // 定期检查并移除数字"2"元素
    function checkAndRemove() {
        const allElements = document.querySelectorAll('*');
        let removedCount = 0;
        
        allElements.forEach(el => {
            // 检查元素内容是否为"2"
            if (el.textContent === '2' || el.innerText === '2') {
                // 检查元素是否有样式，可能是较大的数字
                const computedStyle = window.getComputedStyle(el);
                const fontSize = computedStyle.fontSize;
                const color = computedStyle.color;
                
                // 移除较大的粉色数字"2"
                if (fontSize && (parseInt(fontSize) >= 50) && 
                    (color.includes('255, 107, 107') || color.includes('ff6b6b'))) {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                        removedCount++;
                        console.log('移除了数字"2"元素');
                    }
                }
            }
        });
        
        if (removedCount > 0) {
            console.log(`成功移除了 ${removedCount} 个数字"2"元素`);
        }
        
        // 继续检查，确保所有数字"2"都被移除
        setTimeout(checkAndRemove, 1000);
    }
    
    // 立即开始检查
    checkAndRemove();
}
