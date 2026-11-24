/**
 * Veloce Labs — Modern SaaS Landing Page Interactions
 * Features:
 *  - Mobile Navigation Drawer Toggle & Accessibility
 *  - Dynamic Sticky Navbar Glassmorphism on Scroll
 *  - Smooth Scroll with Sticky Header Offset & Active Link Highlighting
 *  - Interactive Contact Form Validation & Realistic Submission Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. DOM Elements
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // --------------------------------------------------------------------------
  const toggleMobileMenu = (forceClose = false) => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    mobileToggle.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      navMenu.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMobileMenu(true);
    }
  });

  // Close mobile menu on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      toggleMobileMenu(true);
    }
  });

  // --------------------------------------------------------------------------
  // 3. Dynamic Navbar Background on Scroll
  // --------------------------------------------------------------------------
  const handleScrollNavbar = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // --------------------------------------------------------------------------
  // 4. Smooth Anchor Scrolling & Active Link Highlighting
  // --------------------------------------------------------------------------
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        if (navMenu.classList.contains('active')) {
          toggleMobileMenu(true);
        }

        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active section indicator using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  // --------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission Feedback
  // --------------------------------------------------------------------------
  if (contactForm) {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('workEmail');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Email format validator
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Clear individual error state
    const clearError = (input, errorEl) => {
      input.classList.remove('invalid');
      if (errorEl) errorEl.classList.remove('visible');
    };

    // Show individual error state
    const showError = (input, errorEl) => {
      input.classList.add('invalid');
      if (errorEl) errorEl.classList.add('visible');
    };

    // Live validation clears on typing
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        if (input === nameInput) clearError(nameInput, nameError);
        if (input === emailInput) clearError(emailInput, emailError);
        if (input === messageInput) clearError(messageInput, messageError);
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, nameError);
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        showError(emailInput, emailError);
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, messageError);
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) return;

      // Simulate network request with subtle loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Display Success Banner
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `✓ <strong>Message Received!</strong> Thank you, ${nameInput.value.trim().split(' ')[0]}. A principal solution architect will review your workflow requirements and respond within 2 hours.`;

        // Reset inputs
        contactForm.reset();

        // Auto-clear feedback message after 8 seconds
        setTimeout(() => {
          formFeedback.className = 'form-feedback';
          formFeedback.textContent = '';
        }, 8000);
      }, 1000);
    });
  }
});
