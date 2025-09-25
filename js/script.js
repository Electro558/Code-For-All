// Luxury Store Style Navigation & Animations
document.addEventListener("DOMContentLoaded", function () {
    // Set active navigation based on current page
    setActiveNavigation();

    // Initialize luxury scroll animations
    initLuxuryScrollAnimations();

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");
    const navLinks = document.querySelectorAll("nav a");

    // Toggle mobile menu
    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });

        // Close menu when clicking on a link
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
            });
        });
    }

    // Ensure menu is closed on page load
    if (nav) {
        nav.classList.remove("active");
    }
});

// Luxury Scroll Animations System
function initLuxuryScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Optional: unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate
    const animatedElements = document.querySelectorAll(
        ".scroll-reveal, .section-title, .about-content, .cause-content, .testimonial"
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });

    // Add scroll-reveal class to stat boxes and other elements
    const statBoxes = document.querySelectorAll(".stat-box");
    statBoxes.forEach((box) => {
        box.classList.add("scroll-reveal");
        observer.observe(box);
    });

    // Smooth scroll enhancement for luxury feel
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Add luxury parallax effect on scroll
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll(".hero::before");

        parallaxElements.forEach((element) => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        // Handle home page
        if (
            (currentPage === "index.html" || currentPage === "") &&
            (href === "#home" || href === "index.html" || href === "/")
        ) {
            link.classList.add("active");
        }
        // Handle other pages
        else if (href && href.includes(currentPage)) {
            link.classList.add("active");
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
        let userData = localStorage.getItem("codeforall_currentuser");
        if (!userData) {
            userData = localStorage.getItem("currentUser");
        }
        return userData ? JSON.parse(userData) : null;
    }

    async login(username, password) {
        try {
            // First try to get users from JSON file
            let users = [];
            try {
                const response = await fetch("users.json");
                const data = await response.json();
                users = data.users || [];
            } catch (fetchError) {
                console.log(
                    "Could not fetch users.json, using localStorage only"
                );
            }

            // Also get users from localStorage (for demo registrations)
            const localUsers = localStorage.getItem("registeredUsers");
            if (localUsers) {
                const parsedLocalUsers = JSON.parse(localUsers);
                users = [...users, ...parsedLocalUsers];
            }

            const user = users.find(
                (u) =>
                    (u.username === username || u.email === username) &&
                    u.password === password
            );

            if (user) {
                this.currentUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                };
                // Set both keys for compatibility
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(this.currentUser)
                );
                localStorage.setItem(
                    "codeforall_currentuser",
                    JSON.stringify(this.currentUser)
                );
                this.updateNavigation();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error during login:", error);
            return false;
        }
    }

    async register(userData) {
        try {
            // First, check if user already exists
            const response = await fetch("users.json");
            const data = await response.json();
            const users = data.users || [];

            // Check for existing username or email
            const existingUser = users.find(
                (u) =>
                    u.username.toLowerCase() ===
                        userData.username.toLowerCase() ||
                    u.email.toLowerCase() === userData.email.toLowerCase()
            );

            if (existingUser) {
                this.showMessage("Username or email already exists", "error");
                return false;
            }

            // Create new user object
            const newUser = {
                id: Date.now(), // Simple ID generation
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: "user", // Default role
                created_at: new Date().toISOString(),
                last_login: null,
            };

            // Add new user to the array
            users.push(newUser);

            // Save to backend
            const saveResponse = await fetch("/save-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (saveResponse.ok) {
                this.showMessage(
                    "Registration successful! Please login.",
                    "success"
                );
                return true;
            } else {
                // Fallback: save to localStorage for demo purposes
                const existingData = localStorage.getItem("registeredUsers");
                const registeredUsers = existingData
                    ? JSON.parse(existingData)
                    : [];
                registeredUsers.push(newUser);
                localStorage.setItem(
                    "registeredUsers",
                    JSON.stringify(registeredUsers)
                );

                this.showMessage(
                    "Registration successful! (Demo mode - data saved locally)",
                    "success"
                );
                return true;
            }
        } catch (error) {
            console.error("Error during registration:", error);

            // Fallback: save to localStorage for demo purposes
            try {
                const newUser = {
                    id: Date.now(),
                    username: userData.username,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: "user",
                    created_at: new Date().toISOString(),
                    last_login: null,
                };

                const existingData = localStorage.getItem("registeredUsers");
                const registeredUsers = existingData
                    ? JSON.parse(existingData)
                    : [];

                // Check for duplicates in localStorage
                const existingLocalUser = registeredUsers.find(
                    (u) =>
                        u.username.toLowerCase() ===
                            userData.username.toLowerCase() ||
                        u.email.toLowerCase() === userData.email.toLowerCase()
                );

                if (existingLocalUser) {
                    this.showMessage(
                        "Username or email already exists",
                        "error"
                    );
                    return false;
                }

                registeredUsers.push(newUser);
                localStorage.setItem(
                    "registeredUsers",
                    JSON.stringify(registeredUsers)
                );

                this.showMessage(
                    "Registration successful! (Demo mode - data saved locally)",
                    "success"
                );
                return true;
            } catch (fallbackError) {
                console.error("Fallback registration failed:", fallbackError);
                this.showMessage(
                    "Registration failed. Please try again.",
                    "error"
                );
                return false;
            }
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem("currentUser");
        localStorage.removeItem("codeforall_currentuser");
        this.updateNavigation();
        window.location.href = "index.html";
    }

    updateNavigation() {
        const navMenu = document.querySelector("nav ul");
        const adminLink = document.querySelector(".admin-link");

        if (navMenu) {
            const loginLink = navMenu.querySelector('a[href="login.html"]');

            // Add admin link for admin users
            if (
                this.isAdmin() &&
                !navMenu.querySelector('a[href="admin-dashboard.html"]')
            ) {
                const adminLi = document.createElement("li");
                const adminA = document.createElement("a");
                adminA.href = "admin-dashboard.html";
                adminA.textContent = "Admin Dashboard";
                adminA.className = "admin-link";
                adminLi.appendChild(adminA);

                // Insert before login link
                if (loginLink) {
                    loginLink.parentElement.parentNode.insertBefore(
                        adminLi,
                        loginLink.parentElement
                    );
                } else {
                    navMenu.appendChild(adminLi);
                }
            }

            // Remove admin link for non-admin users
            if (!this.isAdmin()) {
                const existingAdminLink = navMenu.querySelector(
                    'a[href="admin-dashboard.html"]'
                );
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
                    if (this.currentUser.role === "admin") {
                        adminLink.style.display = "block";
                    } else {
                        adminLink.style.display = "none";
                    }
                }
            } else if (!this.currentUser && !loginLink) {
                // Restore login link if user logged out
                const lastItem = navMenu.querySelector("li:last-child");
                if (lastItem && lastItem.querySelector(".user-menu")) {
                    lastItem.innerHTML = '<a href="login.html">Login</a>';
                }

                // Hide admin link
                if (adminLink) {
                    adminLink.style.display = "none";
                }
            }
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === "admin";
    }

    showMessage(message, type = "info") {
        // Remove existing messages
        const existingMessages = document.querySelectorAll(".auth-message");
        existingMessages.forEach((msg) => msg.remove());

        // Create message element
        const messageDiv = document.createElement("div");
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
        if (type === "success") {
            messageDiv.style.backgroundColor = "#27ae60";
        } else if (type === "error") {
            messageDiv.style.backgroundColor = "#e74c3c";
        } else {
            messageDiv.style.backgroundColor = "#3498db";
        }

        document.body.appendChild(messageDiv);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = "slideOut 0.3s ease";
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Login form handler
if (document.getElementById("loginForm")) {
    document
        .getElementById("loginForm")
        .addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const errorDiv = document.getElementById("loginError");

            try {
                const success = await authSystem.login(username, password);
                if (success) {
                    // Redirect to admin panel if admin, otherwise to home
                    if (authSystem.isAdmin()) {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    errorDiv.textContent = "Invalid username or password";
                    errorDiv.style.display = "block";
                }
            } catch (error) {
                errorDiv.textContent = "Login failed. Please try again.";
                errorDiv.style.display = "block";
            }
        });
}

// Contact form handler
if (document.getElementById("contactForm")) {
    document
        .getElementById("contactForm")
        .addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            // Simple form validation
            if (name && email && message) {
                alert(
                    "Thank you for your message! We will get back to you soon."
                );
                this.reset();
            } else {
                alert("Please fill in all fields.");
            }
        });
}

// Event registration handlers
function registerForEvent(eventId) {
    if (!authSystem.isLoggedIn()) {
        alert("Please log in to register for events.");
        window.location.href = "login.html";
        return;
    }

    alert(`Successfully registered for event ${eventId}!`);
}

function shareEvent(eventId, platform) {
    const url = window.location.href;
    const text = "Check out this amazing event!";

    switch (platform) {
        case "facebook":
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
            break;
        case "twitter":
            window.open(
                `https://twitter.com/intent/tweet?url=${url}&text=${text}`
            );
            break;
        case "linkedin":
            window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
            );
            break;
    }
}

// Event tabs functionality
function showEventTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll(".event-tab-content").forEach((content) => {
        content.classList.remove("active");
    });

    // Remove active class from all tabs
    document.querySelectorAll(".event-tab").forEach((tab) => {
        tab.classList.remove("active");
    });

    // Show selected tab content
    const selectedContent = document.querySelector(`.${tabName}`);
    if (selectedContent) {
        selectedContent.classList.add("active");
    }

    // Add active class to clicked tab
    event.target.classList.add("active");
}
