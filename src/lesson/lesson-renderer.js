/**
 * Lesson Renderer Module
 * Orchestrates DOM creation and component binding
 */

import { renderSidebar } from '../components/sidebar.js';
import { renderBreadcrumbs } from '../components/breadcrumb.js';
import { renderLessonHeader } from '../components/lesson-header.js';
import { renderLessonFooter } from '../components/lesson-footer.js';

export function renderLessonPage(domElements, data, progressState, handlers) {
    const { outline, lessonData } = data;
    const { completedIds, bookmarkIds } = progressState;
    const { onSelectLesson, onToggleBookmark, onToggleComplete, onShare, onNavigateHome } = handlers;

    // 1. Calculate course progress statistics
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;
    outline.chapters.forEach(chap => {
        chap.lessons.forEach(l => {
            totalLessonsCount++;
            if (completedIds.includes(l.id)) {
                completedLessonsCount++;
            }
        });
    });

    const courseProgress = {
        completed: completedLessonsCount,
        total: totalLessonsCount
    };

    // 2. Render Sidebar Navigation
    renderSidebar(
        domElements.sidebar,
        outline,
        lessonData.id,
        completedIds,
        onSelectLesson
    );

    // 3. Render Breadcrumbs
    renderBreadcrumbs(
        domElements.breadcrumbs,
        lessonData.course,
        lessonData.chapter,
        lessonData.title,
        onNavigateHome
    );

    // 4. Render Lesson Header
    const isBookmarked = bookmarkIds.includes(lessonData.id);
    renderLessonHeader(
        domElements.header,
        lessonData,
        courseProgress,
        isBookmarked,
        onToggleBookmark,
        onShare
    );

    // 5. Render Objectives Box
    if (lessonData.learningObjectives && lessonData.learningObjectives.length > 0) {
        domElements.objectives.classList.remove("hidden");
        domElements.objectives.innerHTML = `
            <div class="objectives-title">Learning Objectives</div>
            <ul class="objectives-list">
                ${lessonData.learningObjectives.map(obj => `<li>${obj}</li>`).join("")}
            </ul>
        `;
    } else {
        domElements.objectives.classList.add("hidden");
        domElements.objectives.innerHTML = "";
    }

    // 6. Render Dynamic Lesson Content Sections
    if (lessonData.sections && lessonData.sections.length > 0) {
        domElements.content.innerHTML = lessonData.sections.map(sec => {
            let bodyHTML = "";
            if (sec.type === "theory") {
                bodyHTML = `<p>${sec.content.replace(/\n/g, "<br>")}</p>`;
            } else if (sec.type === "example") {
                // If contains markdown-style code fence, extract it
                if (sec.content.includes("```")) {
                    const parts = sec.content.split("```");
                    const textBefore = parts[0] ? `<p>${parts[0].replace(/\n/g, "<br>")}</p>` : "";
                    const codeBlock = parts[1] ? parts[1].replace(/^[a-zA-Z]+\n/, "") : "";
                    bodyHTML = `
                        ${textBefore}
                        <pre><code>${escapeHTML(codeBlock.trim())}</code></pre>
                    `;
                } else {
                    bodyHTML = `<p>${sec.content.replace(/\n/g, "<br>")}</p>`;
                }
            } else {
                bodyHTML = `<p>${sec.content}</p>`;
            }

            return `
                <div class="lesson-section">
                    <h3 class="lesson-section-title">${sec.title}</h3>
                    <div class="lesson-section-body">${bodyHTML}</div>
                </div>
            `;
        }).join("");
    } else {
        domElements.content.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-text-muted);">No sections have been defined for this lesson yet. Check back soon!</div>`;
    }

    // 7. Render Lesson Footer
    const isCompleted = completedIds.includes(lessonData.id);
    renderLessonFooter(
        domElements.footer,
        lessonData.id,
        isCompleted,
        onToggleComplete
    );
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
