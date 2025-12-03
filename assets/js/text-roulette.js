// Canvas Disintegration Effect (Thanos Style)
class DisintegrationEffect {
    constructor() {
        this.texts = [
            'Innovative IT & Software Solutions',
            'Mobile App Development',
            'Custom Web Development',
            'Cloud Infrastructure',
            'AI & Machine Learning'
        ];
        this.currentIndex = 0;
        this.container = document.querySelector('.hero-subtitle-wrapper');
        this.canvas = document.getElementById('disintegration-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.init();
    }

    resize() {
        // Canvas covers the entire hero section or window, depending on CSS
        // Here we use the offsetWidth/Height of the canvas element itself which fills the parent
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        this.showNextText();
        this.animate();
    }

    showNextText() {
        this.particles = [];
        this.container.textContent = this.texts[this.currentIndex];
        this.container.classList.remove('text-appear');

        // Force reflow
        void this.container.offsetWidth;

        this.container.classList.add('text-appear');

        // Wait for text to be fully visible before starting disintegration
        setTimeout(() => {
            this.startDisintegration();
        }, 1000); // 1 second display time
    }

    startDisintegration() {
        this.isAnimating = true;
        const text = this.container.textContent;
        const charPositions = this.getCharPositions(text);

        // Replace text with individual spans for fading
        this.container.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.id = 'char-' + i;
            span.className = 'fading-char';
            // Preserve spaces by setting white-space style
            if (text[i] === ' ') {
                span.style.whiteSpace = 'pre';
            }
            this.container.appendChild(span);
        }

        let charIndex = text.length - 1;

        const disintegrateInterval = setInterval(() => {
            if (charIndex < 0) {
                clearInterval(disintegrateInterval);
                this.container.innerHTML = ''; // Clear container when done

                // Wait for particles to clear then show next text
                setTimeout(() => {
                    this.isAnimating = false;
                    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
                    this.showNextText();
                }, 1500);
                return;
            }

            const charData = charPositions[charIndex];
            const span = document.getElementById('char-' + charIndex);

            if (span) {
                span.style.opacity = '0';
            }

            // Create particles (skip spaces)
            if (charData && charData.char !== ' ') {
                this.createParticlesFromChar(charData);
            }

            charIndex--;

        }, 80); // Speed of disintegration (ms per char) - faster
    }

    getCharPositions(text) {
        // We need to temporarily render the text to measure it
        // But since it's already rendered in the container, we can just measure it there
        // However, we need to wrap chars in spans to measure individual positions

        const originalHTML = this.container.innerHTML;
        this.container.innerHTML = '';

        const positions = [];
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.id = 'temp-char-' + i;
            // Preserve spaces
            if (text[i] === ' ') {
                span.style.whiteSpace = 'pre';
            }
            this.container.appendChild(span);
        }

        // Get positions relative to the canvas (which is absolute 0,0 in hero section)
        // We need to account for canvas position relative to viewport vs char position relative to viewport
        const canvasRect = this.canvas.getBoundingClientRect();

        for (let i = 0; i < text.length; i++) {
            const span = document.getElementById('temp-char-' + i);
            const rect = span.getBoundingClientRect();

            positions.push({
                char: text[i],
                x: rect.left - canvasRect.left,
                y: rect.top - canvasRect.top,
                width: rect.width,
                height: rect.height
            });
        }

        // Restore original text (though we will replace it again soon)
        this.container.innerHTML = originalHTML;
        this.container.textContent = text; // Reset to plain text

        return positions;
    }

    createParticlesFromChar(charData) {
        const { char, x, y, width, height } = charData;

        // Create a temporary canvas to draw the character and sample pixels
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width + 10;
        tempCanvas.height = height + 10;

        // Match font styles
        const computedStyle = window.getComputedStyle(this.container);
        const fontSize = parseInt(computedStyle.fontSize);
        tempCtx.font = `${computedStyle.fontWeight} ${fontSize}px ${computedStyle.fontFamily}`;
        tempCtx.textBaseline = 'top';
        tempCtx.fillStyle = 'white';
        tempCtx.fillText(char, 5, 5);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const pixels = imageData.data;

        // Sample pixels
        for (let py = 0; py < tempCanvas.height; py += 2) {
            for (let px = 0; px < tempCanvas.width; px += 2) {
                const index = (py * tempCanvas.width + px) * 4;
                const alpha = pixels[index + 3];

                if (alpha > 128 && Math.random() > 0.4) {
                    const pX = x + px;
                    const pY = y + py;

                    // Randomize colors between Neon Blue and Purple with opacity
                    const isBlue = Math.random() > 0.3;
                    const color = isBlue 
                        ? `rgb(0, 243, 255)` 
                        : `rgb(189, 0, 255)`;

                    this.particles.push(new Particle(pX, pY, color));
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);

            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(x, y, colorBase) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = Math.random() * 4 + 2; // Move right faster (Thanos style)
        this.speedY = (Math.random() - 0.5) * 2; // More vertical variation
        this.opacity = 1;
        this.colorBase = colorBase;
        this.life = 1;
        this.decay = Math.random() * 0.008 + 0.006; // Faster decay
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.opacity = this.life;
        this.size *= 0.99; // Shrink slowly
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.colorBase;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hero-subtitle-wrapper')) {
        new DisintegrationEffect();
    }
});
