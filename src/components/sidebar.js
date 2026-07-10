/**
 * Sidebar Component
 * Renders the course chapters outline and lessons list
 */

export function renderSidebar(container, outline, currentLessonId, completedIds, onSelectLesson) {
    if (!container) return;

    // Header logo and collapse button
    container.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-logo">AIM <span>GAME DEV</span></div>
            <button class="hamburger-btn" id="sidebar-close-btn" style="display: none;">✕</button>
        </div>
        <div class="sidebar-search-box">
            <input type="text" class="sidebar-search" id="sidebar-search-input" placeholder="Search lessons..." aria-label="Search lessons">
        </div>
        <div class="sidebar-outline" id="sidebar-outline-list">
            <!-- Outlines will be rendered here dynamically -->
        </div>
    `;

    const outlineList = container.querySelector("#sidebar-outline-list");
    const searchInput = container.querySelector("#sidebar-search-input");
    const closeBtn = container.querySelector("#sidebar-close-btn");

    if (closeBtn) {
        // Toggle display block only on mobile screen widths (handled via media queries in CSS)
        closeBtn.addEventListener("click", () => {
            container.classList.remove("open");
        });
    }

    // Function to render items matching search filter
    const renderFilteredItems = (filterText = "") => {
        let chaptersHTML = "";
        const query = filterText.toLowerCase().trim();

        outline.chapters.forEach(chap => {
            const matchingLessons = chap.lessons.filter(l => 
                l.title.toLowerCase().includes(query)
            );

            if (matchingLessons.length > 0) {
                chaptersHTML += `
                    <div class="chapter-group">
                        <div class="chapter-title">${chap.chapterName}</div>
                        <ul class="lesson-list">
                            ${matchingLessons.map(l => {
                                const isActive = l.id === currentLessonId ? "active" : "";
                                const isCompleted = completedIds.includes(l.id) ? "completed" : "";
                                return `
                                    <li>
                                        <button class="lesson-item-btn ${isActive} ${isCompleted}" data-lesson-id="${l.id}">
                                            <div class="status-dot"></div>
                                            <span class="lesson-item-title">${l.title}</span>
                                        </button>
                                    </li>
                                `;
                            }).join("")}
                        </ul>
                    </div>
                `;
            }
        });

        if (!chaptersHTML) {
            outlineList.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); font-size: 13px; padding-top: 20px;">No matching units found</div>`;
        } else {
            outlineList.innerHTML = chaptersHTML;
        }

        // Attach click listeners
        outlineList.querySelectorAll(".lesson-item-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const lessonId = btn.getAttribute("data-lesson-id");
                onSelectLesson(lessonId);
                // Auto-close on mobile layout click
                container.classList.remove("open");
            });
        });
    };

    // Initialize list render
    renderFilteredItems();

    // Attach search listener
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderFilteredItems(e.target.value);
        });
    }
}
