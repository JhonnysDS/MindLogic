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
    
    // Apply theme function
    const applyTheme = (theme) => {
      if (theme === 'dark') {
        html.classList.add('dark-mode');
        body.classList.add('dark-mode');
        localStorage.theme = 'dark';
      } else {
        html.classList.remove('dark-mode');
        body.classList.remove('dark-mode');
        localStorage.theme = 'light';
      }
      
      // Trigger custom event for other scripts (like particles)
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };
    
    // Initial theme is already set by inline script in head
    // We just need to ensure body has the class if html has it
    if (html.classList.contains('dark-mode') && !body.classList.contains('dark-mode')) {
      body.classList.add('dark-mode');
    }

    // Toggle theme on button click
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Toggle and apply
        const newTheme = html.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
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

