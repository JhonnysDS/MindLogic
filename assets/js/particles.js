// ==========================================================================
// PARTICLES NETWORK ANIMATION - Neural Network Effect
// ==========================================================================

class ParticlesNetwork {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;

    // Configuration - Optimized for performance
    this.config = {
      particleCount: options.particleCount || 50,  // Reduced from 80
      particleColor: options.particleColor || '0, 243, 255',
      lineColor: options.lineColor || '0, 243, 255',
      particleRadius: options.particleRadius || 2,
      particleSpeed: options.particleSpeed || 0.5,
      lineDistance: options.lineDistance || 120,  // Reduced from 150
      lineWidth: options.lineWidth || 0.6,  // Thinner lines
      maxConnections: 3,  // Limit connections per particle
    };

    this.init();
  }

  destroy() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  init() {
    this.setCanvasSize();
    this.createParticles();
    this.start();

    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.setCanvasSize();
        this.createParticles();
      }, 250);
    });
  }

  setCanvasSize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        radius: this.config.particleRadius,
        connections: [],
        connectionOpacity: {},
      });
    }
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${this.config.particleColor}, 0.8)`;
      this.ctx.fill();
    });
  }

  drawLines() {
    // Limit iterations for performance
    const particleCount = this.particles.length;

    for (let i = 0; i < particleCount; i++) {
      let connectionCount = 0;

      // Check more particles for connections (increased from 15 to 30)
      const maxCheck = Math.min(i + 30, particleCount);

      for (let j = i + 1; j < maxCheck; j++) {
        // Stop if max connections reached
        if (connectionCount >= this.config.maxConnections) break;

        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const connectionKey = `${i}-${j}`;

        if (distance < this.config.lineDistance) {
          // Initialize connection opacity if not exists
          if (this.particles[i].connectionOpacity[connectionKey] === undefined) {
            this.particles[i].connectionOpacity[connectionKey] = 0;
            this.particles[i].connectionTarget = Math.random() > 0.5 ? 1 : 0;
            this.particles[i].connectionSpeed = 0.02 + Math.random() * 0.03;
          }

          // Randomly activate/deactivate connections (more frequently)
          if (Math.random() < 0.008) {  // Increased for more dynamic connections
            this.particles[i].connectionTarget = this.particles[i].connectionTarget === 1 ? 0 : 1;
          }

          // Animate opacity
          const currentOpacity = this.particles[i].connectionOpacity[connectionKey];
          const target = this.particles[i].connectionTarget || 0;

          if (Math.abs(currentOpacity - target) > 0.01) {
            if (currentOpacity < target) {
              this.particles[i].connectionOpacity[connectionKey] = Math.min(
                currentOpacity + this.particles[i].connectionSpeed,
                target
              );
            } else {
              this.particles[i].connectionOpacity[connectionKey] = Math.max(
                currentOpacity - this.particles[i].connectionSpeed,
                target
              );
            }
          }

          const animatedOpacity = this.particles[i].connectionOpacity[connectionKey];

          if (animatedOpacity > 0.01) {
            const baseOpacity = (1 - distance / this.config.lineDistance) * 0.7; // Increased from 0.5
            const finalOpacity = baseOpacity * animatedOpacity;

            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(${this.config.lineColor}, ${finalOpacity})`;
            this.ctx.lineWidth = this.config.lineWidth;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();

            connectionCount++;
          }
        } else {
          // Reset connection if particles are too far
          if (this.particles[i].connectionOpacity[connectionKey] !== undefined) {
            delete this.particles[i].connectionOpacity[connectionKey];
          }
        }
      }
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLines();
    this.drawParticles();
    this.updateParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Particle network instance
let particlesInstance = null;

// Initialize particles with current theme
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const isDarkMode = document.body.classList.contains('dark-mode');

  // Destroy previous instance if exists
  if (particlesInstance) {
    particlesInstance.destroy();
  }

  // Optimized settings for better performance
  particlesInstance = new ParticlesNetwork('particles-canvas', {
    particleCount: 80,  // Increased for more particles
    // Darker colors for light mode visibility (Slate 800/900)
    particleColor: isDarkMode ? '0, 243, 255' : '15, 23, 42',
    lineColor: isDarkMode ? '0, 243, 255' : '30, 41, 59',
    particleRadius: 3.5, // Larger (was 2)
    particleSpeed: 0.8,  // Slower for more elegant movement
    lineDistance: 200,  // Much longer connection distance for more connections
    lineWidth: 1,  // Slightly thicker lines
    maxConnections: 8,  // More connections per particle (was 5)
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for theme to be applied
  setTimeout(initParticles, 50);

  // Pause animation when tab is not visible (save CPU)
  document.addEventListener('visibilitychange', () => {
    if (particlesInstance) {
      if (document.hidden) {
        particlesInstance.stop();
      } else {
        particlesInstance.start();
      }
    }
  });
});

// Listen for theme changes
document.addEventListener('themeChanged', () => {
  // Reinitialize particles with new theme
  setTimeout(initParticles, 50);
});

