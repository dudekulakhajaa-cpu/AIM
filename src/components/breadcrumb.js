/**
 * Breadcrumb Component
 * Renders page breadcrumbs (e.g. Home > C++ > Memory > Pointers)
 */

export function renderBreadcrumbs(container, courseName, chapterName, lessonTitle, onNavigateHome) {
    if (!container) return;

    container.innerHTML = `
        <span class="breadcrumb-link" id="breadcrumb-home">Home</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-link" id="breadcrumb-course">${courseName}</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-link" id="breadcrumb-chapter" style="pointer-events: none;">${chapterName}</span>
        <span class="breadcrumb-separator">></span>
        <span style="color: var(--color-text-primary); font-weight: 600;">${lessonTitle}</span>
    `;

    const homeBtn = container.querySelector("#breadcrumb-home");
    const courseBtn = container.querySelector("#breadcrumb-course");

    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            if (onNavigateHome) onNavigateHome();
            else window.location.href = "index.html"; // Fallback to dashboard
        });
    }

    if (courseBtn) {
        courseBtn.addEventListener("click", () => {
            // Can reload first lesson or dynamic overview
        });
    }
}
