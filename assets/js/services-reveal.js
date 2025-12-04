// ==========================================================================
// SERVICES REVEAL ANIMATION
// Intersection Observer for scroll-based animations
// ==========================================================================

(function () {
    'use strict';

    // Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger animation 50px before element enters viewport
    };

    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animation to trigger only once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize when DOM is ready
    function initRevealAnimation() {
        // Select all elements with 'reveal' class
        const revealElements = document.querySelectorAll('.reveal');
        
        // Observe each element
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRevealAnimation);
    } else {
        initRevealAnimation();
    }

})();

