// Luxury Store Style Navigation & Animations
document.addEventListener("DOMContentLoaded", function () {
    // Set active navigation based on current page
    setActiveNavigation();

    // Initialize luxury scroll animations
    initLuxuryScrollAnimations();

    // Loader overlay: ensure presence and fade out smoothly when assets are ready
    let loader = document.querySelector(".loader-overlay");
    // Fallback: inject loader overlay if missing on this page
    if (!loader) {
        const overlay = document.createElement("div");
        overlay.id = "loader-overlay";
        overlay.className = "loader-overlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.innerHTML = `
            <div class="loader-content">
                <div class="loader-visual">
                    <div class="loader-ring"></div>
                    <img src="/logos/logo_big_light.png" alt="Code For All Logo" class="loader-logo" />
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
        const isHome =
            location.pathname.endsWith("index.html") ||
            location.pathname === "/";
        let readinessPromise = Promise.resolve();
        if (isHome) {
            const decodeAllImages = () => {
                const imgs = Array.from(document.images);
                const promises = imgs.map((img) => {
                    if (img.decode) {
                        return img.decode().catch(() => {});
                    }
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.addEventListener("load", resolve, { once: true });
                        img.addEventListener("error", resolve, { once: true });
                    });
                });
                return Promise.all(promises).catch(() => {});
            };
            const fontsReady =
                document.fonts && document.fonts.ready
                    ? document.fonts.ready.catch(() => {})
                    : Promise.resolve();
            readinessPromise = Promise.all([
                fontsReady,
                decodeAllImages(),
            ]).catch(() => {});
        }

        // Ensure loader starts visible and intercepts clicks while active
        loader.style.opacity = "1";
        loader.style.pointerEvents = "auto";

        const hideLoader = () => {
            // Trigger CSS transition
            loader.classList.add("hidden");
            // Remove from DOM after transition to free interactions, then fade page content
            const onTransitionEnd = () => {
                loader.removeEventListener("transitionend", onTransitionEnd);
                document.body.classList.add("page-visible");
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            };
            loader.addEventListener("transitionend", onTransitionEnd);
        };

        const scheduleHide = () => {
            const elapsed = performance.now() - startTime;
            const wait = Math.max(0, minDisplayMs - elapsed);
            setTimeout(() => {
                readinessPromise.then(() => {
                    if (!loader.classList.contains("hidden")) hideLoader();
                });
            }, wait);
        };

        // Use window 'load' for full assets; fallback timer for robustness
        if (document.readyState === "complete") {
            scheduleHide();
        } else {
            window.addEventListener("load", scheduleHide, { once: true });
            // First fallback: quick UX after 2.5s (respects min display)
            const quickTimeout = setTimeout(() => {
                if (!loader.classList.contains("hidden")) scheduleHide();
            }, 2500);
            // Hard fallback: guarantee hide after 6s using transition, then fade page content at end
            setTimeout(() => {
                clearTimeout(quickTimeout);
                if (
                    document.body.contains(loader) &&
                    !loader.classList.contains("hidden")
                ) {
                    loader.classList.add("hidden");
                    const onEnd = () => {
                        loader.removeEventListener("transitionend", onEnd);
                        document.body.classList.add("page-visible");
                        if (loader && loader.parentNode)
                            loader.parentNode.removeChild(loader);
                    };
                    loader.addEventListener("transitionend", onEnd);
                }
            }, 6000);
        }
    }

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
        ".scroll-reveal, .section-title, .about-content, .cause-content, .testimonial",
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

function setActiveNavigation() {
    // Normalize the current path (remove trailing slash)
    let path = window.location.pathname.replace(/\/$/, "");

    // Default to "/" for the home page
    if (path === "") path = "/";

    // Get all nav links
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {
        // Remove existing active classes
        link.classList.remove("active");

        // Normalize link href (handle absolute and relative URLs)
        const href = link.getAttribute("href").replace(/\/$/, "");

        // Add 'active' if it matches the current path
        if (href === path) {
            link.classList.add("active");
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
                    "Thank you for your message! We will get back to you soon.",
                );
                this.reset();
            } else {
                alert("Please fill in all fields.");
            }
        });
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
                `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            );
            break;
        case "linkedin":
            window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
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

async function pickImageFile() {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);
        input.addEventListener(
            "change",
            () => {
                const file = input.files && input.files[0];
                resolve(file || null);
                input.remove();
            },
            { once: true },
        );
        input.click();
    });
}

async function uploadImageInline(file, filenameHint) {
    const toDataURL = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    const dataUrl = await toDataURL(file);
    const resp = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: dataUrl,
            filename: filenameHint || "upload",
        }),
    });
    if (!resp.ok) throw new Error("Upload failed");
    const json = await resp.json();
    if (json && json.status === "success" && json.url) {
        return json.url;
    }
    throw new Error(json && json.message ? json.message : "Upload failed");
}

function setNested(obj, path, value) {
    const parts = path.split(".");
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
        cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
    return obj;
}

// minimal highlight style injection
(function injectInlineEditStyles() {
    const css = `
    .inline-edit-highlight { position: relative; }
    .inline-edit-highlight::after { content: '✎'; position: absolute; top: -10px; right: -10px; background: #f39c12; color: #fff; font-size: 10px; padding: 2px 4px; border-radius: 4px; }
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();
