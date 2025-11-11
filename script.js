// Password Protection
const PASSWORD = '1998';
const passwordOverlay = document.getElementById('password-overlay');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');

function checkPassword() {
    const entered = passwordInput.value;
    if (entered === PASSWORD) {
        // Store in session storage
        sessionStorage.setItem('serabunni-authenticated', 'true');
        // Fade out overlay
        passwordOverlay.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
            passwordOverlay.style.display = 'none';
        }, 800);
    } else {
        // Shake animation on wrong password
        passwordInput.style.animation = 'shake 0.5s';
        passwordInput.value = '';
        setTimeout(() => {
            passwordInput.style.animation = '';
        }, 500);
    }
}

// Check if already authenticated
if (sessionStorage.getItem('serabunni-authenticated') === 'true') {
    passwordOverlay.style.display = 'none';
}

// Password submit handlers
passwordSubmit.addEventListener('click', checkPassword);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Theme Management
let currentTheme = localStorage.getItem('serabunni-theme') || checkAutoTheme();

function checkAutoTheme() {
    // Check if we should auto-enable Halloween theme
    const now = new Date();
    const month = now.getMonth(); // 0-indexed, so October = 9
    const day = now.getDate();
    
    // October 25 - November 3
    if ((month === 9 && day >= 25) || (month === 10 && day <= 3)) {
        return 'halloween';
    }
    return 'default';
}

function setTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('theme-dark', 'theme-holiday', 'theme-halloween');
    
    // Add new theme class
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
    
    // Save preference
    localStorage.setItem('serabunni-theme', theme);
    currentTheme = theme;
    
    // Clear and restart theme-specific effects
    clearFloatingElements();
    if (theme === 'holiday') {
        startSnowfall();
    } else if (theme === 'halloween') {
        startHalloweenEffects();
    } else {
        startFloatingEmojis();
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
    setTheme(currentTheme);
});

// Theme switcher event listeners
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('theme-btn')) {
        setTheme(e.target.dataset.theme);
    }
});

// Custom Cursor
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 15 + 'px';
    cursor.style.top = e.clientY - 15 + 'px';
});

// Cursor interaction effects
document.querySelectorAll('a, button, .link-btn, .tag').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = '#ff1493';
    });
    
    elem.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#ff69b4';
    });
});

// Floating Elements Management
let floatingInterval;
let floatingElements = [];

function clearFloatingElements() {
    if (floatingInterval) {
        clearInterval(floatingInterval);
    }
    const container = document.getElementById('floating-elements');
    container.innerHTML = '';
    floatingElements = [];
}

function startFloatingEmojis() {
    const emojis = ['💖', '✨', '🌟', '💫', '🎀', '🦋', '🌸', '💕', '🎵', '🎨'];
    
    function createFloatingEmoji() {
        const container = document.getElementById('floating-elements');
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDuration = (10 + Math.random() * 10) + 's';
        emoji.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 20000);
    }
    
    // Create initial emojis
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingEmoji, i * 1000);
    }
    
    // Create new emoji periodically
    floatingInterval = setInterval(createFloatingEmoji, 3000);
}

function startSnowfall() {
    function createSnowflake() {
        const container = document.getElementById('floating-elements');
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = (0.5 + Math.random() * 1) + 'em';
        snowflake.style.animationDuration = (5 + Math.random() * 10) + 's';
        
        container.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, 15000);
    }
    
    // Create initial snowflakes
    for (let i = 0; i < 20; i++) {
        setTimeout(createSnowflake, i * 200);
    }
    
    // Create new snowflake periodically
    floatingInterval = setInterval(createSnowflake, 300);
}

function startHalloweenEffects() {
    const halloweenEmojis = ['🦇', '👻', '🎃', '💀', '🕷️', '🕸️'];
    
    function createHalloweenElement() {
        const container = document.getElementById('floating-elements');
        const element = document.createElement('div');
        const emoji = halloweenEmojis[Math.floor(Math.random() * halloweenEmojis.length)];
        
        if (emoji === '🦇' || emoji === '👻') {
            element.className = emoji === '🦇' ? 'bat' : 'ghost';
            element.textContent = emoji;
            element.style.top = (Math.random() * 80 + 10) + '%';
            element.style.left = '-100px';
            element.style.animationDuration = (10 + Math.random() * 10) + 's';
            element.style.animationDelay = Math.random() * 3 + 's';
        } else {
            element.className = 'floating-emoji';
            element.textContent = emoji;
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDuration = (10 + Math.random() * 10) + 's';
            element.style.animationDelay = Math.random() * 5 + 's';
        }
        
        container.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 20000);
    }
    
    // Create initial elements
    for (let i = 0; i < 8; i++) {
        setTimeout(createHalloweenElement, i * 800);
    }
    
    // Create new element periodically
    floatingInterval = setInterval(createHalloweenElement, 2500);
}

// Sparkle Effect
function createSparkle() {
    const sparklesContainer = document.getElementById('sparkles');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Random position
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    
    // Random color (pink/purple tones)
    const colors = ['#ff69b4', '#ff1493', '#c71585', '#da70d6', '#ee82ee', '#ffc0cb'];
    sparkle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`;
    
    sparklesContainer.appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}

// Create sparkles periodically
setInterval(createSparkle, 300);

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add click animation to buttons
document.querySelectorAll('.link-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Console message (Easter egg)
console.log('%c✨ Welcome to SeraBunni\'s Page! ✨', 'font-size: 20px; color: #ff69b4; font-weight: bold;');
console.log('%cMade with 💖 in the spirit of MySpace', 'font-size: 14px; color: #c71585;');

// Add hover effect to interest tags
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 3s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Rainbow animation for easter egg
const style = document.createElement('style');
style.innerHTML = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
