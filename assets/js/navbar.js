// ==========================================================================
// NEXUS NAVBAR - JavaScript Functionality
// ==========================================================================

(function() {
  'use strict';

  // ==========================================================================
  // 1. THEME TOGGLE (Dark/Light Mode)
  // ==========================================================================
  
  const initThemeToggle = () => {
    const body = document.body;
    const html = document.documentElement;
    const themeToggles = document.querySelectorAll('.theme-toggle');
    
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    console.log('Initializing theme:', savedTheme);
    
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
      html.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      html.classList.remove('dark-mode');
    }

    // Toggle theme on button click
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        body.classList.toggle('dark-mode');
        html.classList.toggle('dark-mode');
        
        // Save preference
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        
        console.log('Theme changed to:', currentTheme);
      });
    });
    
    console.log('Theme toggle initialized. Buttons found:', themeToggles.length);
  };

  // ==========================================================================
  // 2. GLASSMORPHISM SCROLL EFFECT
  // ==========================================================================
  
  const initScrollEffect = () => {
    const header = document.querySelector('.header');
    
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('glass-nav');
      } else {
        header.classList.remove('glass-nav');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
  };

  // ==========================================================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================================================
  
  const initMobileMenu = () => {
    const menuBtn = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.navbar-mobile');
    const body = document.body;
    
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('mobile-menu-open');
      
      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('mobile-menu-open')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });

    // Close menu when clicking on a link
    const navLinks = mobileMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu-open');
        body.style.overflow = '';
      });
    });

    // Close menu on window resize if opened
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1025) {
        mobileMenu.classList.remove('mobile-menu-open');
        body.style.overflow = '';
      }
    });
  };

  // ==========================================================================
  // 4. ACTIVE LINK HIGHLIGHT
  // ==========================================================================
  
  const initActiveLinks = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });
  };

  // ==========================================================================
  // 5. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================
  
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ==========================================================================
  // INITIALIZE ALL FUNCTIONS
  // ==========================================================================
  
  const init = () => {
    initThemeToggle();
    initScrollEffect();
    initMobileMenu();
    initActiveLinks();
    initSmoothScroll();
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

