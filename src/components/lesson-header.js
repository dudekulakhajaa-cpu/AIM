/**
 * Lesson Header Component
 * Renders metadata and actions (Estimated Time, Difficulty, Bookmarks, Share, etc.)
 */

export function renderLessonHeader(container, lessonData, courseProgress, isBookmarked, onToggleBookmark, onShare) {
    if (!container) return;

    const diffClass = `badge-difficulty-${lessonData.difficulty.toLowerCase()}`;
    const pct = courseProgress.total > 0 ? Math.round((courseProgress.completed / courseProgress.total) * 100) : 0;

    container.innerHTML = `
        <div class="lesson-header-top">
            <div>
                <span class="course-context">${lessonData.course} &bull; ${lessonData.chapter}</span>
                <h1 class="lesson-title-heading">${lessonData.title}</h1>
            </div>
            <div class="header-actions">
                <button class="btn-icon ${isBookmarked ? 'active' : ''}" id="btn-bookmark" title="Bookmark lesson">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </button>
                <button class="btn-icon" id="btn-share" title="Copy share link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                    </svg>
                </button>
            </div>
        </div>
        <p style="color: var(--color-text-secondary); font-size: 14px; margin-bottom: 20px;">${lessonData.description || ''}</p>
        <div class="lesson-meta-bar">
            <div class="meta-item">
                <span class="meta-badge ${diffClass}">${lessonData.difficulty}</span>
            </div>
            <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>${lessonData.duration} mins</span>
            </div>
            <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Course Progress: ${courseProgress.completed}/${courseProgress.total} Lessons (${pct}%)</span>
            </div>
        </div>
    `;

    const bookmarkBtn = container.querySelector("#btn-bookmark");
    const shareBtn = container.querySelector("#btn-share");

    if (bookmarkBtn) {
        bookmarkBtn.addEventListener("click", () => {
            if (onToggleBookmark) {
                onToggleBookmark(lessonData.id);
            }
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            if (onShare) {
                onShare(lessonData.id);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Share link copied to clipboard!");
            }
        });
    }
}
