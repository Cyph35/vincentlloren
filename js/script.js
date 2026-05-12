// ==========================================
// PERFORMANCE-ENHANCED JAVASCRIPT
// ==========================================

// Use strict mode for better error handling
'use strict';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const CONFIG = {
    animation: {
        duration: 300,
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
        threshold: 0.1
    },
    theme: {
        default: 'light',
        storageKey: 'portfolio_theme'
    },
    debounce: {
        scroll: 100,
        resize: 250
    }
};

// ==========================================
// UTILS & HELPERS
// ==========================================

/**
 * Debounce function to limit function calls
 */
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for scroll events
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Get system theme preference
 */
const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

/**
 * Smooth scroll to element
 */
const smoothScrollTo = (target, offset = 0) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// ==========================================
// CYCLING "HI" IN DIFFERENT LANGUAGES
// ==========================================
function initCyclingHi() {
    const greetings = [
        'hi',      // English
        'hola',    // Spanish
        'bonjour', // French
        'ciao',    // Italian
        'hallo',   // German
        'olá',     // Portuguese
        'こんにちは', // Japanese
        '你好',     // Chinese
        '안녕',     // Korean
        'привет',  // Russian
        'مرحبا',   // Arabic
        'kumusta', // Filipino
        'hej',     // Swedish
        'hoi',     // Dutch
        'γεια'     // Greek
    ];
    
    const hiElement = document.getElementById('cyclingHi');
    if (!hiElement) return;
    
    let currentIndex = 0;
    
    const cycleGreeting = () => {
        hiElement.style.opacity = '0';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % greetings.length;
            hiElement.textContent = greetings[currentIndex];
            hiElement.style.opacity = '1';
        }, 300);
    };
    
    hiElement.style.transition = 'opacity 0.3s ease';
    setInterval(cycleGreeting, 2500);
}

// ==========================================
// NAVIGATION MENU & ACTIVE STATES
// ==========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;

    // Observer for active section detection
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('is-active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('is-active');
                }
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement, 80); // Account for fixed navbar
            }
        });
    });
}

// ==========================================
// DARK/LIGHT MODE TOGGLE
// ==========================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
    
    if (!themeToggle || !themeIcon) return;
    
    // Get stored theme or detect system preference
    let currentTheme = localStorage.getItem(CONFIG.theme.storageKey);
    
    if (!currentTheme) {
        currentTheme = getSystemTheme();
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, themeIcon);
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(CONFIG.theme.storageKey, newTheme);
        updateThemeIcon(newTheme, themeIcon);
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    });
}

function updateThemeIcon(theme, iconElement) {
    iconElement.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    animatedElements.forEach(element => observer.observe(element));
}

// ==========================================
// MAGNETIC BUTTON EFFECT
// ==========================================
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn--magnetic');
    
    if (magneticButtons.length === 0) return;
    
    magneticButtons.forEach(button => {
        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const strength = 0.25;
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const pullX = deltaX * strength;
                const pullY = deltaY * strength;
                button.style.transform = `translate(${pullX}px, ${pullY}px)`;
            }
        };
        
        const handleMouseLeave = () => {
            button.style.transform = 'translate(0, 0)';
        };
        
        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', handleMouseLeave);
    });
}

// ==========================================
// CIRCULAR PROGRESS BARS
// ==========================================
function initCircularProgress() {
    const skillCircles = document.querySelectorAll('.skill__circle');
    
    if (skillCircles.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressRing = entry.target.querySelector('.skill__progress-ring-fill');
                if (!progressRing) return;
                
                const progress = parseInt(progressRing.getAttribute('data-progress') || '0');
                const radius = progressRing.getAttribute('r');
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (progress / 100) * circumference;
                
                setTimeout(() => {
                    progressRing.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.33, 1, 0.68, 1)';
                    progressRing.style.strokeDashoffset = offset;
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    skillCircles.forEach(circle => observer.observe(circle));
}

// ==========================================
// PROFILE PICTURE HOVER EFFECT
// ==========================================
function initProfilePicture() {
    const profilePicture = document.getElementById('profilePicture');
    const profileImages = profilePicture?.querySelectorAll('.profile-img');

    if (!profilePicture || !profileImages || profileImages.length < 2) return;

    const [firstImage, secondImage] = profileImages;

    const showSecondImage = () => {
        firstImage.classList.add('profile-img--hidden');
        secondImage.classList.remove('profile-img--hidden');
    };

    const showFirstImage = () => {
        firstImage.classList.remove('profile-img--hidden');
        secondImage.classList.add('profile-img--hidden');
    };

    // Desktop interactions
    profilePicture.addEventListener('mouseenter', showSecondImage);
    profilePicture.addEventListener('mouseleave', showFirstImage);
    profilePicture.addEventListener('mousedown', showSecondImage);
    profilePicture.addEventListener('mouseup', showFirstImage);

    // Touch support for mobile devices
    profilePicture.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showSecondImage();
    }, { passive: false });

    profilePicture.addEventListener('touchend', showFirstImage);
}

