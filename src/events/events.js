document.addEventListener("DOMContentLoaded", main);
function main() {
    // Banner size/animation toggling based on active tab
    function updateBannerForTab() {
        const pageHeader = document.querySelector(".page-header");
        if (!pageHeader) return;

        const upcomingActive = upcomingTab.classList.contains("active");

        if (upcomingActive) {
            pageHeader.classList.add("big", "parallax");
            pageHeader.style.backgroundPosition = "center 35%";
        } else {
            pageHeader.classList.remove("big", "parallax");
            pageHeader.style.backgroundPosition = "center 50%";
        }
    }

    // Calendar functionality
    function generateCalendar(year, month) {
        const calendarGrid = document.getElementById("calendar-grid");
        const calendarTitle = document.getElementById("calendar-title");

        // Clear existing calendar days (keep headers)
        const dayHeaders = calendarGrid.querySelectorAll(
            ".calendar-day-header",
        );
        calendarGrid.innerHTML = "";
        dayHeaders.forEach((header) => calendarGrid.appendChild(header));

        // Set calendar title
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        calendarTitle.textContent = `${monthNames[month]} ${year}`;

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = createDayElement(
                daysInPrevMonth - i,
                true,
                year,
                month - 1,
            );
            calendarGrid.appendChild(dayElement);
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = createDayElement(day, false, year, month);
            calendarGrid.appendChild(dayElement);
        }

        // Add next month's leading days
        const totalCells = calendarGrid.children.length - 7; // Subtract headers
        const remainingCells = 42 - totalCells; // 6 weeks * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, true, year, month + 1);
            calendarGrid.appendChild(dayElement);
        }
    }

    function createDayElement(day, isOtherMonth, year, month) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        if (isOtherMonth) dayElement.classList.add("other-month");

        const dayNumber = document.createElement("div");
        dayNumber.className = "calendar-day-number";
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        // Check if this day has events
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEvents = events.filter((event) => event.date === dateStr);

        if (dayEvents.length > 0) {
            dayElement.classList.add("has-event");
            const indicator = document.createElement("div");
            indicator.className = "event-indicator";
            dayElement.appendChild(indicator);
        }

        // Check if this is today
        const today = new Date();
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate() &&
            !isOtherMonth
        ) {
            dayElement.classList.add("today");
        }

        // Add click event
        dayElement.addEventListener("click", function () {
            if (dayEvents.length > 0) {
                showEventDetails(dayEvents);
            }
        });

        return dayElement;
    }

    function showEventDetails(dayEvents) {
        const modal = document.getElementById("event-details-modal");
        const list = document.getElementById("event-details-list");
        if (!modal || !list) return;

        // Build rich details UI
        list.innerHTML = "";
        if (dayEvents.length === 0) {
            list.innerHTML = "<p>No events for this day.</p>";
        } else {
            dayEvents.forEach((event) => {
                const card = document.createElement("div");
                card.className = "event-detail-card";
                card.innerHTML = `
                        <div class="event-detail-header">
                            <h4>${event.title}</h4>
                            <span class="event-time">${event.time || "TBD"}</span>
                        </div>
                        <div class="event-detail-body">
                            <p><strong>Location:</strong> ${event.location || "TBD"}</p>
                            ${event.description ? `<p class="event-description">${event.description}</p>` : ""}
                        </div>
                    `;
                list.appendChild(card);
            });
        }

        modal.style.display = "block";
    }

    let events = [];
    events.push({
        id: Date.now().toString(),
        title: "Test",
        date: "2025-11-28",
        time: "11 pm",
        location: "Location",
        description: "Description",
        createdBy: "foobar",
        createdAt: new Date().toISOString(),
    });
    /*
const eventData = {
        id: editingEventId || Date.now().toString(),
        title: document.getElementById("event-title").value,
        date: document.getElementById("event-date").value,
        time: document.getElementById("event-time").value,
        location: document.getElementById("event-location").value,
        description: document.getElementById("event-description").value,
        createdBy: currentUser.username,
        createdAt: new Date().toISOString(),
    };
*/

    console.log(document.readyState);

    let currentDate = new Date();

    // Event tabs functionality
    const upcomingTab = document.querySelector(".upcoming-tab");
    const pastTab = document.querySelector(".past-tab");
    const upcomingEvents = document.querySelector(".upcoming-events");
    const pastEvents = document.querySelector(".past-events");

    upcomingTab.addEventListener("click", function () {
        upcomingTab.classList.add("active");
        pastTab.classList.remove("active");
        upcomingEvents.classList.add("active");
        pastEvents.classList.remove("active");
        updateBannerForTab();
    });

    pastTab.addEventListener("click", function () {
        pastTab.classList.add("active");
        upcomingTab.classList.remove("active");
        pastEvents.classList.add("active");
        upcomingEvents.classList.remove("active");
        updateBannerForTab();
    });

    // Set initial banner state on load
    updateBannerForTab();

    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Navigation buttons
    document
        .getElementById("prev-month")
        .addEventListener("click", function () {
            currentDate.setDate(1); // Prevent skipping -- oct 31 -> nov 31, which does't exist
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

    document
        .getElementById("next-month")
        .addEventListener("click", function () {
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

    function closeEventModal() {
        document.getElementById("event-modal").style.display = "none";
        editingEventId = null;
    }

    // Modal close buttons
    document
        .getElementById("close-modal")
        .addEventListener("click", closeEventModal);
    document
        .getElementById("cancel-event")
        .addEventListener("click", closeEventModal);
    const closeDetailsBtn = document.getElementById("close-details");
    const closeDetailsX = document.getElementById("close-details-modal");
    if (closeDetailsBtn)
        closeDetailsBtn.addEventListener("click", closeEventDetailsModal);
    if (closeDetailsX)
        closeDetailsX.addEventListener("click", closeEventDetailsModal);

    // Close modals when clicking outside
    window.addEventListener("click", function (event) {
        const eventModal = document.getElementById("event-modal");
        const detailsModal = document.getElementById("event-details-modal");
        if (event.target === eventModal) {
            closeEventModal();
        }
        if (event.target === detailsModal) {
            closeEventDetailsModal();
        }
    });
    function closeEventDetailsModal() {
        const modal = document.getElementById("event-details-modal");
        if (modal) modal.style.display = "none";
    }
}
