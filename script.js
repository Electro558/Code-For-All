// Luxury Store Style Navigation & Animations
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation based on current page
    setActiveNavigation();
    
    // Initialize luxury scroll animations
    initLuxuryScrollAnimations();

    // Loader overlay: ensure presence and fade out smoothly when assets are ready
    let loader = document.querySelector('.loader-overlay');
    // Fallback: inject loader overlay if missing on this page
    if (!loader) {
        const overlay = document.createElement('div');
        overlay.id = 'loader-overlay';
        overlay.className = 'loader-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div class="loader-content">
                <div class="loader-visual">
                    <div class="loader-ring"></div>
                    <img src="logos/logo_big_light.png" alt="Code For All Logo" class="loader-logo" />
                </div>
                <div class="loader-text">Loading Code For All...</div>
            </div>
        `;
        // Insert as the first element inside body
        if (document.body) {
            document.body.insertBefore(overlay, document.body.firstChild);
            loader = overlay;
        }
    }
    if (loader) {
        const startTime = performance.now();
        const minDisplayMs = 1000; // ensure loader is visible at least 1s
        
        // On home page, wait for fonts and image decode to finish before hiding loader
        const isHome = location.pathname.endsWith('index.html') || location.pathname === '/';
        let readinessPromise = Promise.resolve();
        if (isHome) {
            const decodeAllImages = () => {
                const imgs = Array.from(document.images);
                const promises = imgs.map(img => {
                    if (img.decode) {
                        return img.decode().catch(() => {});
                    }
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    });
                });
                return Promise.all(promises).catch(() => {});
            };
            const fontsReady = (document.fonts && document.fonts.ready)
                ? document.fonts.ready.catch(() => {})
                : Promise.resolve();
            readinessPromise = Promise.all([fontsReady, decodeAllImages()]).catch(() => {});
        }

        // Ensure loader starts visible and intercepts clicks while active
        loader.style.opacity = '1';
        loader.style.pointerEvents = 'auto';

        const hideLoader = () => {
            // Trigger CSS transition
            loader.classList.add('hidden');
            // Remove from DOM after transition to free interactions, then fade page content
            const onTransitionEnd = () => {
                loader.removeEventListener('transitionend', onTransitionEnd);
                document.body.classList.add('page-visible');
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            };
            loader.addEventListener('transitionend', onTransitionEnd);
        };

        const scheduleHide = () => {
            const elapsed = performance.now() - startTime;
            const wait = Math.max(0, minDisplayMs - elapsed);
            setTimeout(() => {
                readinessPromise.then(() => {
                    if (!loader.classList.contains('hidden')) hideLoader();
                });
            }, wait);
        };

        // Use window 'load' for full assets; fallback timer for robustness
        if (document.readyState === 'complete') {
            scheduleHide();
        } else {
            window.addEventListener('load', scheduleHide, { once: true });
            // First fallback: quick UX after 2.5s (respects min display)
            const quickTimeout = setTimeout(() => {
                if (!loader.classList.contains('hidden')) scheduleHide();
            }, 2500);
            // Hard fallback: guarantee hide after 6s using transition, then fade page content at end
            setTimeout(() => {
                clearTimeout(quickTimeout);
                if (document.body.contains(loader) && !loader.classList.contains('hidden')) {
                    loader.classList.add('hidden');
                    const onEnd = () => {
                        loader.removeEventListener('transitionend', onEnd);
                        document.body.classList.add('page-visible');
                        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
                    };
                    loader.addEventListener('transitionend', onEnd);
                }
            }, 6000);
        }
    }
    
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');

    // Toggle mobile menu
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
    
    // Ensure menu is closed on page load
    if (nav) {
        nav.classList.remove('active');
    }
});

// Luxury Scroll Animations System
function initLuxuryScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate
    const animatedElements = document.querySelectorAll('.scroll-reveal, .section-title, .about-content, .cause-content, .testimonial');
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add scroll-reveal class to stat boxes and other elements
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
        box.classList.add('scroll-reveal');
        observer.observe(box);
    });

    // Smooth scroll enhancement for luxury feel
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add luxury parallax effect on scroll
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        
        // Handle home page
        if ((currentPage === 'index.html' || currentPage === '') && 
            (href === '#home' || href === 'index.html' || href === '/')) {
            link.classList.add('active');
        }
        // Handle other pages
        else if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Simple Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.updateNavigation();
    }

    getCurrentUser() {
        // Check both possible keys for compatibility
        let userData = localStorage.getItem('codeforall_currentuser');
        if (!userData) {
            userData = localStorage.getItem('currentUser');
        }
        return userData ? JSON.parse(userData) : null;
    }

    async login(username, password) {
        try {
            // First try to get users from JSON file
            let users = [];
            try {
                const response = await fetch('users.json');
                const data = await response.json();
                users = data.users || [];
            } catch (fetchError) {
                console.log('Could not fetch users.json, using localStorage only');
            }
            
            // Also get users from localStorage (for demo registrations)
            const localUsers = localStorage.getItem('registeredUsers');
            if (localUsers) {
                const parsedLocalUsers = JSON.parse(localUsers);
                users = [...users, ...parsedLocalUsers];
            }
            
            const user = users.find(u => 
                (u.username === username || u.email === username) && u.password === password
            );
            
            if (user) {
                this.currentUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name
                };
                // Set both keys for compatibility
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem('codeforall_currentuser', JSON.stringify(this.currentUser));
                this.updateNavigation();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    }

    async register(userData) {
        try {
            // First, check if user already exists
            const response = await fetch('users.json');
            const data = await response.json();
            const users = data.users || [];
            
            // Check for existing username or email
            const existingUser = users.find(u => 
                u.username.toLowerCase() === userData.username.toLowerCase() || 
                u.email.toLowerCase() === userData.email.toLowerCase()
            );
            
            if (existingUser) {
                this.showMessage('Username or email already exists', 'error');
                return false;
            }
            
            // Create new user object
            const newUser = {
                id: Date.now(), // Simple ID generation
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'user', // Default role
                created_at: new Date().toISOString(),
                last_login: null
            };
            
            // Add new user to the array
            users.push(newUser);
            
            // Save to backend
            const saveResponse = await fetch('/save-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            
            if (saveResponse.ok) {
                this.showMessage('Registration successful! Please login.', 'success');
                return true;
            } else {
                // Fallback: save to localStorage for demo purposes
                const existingData = localStorage.getItem('registeredUsers');
                const registeredUsers = existingData ? JSON.parse(existingData) : [];
                registeredUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                this.showMessage('Registration successful! (Demo mode - data saved locally)', 'success');
                return true;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            
            // Fallback: save to localStorage for demo purposes
            try {
                const newUser = {
                    id: Date.now(),
                    username: userData.username,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_login: null
                };
                
                const existingData = localStorage.getItem('registeredUsers');
                const registeredUsers = existingData ? JSON.parse(existingData) : [];
                
                // Check for duplicates in localStorage
                const existingLocalUser = registeredUsers.find(u => 
                    u.username.toLowerCase() === userData.username.toLowerCase() || 
                    u.email.toLowerCase() === userData.email.toLowerCase()
                );
                
                if (existingLocalUser) {
                    this.showMessage('Username or email already exists', 'error');
                    return false;
                }
                
                registeredUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                this.showMessage('Registration successful! (Demo mode - data saved locally)', 'success');
                return true;
            } catch (fallbackError) {
                console.error('Fallback registration failed:', fallbackError);
                this.showMessage('Registration failed. Please try again.', 'error');
                return false;
            }
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('codeforall_currentuser');
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    updateNavigation() {
        const navMenu = document.querySelector('nav ul');
        const adminLink = document.querySelector('.admin-link');
        
        if (navMenu) {
            const loginLink = navMenu.querySelector('a[href="login.html"]');
            
            // Add admin link for admin users (but not on admin dashboard page itself)
            const isOnAdminDashboard = window.location.pathname.includes('admin-dashboard.html');
            if (this.isAdmin() && !navMenu.querySelector('a[href="admin-dashboard.html"]') && !isOnAdminDashboard) {
                const adminLi = document.createElement('li');
                const adminA = document.createElement('a');
                adminA.href = 'admin-dashboard.html';
                adminA.textContent = 'Admin Dashboard';
                adminA.className = 'admin-link';
                adminLi.appendChild(adminA);
                
                // Add click event to remove the button after being pressed
                adminA.addEventListener('click', function() {
                    // Remove the admin dashboard button after it's clicked
                    setTimeout(() => {
                        const adminLink = navMenu.querySelector('a[href="admin-dashboard.html"]');
                        if (adminLink) {
                            adminLink.parentElement.remove();
                        }
                    }, 100);
                });
                
                // Insert before login link
                if (loginLink) {
                    loginLink.parentElement.parentNode.insertBefore(adminLi, loginLink.parentElement);
                } else {
                    navMenu.appendChild(adminLi);
                }
            }
            
            // Remove admin link for non-admin users
            if (!this.isAdmin()) {
                const existingAdminLink = navMenu.querySelector('a[href="admin-dashboard.html"]');
                if (existingAdminLink) {
                    existingAdminLink.parentElement.remove();
                }
            }
            
            if (this.currentUser && loginLink) {
                // Replace login link with user menu
                const loginItem = loginLink.parentElement;
                loginItem.innerHTML = `
                    <div class="user-menu">
                        <span class="user-name">Hi, ${this.currentUser.username}</span>
                        <button onclick="authSystem.logout()" class="logout-btn">Logout</button>
                    </div>
                `;
                
                // Show admin link only for admin users
                if (adminLink) {
                    if (this.currentUser.role === 'admin') {
                        adminLink.style.display = 'block';
                    } else {
                        adminLink.style.display = 'none';
                    }
                }
            } else if (!this.currentUser && !loginLink) {
                // Restore login link if user logged out
                const lastItem = navMenu.querySelector('li:last-child');
                if (lastItem && lastItem.querySelector('.user-menu')) {
                    lastItem.innerHTML = '<a href="login.html">Login</a>';
                }
                
                // Hide admin link
                if (adminLink) {
                    adminLink.style.display = 'none';
                }
            }
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#e74c3c';
        } else {
            messageDiv.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Login form handler
if (document.getElementById('auth-form')) {
    document.getElementById('auth-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        try {
            const success = await authSystem.login(username, password);
            if (success) {
                // Redirect to admin panel if admin, otherwise to home
                if (authSystem.isAdmin()) {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorDiv.textContent = 'Invalid username or password';
                errorDiv.style.display = 'block';
            }
        } catch (error) {
            errorDiv.textContent = 'Login failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    });
}

// Contact form handler
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple form validation
        if (name && email && message) {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Event registration handlers
function registerForEvent(eventId) {
    if (!authSystem.isLoggedIn()) {
        alert('Please log in to register for events.');
        window.location.href = 'login.html';
        return;
    }
    
    alert(`Successfully registered for event ${eventId}!`);
}

function shareEvent(eventId, platform) {
    const url = window.location.href;
    const text = 'Check out this amazing event!';
    
    switch(platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
            break;
        case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
            break;
    }
}

// Event tabs functionality
function showEventTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.event-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.event-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.querySelector(`.${tabName}`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Inline editing init for admins
try {
    if (typeof authSystem !== 'undefined' && authSystem.isAdmin()) {
        initInlineEditing();
    }
} catch (e) {
    // no-op
}

function initInlineEditing() {
    // Insert floating Edit button
    const btn = document.createElement('button');
    btn.className = 'inline-edit-toggle';
    btn.textContent = 'Edit Page';
    Object.assign(btn.style, {
        position: 'fixed', right: '20px', bottom: '20px', zIndex: '10000',
        padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
        background: '#f39c12', color: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.2)', fontWeight: '700'
    });

    const toolbar = document.createElement('div');
    toolbar.className = 'inline-edit-toolbar';
    Object.assign(toolbar.style, {
        position: 'fixed', right: '20px', bottom: '70px', zIndex: '10000', display: 'none',
        background: '#ffffff', border: '1px solid #ddd', borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)', padding: '10px'
    });
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    Object.assign(saveBtn.style, {
        padding: '8px 12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', marginRight: '8px'
    });
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    Object.assign(cancelBtn.style, {
        padding: '8px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700'
    });
    toolbar.appendChild(saveBtn);
    toolbar.appendChild(cancelBtn);

    document.body.appendChild(btn);
    document.body.appendChild(toolbar);

    const state = { enabled: false, changes: {}, original: new Map() };

    const editableEls = Array.from(document.querySelectorAll('[data-edit-key]'));

    const enable = () => {
        state.enabled = true;
        btn.textContent = 'Editing On';
        btn.style.background = '#e67e22';
        toolbar.style.display = 'block';
        editableEls.forEach(el => {
            const type = el.getAttribute('data-edit-type');
            el.classList.add('inline-edit-highlight');
            if (type === 'text') {
                state.original.set(el, el.textContent);
                el.setAttribute('contenteditable', 'true');
                el.style.outline = '2px dashed #f39c12';
                el.style.outlineOffset = '4px';
                el.addEventListener('input', onTextInput);
                el.addEventListener('blur', onTextBlur);
            } else if (type === 'image' || type === 'bgimage') {
                el.style.outline = '2px dashed #f39c12';
                el.style.outlineOffset = '4px';
                el.addEventListener('click', onImageClick);
                // hint overlay title
                el.setAttribute('title', 'Click to change image');
            }
        });
        authSystem && authSystem.showMessage('Inline editing enabled', 'success');
    };

    const disable = (reload = false) => {
        state.enabled = false;
        btn.textContent = 'Edit Page';
        btn.style.background = '#f39c12';
        toolbar.style.display = 'none';
        editableEls.forEach(el => {
            const type = el.getAttribute('data-edit-type');
            el.classList.remove('inline-edit-highlight');
            el.style.outline = '';
            el.style.outlineOffset = '';
            if (type === 'text') {
                el.removeAttribute('contenteditable');
                el.removeEventListener('input', onTextInput);
                el.removeEventListener('blur', onTextBlur);
            } else if (type === 'image' || type === 'bgimage') {
                el.removeEventListener('click', onImageClick);
                el.removeAttribute('title');
            }
        });
        state.changes = {};
        state.original.clear();
        if (reload) {
            location.reload();
        }
    };

    const onTextInput = (e) => {
        const el = e.currentTarget;
        const key = el.getAttribute('data-edit-key');
        state.changes[key] = el.textContent.trim();
    };
    const onTextBlur = (e) => {
        const el = e.currentTarget;
        const key = el.getAttribute('data-edit-key');
        state.changes[key] = el.textContent.trim();
    };

    const onImageClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.currentTarget;
        // Ignore clicks that originate from child elements (e.g., editable text inside a bgimage container)
        if (e.target !== e.currentTarget) {
            return;
        }
        // Also ignore if the clicked target is or is inside a text-editable element
        if (e.target.closest('[data-edit-type="text"]')) {
            return;
        }
        const key = el.getAttribute('data-edit-key');
        const type = el.getAttribute('data-edit-type');
        try {
            const file = await pickImageFile();
            if (!file) return;
            const url = await uploadImageInline(file, (file && file.name) || 'image');
            if (url) {
                if (type === 'image') {
                    el.src = url;
                } else if (type === 'bgimage') {
                    // Preserve existing gradient if any
                    const gradient = 'linear-gradient(rgba(52, 152, 219, 0.85), rgba(41, 128, 185, 0.9))';
                    el.style.background = `${gradient}, url('${url}') no-repeat center center/cover`;
                }
                state.changes[key] = url;
                authSystem && authSystem.showMessage('Image updated (not yet saved)', 'info');
            }
        } catch (err) {
            console.warn('Inline image update failed', err);
            authSystem && authSystem.showMessage('Image update failed', 'error');
        }
    };

    btn.addEventListener('click', () => {
        if (!state.enabled) enable(); else disable(false);
    });

    saveBtn.addEventListener('click', async () => {
        try {
            // Fetch current content to merge changes
            const res = await fetch('/api/content');
            let content = {};
            if (res.ok) {
                content = await res.json();
            }
            // Apply changes map to content object
            for (const [path, value] of Object.entries(state.changes)) {
                setNested(content, path, value);
            }
            // Persist
            const resp = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            if (!resp.ok) throw new Error('Save failed');
            authSystem && authSystem.showMessage('Changes saved!', 'success');
            disable(true);
        } catch (err) {
            console.error('Save error:', err);
            authSystem && authSystem.showMessage('Failed to save changes', 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        disable(true);
    });
}

async function pickImageFile() {
    return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            resolve(file || null);
            input.remove();
        }, { once: true });
        input.click();
    });
}

async function uploadImageInline(file, filenameHint) {
    const toDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    const dataUrl = await toDataURL(file);
    const resp = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataUrl, filename: filenameHint || 'upload' })
    });
    if (!resp.ok) throw new Error('Upload failed');
    const json = await resp.json();
    if (json && json.status === 'success' && json.url) {
        return json.url;
    }
    throw new Error(json && json.message ? json.message : 'Upload failed');
}

function setNested(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {};
        cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
    return obj;
}

// minimal highlight style injection
(function injectInlineEditStyles(){
    const css = `
    .inline-edit-highlight { position: relative; }
    .inline-edit-highlight::after { content: '✎'; position: absolute; top: -10px; right: -10px; background: #f39c12; color: #fff; font-size: 10px; padding: 2px 4px; border-radius: 4px; }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();