// ==========================================
// ACHIEVEMENTS EXPAND/COLLAPSE
// ==========================================
function initAchievementsExpand() {
    const expandButtons = document.querySelectorAll('.achievements__expand-btn');
    
    if (expandButtons.length === 0) return;
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const columnContent = button.previousElementSibling;
            
            if (!columnContent || !columnContent.classList.contains('achievements__column-content--expandable')) {
                return;
            }
            
            // Toggle expanded state
            const isExpanded = columnContent.classList.contains('expanded');
            
            if (isExpanded) {
                // Collapse
                columnContent.classList.remove('expanded');
                button.textContent = 'View More ↓';
                button.style.transform = 'translateY(0)';
            } else {
                // Expand
                columnContent.classList.add('expanded');
                button.textContent = 'View Less ↑';
                button.style.transform = 'translateY(-2px)';
            }
            
            // Show/hide hidden cards with animation
            const hiddenCards = columnContent.querySelectorAll('.achievement__card--hidden');
            
            if (!isExpanded) {
                // Expanding - add visible class to hidden cards
                hiddenCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            } else {
                // Collapsing - remove visible class from hidden cards
                hiddenCards.forEach(card => {
                    card.classList.remove('visible');
                });
            }
        });
    });
}

// ==========================================
// CONTACT FORM HANDLER (EmailJS Integration with Debug)
// ==========================================
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const spinner = document.getElementById('contactSpinner');
    const messageDiv = document.getElementById('contactMessage');
    
    if (!contactForm || !submitBtn || !spinner || !messageDiv) return;
    
    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show message to user
     */
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `contact__message contact__message--${type}`;
        messageDiv.style.display = 'block';
    }

    /**
     * Hide message
     */
    function hideMessage() {
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.className = 'contact__message';
    }

    /**
     * Enable/disable form elements
     */
    function disableForm(disabled) {
        const submitBtn = document.getElementById('contactSubmitBtn');
        const spinner = document.getElementById('contactSpinner');
        const inputs = document.querySelectorAll('.contact__form input, .contact__form textarea');
        
        inputs.forEach(input => input.disabled = disabled);
        submitBtn.disabled = disabled;
        
        if (disabled) {
            spinner.style.display = 'inline-block';
            submitBtn.querySelector('.btn__text').textContent = 'Sending...';
        } else {
            spinner.style.display = 'none';
            submitBtn.querySelector('.btn__text').textContent = 'Send Message';
        }
    }
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📧 Contact form submitted - Starting debug process...');
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        console.log('📝 Form data collected:', { name, email, messageLength: message.length });
        
        // Basic validation
        if (!name || !email || !message) {
            console.log('❌ Validation failed: Missing required fields');
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            console.log('❌ Validation failed: Invalid email format');
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        console.log('✅ Validation passed - Proceeding to EmailJS...');
        
        // Disable form and show loading state
        disableForm(true);
        showMessage('Sending your message...', 'info');
        
        try {
            // Check if EmailJS is loaded BEFORE preparing parameters
            if (typeof emailjs === 'undefined') {
                console.error('❌ EmailJS library not loaded!');
                throw new Error('EmailJS library is not available. Please check your internet connection and refresh the page.');
            }
            
            console.log('✅ EmailJS library loaded successfully');
            
            // EmailJS configuration
            const emailParams = {
                from_name: name,
                from_email: email,
                to_name: 'Klint Vincent Lloren',
                message: message,
                reply_to: email
            };
            
            console.log('📤 EmailJS parameters prepared:', emailParams);
            console.log('🔧 EmailJS configuration:', {
                serviceID: 'service_w6yu3kw',
                templateID: 'template_iluhv55', 
                userID: 'EC2eRMAB0GI-KbQC2'
            });
            
            console.log('🚀 Attempting to send email via EmailJS...');
            
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_w6yu3kw',  // Your service ID
                'template_iluhv55', // Your template ID
                emailParams,
                'EC2eRMAB0GI-KbQC2' // Your public key (User ID)
            );
            
            console.log('✅ Email sent successfully! Response:', response);
            
            // Success
            showMessage('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            
            // Re-enable form after success
            setTimeout(() => {
                disableForm(false);
                hideMessage();
            }, 3000);
            
        } catch (error) {
            console.error('❌ Email sending failed with error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            
            // Provide specific error messages based on the error type
            let errorMessage = 'Sorry, there was an error sending your message. Please try again later.';
            
            if (error.message.includes('Network Error')) {
                errorMessage = 'Network error: Please check your internet connection and try again.';
            } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                errorMessage = 'Authentication error: Please check your EmailJS credentials.';
            } else if (error.message.includes('404') || error.message.includes('not found')) {
                errorMessage = 'Configuration error: Service or template not found. Please check your EmailJS setup.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Timeout error: The server is taking too long to respond. Please try again.';
            }
            
            showMessage(errorMessage, 'error');
            disableForm(false);
        }
    });
}

