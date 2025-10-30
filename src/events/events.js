// Global variables
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("calendarEvents")) || [];

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

// Set initial banner state on load
updateBannerForTab();

// Calendar functionality
function generateCalendar(year, month) {
    const calendarGrid = document.getElementById("calendar-grid");
    const calendarTitle = document.getElementById("calendar-title");

    // Clear existing calendar days (keep headers)
    const dayHeaders = calendarGrid.querySelectorAll(".calendar-day-header");
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
        } else if (isAdmin && !isOtherMonth) {
            openEventModal(dateStr);
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

// Navigation functionality will be handled in DOMContentLoaded
// Modal functionality

function openEventModal(date = "") {
    // Check admin authorization before opening
    if (!isAdmin) {
        alert("Access denied. Admin privileges required.");
        return;
    }

    const modal = document.getElementById("event-modal");
    const form = document.getElementById("event-form");
    form.reset();

    if (date) {
        document.getElementById("event-date").value = date;
    }

    document.getElementById("modal-title").textContent = editingEventId
        ? "Edit Event"
        : "Add New Event";
    modal.style.display = "block";
}

function closeEventModal() {
    document.getElementById("event-modal").style.display = "none";
    editingEventId = null;
}

// Event form submission
document.getElementById("event-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Double-check admin authorization
    if (!isAdmin) {
        alert("Access denied. Admin privileges required.");
        closeEventModal();
        return;
    }

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

    if (editingEventId) {
        const index = events.findIndex((event) => event.id === editingEventId);
        if (index !== -1) {
            eventData.modifiedBy = currentUser.username;
            eventData.modifiedAt = new Date().toISOString();
            events[index] = eventData;
        }
    } else {
        events.push(eventData);
    }

    localStorage.setItem("calendarEvents", JSON.stringify(events));
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    closeEventModal();
});

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
    // Load events from localStorage
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
        events = JSON.parse(savedEvents);
    }

    // Initialize session and calendar
    initializeSession();
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

    // Navigation buttons
    document
        .getElementById("prev-month")
        .addEventListener("click", function () {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

    document
        .getElementById("next-month")
        .addEventListener("click", function () {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
        });

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

    // Admin panel button event listeners
    const addEventBtn = document.getElementById("add-event");
    const hideAdminPanelBtn = document.getElementById("hide-admin-panel");
    const logoutBtn = document.getElementById("logout-btn");

    if (addEventBtn) {
        addEventBtn.addEventListener("click", function () {
            if (isAdmin) {
                openEventModal();
            }
        });
    }

    if (hideAdminPanelBtn) {
        hideAdminPanelBtn.addEventListener("click", function () {
            const adminPanel = document.getElementById("admin-panel");
            if (adminPanel) {
                adminPanel.style.display = "none";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            destroySession();
        });
    }
});

function closeEventDetailsModal() {
    const modal = document.getElementById("event-details-modal");
    if (modal) modal.style.display = "none";
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/content");
        const data = (await res.json()) || {};
        const ev = data.events || {};
        const footer = data.footer || {};
        const setText = (sel, val) => {
            const el = document.querySelector(sel);
            if (el && typeof val === "string") el.textContent = val;
        };
        setText("[]", ev.header?.title);
        setText("[]", ev.header?.subtitle);
        setText("[]", ev.upcoming?.event1?.title);
        setText("[]", ev.upcoming?.event1?.time);
        setText("[]", ev.upcoming?.event1?.location);
        const img1 = document.querySelector("[]");
        if (img1 && typeof ev.upcoming?.event1?.image === "string")
            img1.src = ev.upcoming.event1.image;
        setText("[]", ev.upcoming?.event1?.desc1);
        setText("[]", ev.upcoming?.event1?.desc2);
        setText("[]", ev.upcoming?.event2?.title);
        setText("[]", ev.upcoming?.event2?.time);
        setText("[]", ev.upcoming?.event2?.location);
        const img2 = document.querySelector("[]");
        if (img2 && typeof ev.upcoming?.event2?.image === "string")
            img2.src = ev.upcoming.event2.image;
        setText("[]", ev.upcoming?.event2?.desc1);
        setText("[]", ev.upcoming?.event2?.desc2);
        setText("[]", ev.upcoming?.event2?.cta);
        setText("[]", ev.upcoming?.event3?.title);
        setText("[]", ev.upcoming?.event3?.time);
        setText("[]", ev.upcoming?.event3?.location);
        const img3 = document.querySelector("[]");
        if (img3 && typeof ev.upcoming?.event3?.image === "string")
            img3.src = ev.upcoming.event3.image;
        setText("[]", ev.upcoming?.event3?.desc1);
        setText("[]", ev.upcoming?.event3?.desc2);
        setText("[]", ev.upcoming?.event3?.cta);
        setText("[]", footer.contact?.email);
        setText("[]", footer.contact?.phone);
        setText("[]", footer.contact?.address);
        setText("[]", ev.cta?.title);
        setText("[]", ev.cta?.subtitle);
        setText("[]", ev.cta?.button);
        setText("[]", footer.brand);
        setText("[]", footer.tagline);
        setText("[]", footer.links?.title);
        setText("[]", footer.contact?.title);
        setText("[]", footer.bottom?.copyright);
    } catch (e) {
        console.warn("Events content binding failed", e);
    }
});
