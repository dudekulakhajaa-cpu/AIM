/**
 * Lesson Header Component
 * Renders lesson metadata (title, difficulty, duration, course progress)
 * and action buttons (bookmark, share).
 * 
 * @module lesson-header
 */

/** Map difficulty level to CSS badge class */
const DIFFICULTY_BADGE_CLASS = {
    'Beginner': 'badge-difficulty-beginner',
    'Intermediate': 'badge-difficulty-intermediate',
    'Advanced': 'badge-difficulty-advanced'
};

/**
 * Render the lesson header card.
 * 
 * @param {HTMLElement} container - The header DOM element
 * @param {Object} lessonData - The lesson content object
 * @param {{ completed: number, total: number, percentage: number }} courseProgress - Progress stats
 * @param {boolean} isBookmarked - Whether this lesson is currently bookmarked
 * @param {Function} onToggleBookmark - Callback invoked with (lessonId)
 * @param {Function} onShare - Callback invoked with (lessonId)
 */
export function renderLessonHeader(container, lessonData, courseProgress, isBookmarked, onToggleBookmark, onShare) {
    if (!container) return;

    const diffClass = DIFFICULTY_BADGE_CLASS[lessonData.difficulty] || 'badge-difficulty-beginner';

    container.innerHTML = `
        <div class="lesson-header-top">
            <div>
                <span class="course-context">${lessonData.course} &bull; ${lessonData.chapter}</span>
                <h1 class="lesson-title-heading">${lessonData.title}</h1>
            </div>
            <div class="header-actions">
                <button class="btn-icon ${isBookmarked ? 'active' : ''}" id="btn-bookmark"
                        type="button"
                        title="${isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}"
                        aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}"
                        aria-pressed="${isBookmarked}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
                <button class="btn-icon" id="btn-share"
                        type="button"
                        title="Copy share link"
                        aria-label="Copy lesson share link to clipboard">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                    </svg>
                </button>
            </div>
        </div>
        ${lessonData.description ? `<p class="lesson-description">${lessonData.description}</p>` : ''}
        <div class="lesson-meta-bar">
            <div class="meta-item">
                <span class="meta-badge ${diffClass}">${lessonData.difficulty}</span>
            </div>
            <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>${lessonData.duration} mins</span>
            </div>
            <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Course: ${courseProgress.completed}/${courseProgress.total} (${courseProgress.percentage}%)</span>
            </div>
        </div>
    `;

    // Event handlers
    const bookmarkBtn = container.querySelector('#btn-bookmark');
    const shareBtn = container.querySelector('#btn-share');

    if (bookmarkBtn && onToggleBookmark) {
        const handleBookmark = () => onToggleBookmark(lessonData.id);
        bookmarkBtn.addEventListener('click', handleBookmark);
        bookmarkBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBookmark();
            }
        });
    }

    if (shareBtn) {
        const handleShare = () => {
            if (onShare) {
                onShare(lessonData.id);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Share link copied to clipboard!');
            }
        };
        shareBtn.addEventListener('click', handleShare);
        shareBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleShare();
            }
        });
    }
}
