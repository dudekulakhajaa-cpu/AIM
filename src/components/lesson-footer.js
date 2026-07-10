/**
 * Lesson Footer Component
 * Renders the lesson completion checkpoint and copyright notice.
 * Uses CSS classes instead of inline styles.
 * 
 * @module lesson-footer
 */

/**
 * Render the lesson footer with completion toggle and copyright.
 * 
 * @param {HTMLElement} container - The footer DOM element
 * @param {string} lessonId - The current lesson ID
 * @param {boolean} isCompleted - Whether the lesson is marked as completed
 * @param {Function} onToggleComplete - Callback invoked with (lessonId)
 */
export function renderLessonFooter(container, lessonId, isCompleted, onToggleComplete) {
    if (!container) return;

    container.innerHTML = `
        <div class="lesson-footer-box">
            <div class="lesson-footer-prompt">
                <h4 class="lesson-footer-title">Finished this unit?</h4>
                <p class="lesson-footer-desc">Mark it as completed to track your overall progress statistics.</p>
            </div>
            <button class="btn-primary lesson-complete-btn ${isCompleted ? 'completed' : ''}"
                    id="btn-complete-lesson"
                    type="button"
                    aria-label="${isCompleted ? 'Mark lesson as incomplete' : 'Mark lesson as completed'}"
                    aria-pressed="${isCompleted}">
                ${isCompleted ? '✓ Completed' : 'Mark as Completed'}
            </button>
        </div>
        <div class="lesson-copyright">
            <p>&copy; 2026 AIM Gamedev Platform &bull; Developed by Khaja. All rights reserved.</p>
        </div>
    `;

    const completeBtn = container.querySelector('#btn-complete-lesson');

    if (completeBtn && onToggleComplete) {
        completeBtn.addEventListener('click', () => {
            onToggleComplete(lessonId);
        });
        completeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleComplete(lessonId);
            }
        });
    }
}
