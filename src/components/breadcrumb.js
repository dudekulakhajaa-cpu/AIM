/**
 * Breadcrumb Component
 * Renders semantic breadcrumb navigation (Home > Course > Chapter > Lesson).
 * Uses an accessible <nav> with <ol> structure per WAI-ARIA breadcrumb pattern.
 * 
 * @module breadcrumb
 */

/**
 * Render breadcrumb navigation into the given container.
 * 
 * @param {HTMLElement} container - The DOM element to render into
 * @param {string} courseName - Display name of the course
 * @param {string} chapterName - Display name of the chapter
 * @param {string} lessonTitle - Display name of the current lesson
 * @param {Function} onNavigateHome - Callback for the Home breadcrumb click
 * @param {Object} [options] - Additional options
 * @param {string} [options.courseId] - Course ID for the course breadcrumb link
 * @param {string} [options.firstLessonId] - First lesson ID in the course (for course link)
 */
export function renderBreadcrumbs(container, courseName, chapterName, lessonTitle, onNavigateHome, options = {}) {
    if (!container) return;

    container.setAttribute('aria-label', 'Breadcrumb');

    container.innerHTML = `
        <ol class="breadcrumb-list" role="list">
            <li class="breadcrumb-item">
                <button class="breadcrumb-link" id="breadcrumb-home" type="button"
                        aria-label="Go to dashboard">Home</button>
                <span class="breadcrumb-separator" aria-hidden="true">›</span>
            </li>
            <li class="breadcrumb-item">
                <button class="breadcrumb-link" id="breadcrumb-course" type="button"
                        aria-label="Go to ${courseName} course">${courseName}</button>
                <span class="breadcrumb-separator" aria-hidden="true">›</span>
            </li>
            <li class="breadcrumb-item">
                <span class="breadcrumb-static">${chapterName}</span>
                <span class="breadcrumb-separator" aria-hidden="true">›</span>
            </li>
            <li class="breadcrumb-item" aria-current="page">
                <span class="breadcrumb-current">${lessonTitle}</span>
            </li>
        </ol>
    `;

    const homeBtn = container.querySelector('#breadcrumb-home');
    const courseBtn = container.querySelector('#breadcrumb-course');

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            if (onNavigateHome) {
                onNavigateHome();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    if (courseBtn && options.courseId && options.firstLessonId) {
        courseBtn.addEventListener('click', () => {
            window.location.hash = `#/lesson/${options.courseId}/${options.firstLessonId}`;
        });
    } else if (courseBtn) {
        // Fallback: navigate home if no course route available
        courseBtn.addEventListener('click', () => {
            if (onNavigateHome) {
                onNavigateHome();
            } else {
                window.location.href = 'index.html';
            }
        });
    }
}
