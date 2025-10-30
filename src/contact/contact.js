// Form submission handling
console.log("JavaScript loaded successfully");
const joinForm = document.getElementById("join-form");
console.log("Form element found:", joinForm);

// Add a test to verify the form is working
if (joinForm) {
    console.log("Form found! Adding event listener...");
} else {
    console.error('ERROR: Form with ID "join-form" not found!');
}

if (joinForm) {
    joinForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Form submission started");

        // Collect form data
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            grade: document.getElementById("grade").value,
            interests: Array.from(
                document.querySelectorAll('input[name="interests[]"]:checked'),
            ).map((cb) => cb.value),
            message: document.getElementById("message").value,
        };
        console.log("Form data collected:", formData);

        // Show loading state
        const submitBtn = joinForm.querySelector(".submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            console.log("Sending request to server...");
            // Send data to server
            const response = await fetch("/send-contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log(
                "Response received:",
                response.status,
                response.statusText,
            );
            const result = await response.json();
            console.log("Response data:", result);

            if (response.ok && result.status === "success") {
                console.log("Form submission successful");
                showMessage(
                    "Thank you for your interest in joining our club! We will contact you soon.",
                    "success",
                );
                joinForm.reset();
            } else {
                console.log("Form submission failed:", result);
                showMessage(
                    "Sorry, there was an error sending your message. Please try again later.",
                    "error",
                );
            }
        } catch (error) {
            console.error("Error sending form:", error);
            showMessage(
                "Sorry, there was an error sending your message. Please try again later.",
                "error",
            );
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// FAQ accordion functionality
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
        // Toggle current item
        item.classList.toggle("active");

        // Close other items (uncomment for accordion behavior)
        // faqItems.forEach(otherItem => {
        //     if (otherItem !== item) {
        //         otherItem.classList.remove('active');
        //     }
        // });
    });
});

// Function to show user-friendly messages
function showMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    // Insert message after the form
    const joinForm = document.getElementById("join-form");
    joinForm.parentNode.insertBefore(messageDiv, joinForm.nextSibling);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: "smooth",
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/content");
        if (!res.ok) return;
        const content = await res.json();

        const resolve = (obj, path) =>
            path
                .split(".")
                .reduce(
                    (o, k) => (o && o[k] !== undefined ? o[k] : undefined),
                    obj,
                );
        const setTextByKey = (key) => {
            const el = document.querySelector(`[]`);
            const val = resolve(content, key);
            if (el && val !== undefined && val !== null) el.textContent = val;
        };
        const setImageByKey = (key) => {
            const el = document.querySelector(`[]`);
            const val = resolve(content, key);
            if (el && val) el.setAttribute("src", val);
        };

        [
            "contact.header.title",
            "contact.join.title",
            "contact.info.location.title",
            "contact.info.location.value",
            "contact.info.email.title",
            "contact.info.email.value",
            "contact.info.phone.title",
            "contact.info.phone.value",
            "contact.info.meetings.title",
            "contact.info.meetings.text",
            "contact.info.advisors.title",
            "contact.info.advisors.text",
            "contact.info.branches.title",
            "contact.info.branches.text",
            "contact.cta.title",
            "contact.cta.subtitle",
            "contact.cta.button",
            "footer.brand",
            "footer.tagline",
            "footer.links.title",
            "footer.contact.title",
            "footer.contact.email",
            "footer.contact.phone",
            "footer.contact.address",
            "footer.bottom.copyright",
        ].forEach(setTextByKey);

        // Example image binding if later added
        // setImageByKey('contact.header.image');
    } catch (e) {
        console.warn("Content binding failed on contact page:", e);
    }
});
