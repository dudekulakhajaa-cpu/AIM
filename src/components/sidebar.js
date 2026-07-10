/**
 * Sidebar Component
 * Renders the course chapter outline with collapsible groups,
 * search filtering, active/completed/locked states, and responsive drawer.
 * 
 * @module sidebar
 */

/**
 * Render the sidebar navigation panel.
 * 
 * @param {HTMLElement} container - The sidebar DOM element
 * @param {Object} outline - The course outline object
 * @param {string} currentLessonId - The currently active lesson ID
 * @param {string[]} completedIds - Array of completed lesson IDs
 * @param {Function} onSelectLesson - Callback invoked with (lessonId) when a lesson is clicked
 */
export function renderSidebar(container, outline, currentLessonId, completedIds, onSelectLesson) {
    if (!container) return;

    // Track which chapters are collapsed (persist across re-renders)
    if (!container._collapsedChapters) {
        container._collapsedChapters = new Set();
    }

    container.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-logo">AIM <span>GAME DEV</span></div>
            <button class="hamburger-btn sidebar-close-btn" id="sidebar-close-btn"
                    aria-label="Close navigation menu">✕</button>
        </div>
        <div class="sidebar-search-box">
            <input type="text" class="sidebar-search" id="sidebar-search-input"
                   placeholder="Search lessons..." aria-label="Search lessons"
                   autocomplete="off">
        </div>
        <nav class="sidebar-outline" id="sidebar-outline-list"
             role="navigation" aria-label="Course lessons">
        </nav>
    `;

    const outlineList = container.querySelector('#sidebar-outline-list');
    const searchInput = container.querySelector('#sidebar-search-input');
    const closeBtn = container.querySelector('#sidebar-close-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.classList.remove('open');
        });
    }

    /**
     * Render lesson items filtered by search text.
     * @param {string} filterText - Search filter string
     */
    const renderFilteredItems = (filterText = '') => {
        let chaptersHTML = '';
        const query = filterText.toLowerCase().trim();

        outline.chapters.forEach((chap, chapIdx) => {
            const matchingLessons = chap.lessons.filter(l =>
                l.title.toLowerCase().includes(query)
            );

            if (matchingLessons.length === 0) return;

            const completedInChapter = chap.lessons.filter(l => completedIds.includes(l.id)).length;
            const totalInChapter = chap.lessons.length;
            const isCollapsed = container._collapsedChapters.has(chapIdx);

            chaptersHTML += `
                <div class="chapter-group ${isCollapsed ? 'collapsed' : ''}" data-chapter-idx="${chapIdx}">
                    <button class="chapter-title" 
                            aria-expanded="${!isCollapsed}"
                            aria-controls="chapter-lessons-${chapIdx}"
                            data-chapter-toggle="${chapIdx}">
                        <span class="chapter-toggle-icon" aria-hidden="true">${isCollapsed ? '▶' : '▼'}</span>
                        <span>${chap.chapterName}</span>
                        <span class="chapter-progress-badge">${completedInChapter}/${totalInChapter}</span>
                    </button>
                    <ul class="lesson-list" id="chapter-lessons-${chapIdx}" role="list"
                        ${isCollapsed ? 'style="display: none;"' : ''}>
                        ${matchingLessons.map(l => {
                            const isActive = l.id === currentLessonId;
                            const isCompleted = completedIds.includes(l.id);
                            const classes = [
                                'lesson-item-btn',
                                isActive ? 'active' : '',
                                isCompleted ? 'completed' : ''
                            ].filter(Boolean).join(' ');

                            return `
                                <li role="listitem">
                                    <button class="${classes}"
                                            data-lesson-id="${l.id}"
                                            aria-label="${l.title}${isCompleted ? ' (completed)' : ''}${isActive ? ' (current)' : ''}"
                                            ${isActive ? 'aria-current="true"' : ''}>
                                        <span class="status-dot" aria-hidden="true"></span>
                                        <span class="lesson-item-title">${l.title}</span>
                                    </button>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            `;
        });

        if (!chaptersHTML) {
            outlineList.innerHTML = `
                <div class="sidebar-empty-state" role="status">No matching lessons found</div>
            `;
        } else {
            outlineList.innerHTML = chaptersHTML;
        }

        // Attach chapter toggle listeners
        outlineList.querySelectorAll('[data-chapter-toggle]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-chapter-toggle'), 10);
                const group = outlineList.querySelector(`[data-chapter-idx="${idx}"]`);
                const lessonList = outlineList.querySelector(`#chapter-lessons-${idx}`);

                if (container._collapsedChapters.has(idx)) {
                    container._collapsedChapters.delete(idx);
                    group.classList.remove('collapsed');
                    lessonList.style.display = '';
                    btn.setAttribute('aria-expanded', 'true');
                    btn.querySelector('.chapter-toggle-icon').textContent = '▼';
                } else {
                    container._collapsedChapters.add(idx);
                    group.classList.add('collapsed');
                    lessonList.style.display = 'none';
                    btn.setAttribute('aria-expanded', 'false');
                    btn.querySelector('.chapter-toggle-icon').textContent = '▶';
                }
            });
        });

        // Attach lesson click listeners
        outlineList.querySelectorAll('.lesson-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lessonId = btn.getAttribute('data-lesson-id');
                onSelectLesson(lessonId);
                container.classList.remove('open');
            });
        });

        // Auto-scroll active lesson into view
        requestAnimationFrame(() => {
            const activeBtn = outlineList.querySelector('.lesson-item-btn.active');
            if (activeBtn) {
                activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    };

    // Initial render
    renderFilteredItems();

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderFilteredItems(e.target.value);
        });
    }
}
