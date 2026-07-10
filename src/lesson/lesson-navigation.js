/**
 * Lesson Navigation Module
 * Resolves previous/next lesson references and manages scroll progress tracking
 */

export function setupLessonNavigation(outline, currentLessonId, onNavigate) {
    // 1. Flatten all lessons from chapters to find sequence ordering
    const flatLessons = [];
    outline.chapters.forEach(chap => {
        chap.lessons.forEach(l => {
            flatLessons.push({
                id: l.id,
                title: l.title,
                courseId: outline.courseId
            });
        });
    });

    const currentIndex = flatLessons.findIndex(l => l.id === currentLessonId);
    const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

    const navContainer = document.getElementById("navigation-footer");
    if (!navContainer) return;

    navContainer.innerHTML = `
        <button class="nav-link-btn btn-prev ${!prevLesson ? 'disabled' : ''}" id="nav-btn-prev">
            <span class="nav-btn-lbl">← Previous Lesson</span>
            <span class="nav-btn-title">${prevLesson ? prevLesson.title : 'First Lesson'}</span>
        </button>
        <button class="nav-link-btn btn-next ${!nextLesson ? 'disabled' : ''}" id="nav-btn-next">
            <span class="nav-btn-lbl">Next Lesson →</span>
            <span class="nav-btn-title">${nextLesson ? nextLesson.title : 'End of Course'}</span>
        </button>
    `;

    const prevBtn = navContainer.querySelector("#nav-btn-prev");
    const nextBtn = navContainer.querySelector("#nav-btn-next");

    if (prevBtn && prevLesson) {
        prevBtn.addEventListener("click", () => {
            onNavigate(prevLesson.courseId, prevLesson.id);
        });
    }

    if (nextBtn && nextLesson) {
        nextBtn.addEventListener("click", () => {
            onNavigate(nextLesson.courseId, nextLesson.id);
        });
    }
}

export function initScrollProgress() {
    const progressFill = document.getElementById("scroll-progress-fill");
    if (!progressFill) return;

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressFill.style.width = `${scrollPct}%`;
    };

    window.removeEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial call
    updateScrollProgress();
}
