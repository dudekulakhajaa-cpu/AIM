/**
 * Lesson Footer Component
 * Renders lesson completion checkpoint and copyright details
 */

export function renderLessonFooter(container, lessonId, isCompleted, onToggleComplete) {
    if (!container) return;

    container.innerHTML = `
        <div class="lesson-completion-box" style="margin-top: 40px; padding: 24px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--border-radius); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
                <h4 style="font-weight: 700; margin-bottom: 4px;">Finished this unit?</h4>
                <p style="color: var(--color-text-secondary); font-size: 13px;">Mark it as completed to track your overall progress statistics.</p>
            </div>
            <button class="btn-primary" id="btn-complete-lesson" style="background: ${isCompleted ? 'var(--color-success)' : 'var(--neon-cyan)'}; border-color: ${isCompleted ? 'var(--color-success)' : 'var(--neon-cyan)'}; color: var(--bg-dark);">
                ${isCompleted ? '✓ Completed' : 'Mark as Completed'}
            </button>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: var(--color-text-muted); border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
            <p>&copy; 2026 AIM Gamedev Platform &bull; Developed by Khaja. All rights reserved.</p>
        </div>
    `;

    const completeBtn = container.querySelector("#btn-complete-lesson");

    if (completeBtn) {
        completeBtn.addEventListener("click", () => {
            if (onToggleComplete) {
                onToggleComplete(lessonId);
            }
        });
    }
}
