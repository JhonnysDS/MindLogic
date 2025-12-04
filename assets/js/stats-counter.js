// ==========================================================================
// STATS COUNTER ANIMATION
// ==========================================================================

class StatsCounter {
  constructor() {
    this.stats = document.querySelectorAll('.stat-number');
    this.hasAnimated = false;
    this.init();
  }

  init() {
    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animateCounters();
            this.hasAnimated = true;
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    // Observe the stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.stats.forEach((stat) => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;

        if (current < target) {
          // Format number based on target
          let displayValue;
          if (target === 99.9) {
            displayValue = current.toFixed(1) + '%';
          } else {
            displayValue = Math.floor(current);
          }

          stat.textContent = displayValue + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          // Final value
          let finalValue;
          if (target === 99.9) {
            finalValue = target.toFixed(1) + '%';
          } else {
            finalValue = Math.floor(target);
          }

          stat.textContent = finalValue + suffix;

          // Add pulse effect when complete
          stat.style.transform = 'scale(1.1)';
          setTimeout(() => {
            stat.style.transform = 'scale(1)';
          }, 200);
        }
      };

      // Add transition for smooth scale animation
      stat.style.transition = 'transform 0.2s ease';

      updateCounter();
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.stats-section')) {
    new StatsCounter();
  }
});

