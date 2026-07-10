/**
 * Lesson Navigation Module
 * Renders Previous/Next navigation buttons and manages scroll reading progress.
 * 
 * Receives pre-computed navigation data from course-manager —
 * does not compute lesson ordering itself.
 * 
 * @module lesson-navigation
 */

/**
 * Render the Previous/Next lesson navigation footer.
 * 
 * @param {Object} navigation - Pre-computed navigation from course-manager.computeNavigation()
 * @param {Object|null} navigation.prev - Previous lesson `{ id, title, courseId }` or null
 * @param {Object|null} navigation.next - Next lesson `{ id, title, courseId }` or null
 * @param {Function} onNavigate - Callback invoked with (courseId, lessonId)
 */
export function setupLessonNavigation(navigation, onNavigate) {
    const navContainer = document.getElementById('navigation-footer');
    if (!navContainer) return;

    const { prev, next } = navigation;

    navContainer.innerHTML = `
        <button class="nav-link-btn btn-prev ${!prev ? 'disabled' : ''}"
                id="nav-btn-prev"
                ${!prev ? 'disabled' : ''}
                aria-label="${prev ? `Go to previous lesson: ${prev.title}` : 'No previous lesson'}">
            <span class="nav-btn-lbl">← Previous Lesson</span>
            <span class="nav-btn-title">${prev ? prev.title : 'First Lesson'}</span>
        </button>
        <button class="nav-link-btn btn-next ${!next ? 'disabled' : ''}"
                id="nav-btn-next"
                ${!next ? 'disabled' : ''}
                aria-label="${next ? `Go to next lesson: ${next.title}` : 'No next lesson'}">
            <span class="nav-btn-lbl">Next Lesson →</span>
            <span class="nav-btn-title">${next ? next.title : 'End of Course'}</span>
        </button>
    `;

    const prevBtn = navContainer.querySelector('#nav-btn-prev');
    const nextBtn = navContainer.querySelector('#nav-btn-next');

    if (prevBtn && prev) {
        prevBtn.addEventListener('click', () => {
            onNavigate(prev.courseId, prev.id);
        });
    }

    if (nextBtn && next) {
        nextBtn.addEventListener('click', () => {
            onNavigate(next.courseId, next.id);
        });
    }
}

/**
 * Initialize the scroll-based reading progress bar.
 * Attaches a single scroll listener that updates the progress fill width.
 */
export function initScrollProgress() {
    const progressFill = document.getElementById('scroll-progress-fill');
    if (!progressFill) return;

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressFill.style.width = `${scrollPct}%`;
    };

    // Remove previous listener to prevent duplicates on re-render
    window.removeEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // Initial calculation
    updateScrollProgress();
}
