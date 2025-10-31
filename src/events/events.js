/** @type {Array} */
const events = IMPORTED_EVENTS;
const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

document.addEventListener("DOMContentLoaded", main);
function main() {
    function formatTimeRange(isoInterval) {
        const [startISO, endISO] = isoInterval.split("/");
        const startDate = new Date(startISO);
        const endDate = new Date(endISO);

        // Format options: no seconds, 12-hour format
        const options = { hour: "numeric", minute: "2-digit", hour12: true };

        const startStr = startDate.toLocaleTimeString(undefined, options);
        const endStr = endDate.toLocaleTimeString(undefined, options);

        return `${startStr} - ${endStr}`;
    }
    function createEventElement(event) {
        let wrapper = document.createElement("div");
        wrapper.classList.add("event-card");

        const day = getDay(new Date(event.datetime.split("/")[0]));

        wrapper.innerHTML = `
            <div class="event-header">
                <div class="event-date">
                    <div class="day">${day.getDate()}</div>
                    <div class="month">${shortMonthNames[day.getMonth()]}</div>
                </div>
                <div class="event-title">
                    <h3>${event.title}</h3>
                    <div class="event-meta">
                        <span>
                            <i class="fas fa-clock"></i>
                            ${formatTimeRange(event.datetime)}
                        </span>
                        <span>
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.location}
                        </span>
                    </div>
                </div>
            </div>
            <img
                src="${event.img_path}"
                alt="${event.title}"
                class="event-image"
            />
            <div class="event-content">
                <p>
                    ${event.description}
                </p>
            </div>
            <div class="event-actions">
                <a href="#" class="btn">RSVP Now</a>
                <div class="share-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fas fa-envelope"></i></a>
                </div>
            </div>`;
        return wrapper;
    }

    function sortEvents() {
        // Sort the elements by date into correct locations
        const upcoming = document.querySelector(".upcoming-events").children[0];
        const past = document.querySelector(".past-events").children[0];

        const today = new Date();
        events.forEach((event) => {
            const startDate = new Date(event.datetime.split("/")[0]);
            if (startDate >= today) {
                // upcoming
                upcoming.append(createEventElement(event));
            } else {
                // past
                past.append(createEventElement(event));
            }
        });
    }
    sortEvents();
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
    function getDay(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
        // const dayEvents = events.filter((event) => event.date === dateStr);

        const date = new Date(year, month, day);

        const dayEvents = events.filter((event) => {
            const [startISO, endISO] = event.datetime.split("/");
            const start = new Date(startISO);
            const end = new Date(endISO);

            const startDay = getDay(start);
            const endDay = getDay(end);
            return date >= startDay && date <= endDay;
        });

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
