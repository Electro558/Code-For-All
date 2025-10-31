document.addEventListener("DOMContentLoaded", () => {
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

    // Email submission
    const CFA_EMAIL_ADDR = "foo@example.com";
    document.querySelector("#join-form-submit").addEventListener("click", (e) => {
        e.preventDefault();

        // Name
        const name = document.querySelector("#name").value;
        const email_address = document.querySelector("#email").value;
        const grade = document.querySelector("#grade").value;



        const interests = Array.from(document.querySelectorAll('input[name="interests[]"]:checked')).map(cb => cb.value).join(" ");


        const message = document.querySelector("#message").value;

        const subject = `New Club Application from ${name}`;
        // dedent
        const body = `
New club application received:

Name: ${name}
Email: ${email_address}
Grade: ${grade}
Interests: ${interests || "(No interests selected)"}

Message:
${message || "(No message provided)"}

---
This email was sent from the Code For All website contact form.
`;

        const link = `mailto:${encodeURIComponent(CFA_EMAIL_ADDR)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(link, "_blank");

    });
});