// ==========================================
// RESUME & CV TABS AND ACCORDION
// ==========================================
function initResumeCVTabs() {
    const tabButtons = document.querySelectorAll('.resume-cv__tab-btn');
    const tabContents = document.querySelectorAll('.resume-cv__content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('resume-cv__tab-btn--active'));
            
            // Add active class to clicked button
            button.classList.add('resume-cv__tab-btn--active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('resume-cv__content--active'));
            
            // Show selected tab content
            const selectedTab = document.getElementById(`${tabName}-tab`);
            if (selectedTab) {
                selectedTab.classList.add('resume-cv__content--active');
            }
        });
    });
}

function initCVAccordions() {
    const accordionBtns = document.querySelectorAll('.cv__accordion-btn');
    
    if (accordionBtns.length === 0) return;
    
    accordionBtns.forEach(button => {
        button.addEventListener('click', () => {
            const accordionGroup = button.getAttribute('data-accordion');
            const content = button.nextElementSibling;
            
            // Check if this button is already active
            const isActive = button.classList.contains('cv__accordion-btn--active');
            
            // If accordion group allows only one open at a time, close others in same group
            const siblingsInGroup = document.querySelectorAll(
                `.cv__accordion-btn[data-accordion="${accordionGroup}"]`
            );
            
            // Close all buttons in this group
            siblingsInGroup.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('cv__accordion-btn--active');
                    btn.nextElementSibling?.classList.remove('cv__accordion-content--active');
                    
                    // Update icon
                    const icon = btn.querySelector('.cv__accordion-icon');
                    if (icon) {
                        icon.textContent = '+';
                    }
                }
            });
            
            // Toggle current button
            button.classList.toggle('cv__accordion-btn--active');
            
            // Animate content
            if (content) {
                if (isActive) {
                    content.classList.remove('cv__accordion-content--active');
                    button.querySelector('.cv__accordion-icon').textContent = '+';
                } else {
                    content.classList.add('cv__accordion-content--active');
                    button.querySelector('.cv__accordion-icon').textContent = '−';
                }
            }
        });
    });
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            // Monitor Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Monitor First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.log('FID:', entry.processingStart - entry.startTime, 'ms');
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Monitor Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue.toFixed(3));
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
            console.warn('Performance monitoring not fully supported:', error);
        }
    }

    // Monitor JavaScript execution time
    const startTime = performance.now();
    
    // Log performance when page is fully loaded
    window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
    });
}

// ==========================================
// RESPONSIVE HANDLING
// ==========================================
function initResponsiveHandling() {
    const handleResize = debounce(() => {
        // Re-initialize components that might need updating on resize
        initScrollAnimations();
        initCircularProgress();
    }, CONFIG.debounce.resize);

    window.addEventListener('resize', handleResize);
}

// ==========================================
// ERROR HANDLING & FALLBACKS
// ==========================================
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('JavaScript Error:', event.error);
        // Could send to error tracking service here
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
    });
}

// ==========================================
// INITIALIZE ALL FEATURES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize components in order of importance
        initThemeToggle();
        initNavigation();
        initScrollAnimations();
        initCyclingHi();
        initMagneticButtons();
        initCircularProgress();
        initProfilePicture();
        initAchievementsExpand();
        initContactForm();
        initResumeCVTabs();
        initCVAccordions();
        
        // Performance and monitoring
        initPerformanceMonitoring();
        initResponsiveHandling();
        initErrorHandling();
        
        console.log('Portfolio initialized successfully! 🚀');
        
        // Log performance metrics
        if (performance.mark) {
            performance.mark('portfolio-initialized');
        }
        
    } catch (error) {
        console.error('Error initializing portfolio:', error);
        // Fallback initialization
        initThemeToggle();
        initNavigation();
    }
});

// ==========================================
// EXPORT FOR TESTING (Optional)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCyclingHi,
        initNavigation,
        initThemeToggle,
        initScrollAnimations,
        initMagneticButtons,
        initCircularProgress,
        initProfilePicture,
        initAchievementsExpand,
        initContactForm,
        initResumeCVTabs,
        initCVAccordions,
        smoothScrollTo,
        debounce,
        throttle
    };
}