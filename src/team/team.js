    document.addEventListener("DOMContentLoaded", () => {
        // Team filtering functionality
        const categoryButtons = document.querySelectorAll(".team-category");
        const teamMembers = document.querySelectorAll(".team-member");

        categoryButtons.forEach((button) => {
            button.addEventListener("click", function () {
                // Update active button
                categoryButtons.forEach((btn) =>
                    btn.classList.remove("active"),
                );
                this.classList.add("active");

                // Filter team members
                const filter = this.getAttribute("data-filter");

                teamMembers.forEach((member) => {
                    if (
                        filter === "all" ||
                        member.getAttribute("data-category") === filter
                    ) {
                        member.style.display = "block";
                    } else {
                        member.style.display = "none";
                    }
                });
            });
        });
    });