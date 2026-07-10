/**
 * Lesson Renderer Module
 * Orchestrates DOM creation and component binding for a lesson page.
 * Uses course-manager for data computation, delegates rendering to components.
 * 
 * @module lesson-renderer
 */

import { renderSidebar } from '../components/sidebar.js';
import { renderBreadcrumbs } from '../components/breadcrumb.js';
import { renderLessonHeader } from '../components/lesson-header.js';
import { renderLessonFooter } from '../components/lesson-footer.js';
import { computeCourseProgress, computeNavigation, findChapterForLesson, flattenLessons } from './course-manager.js';
import { setupLessonNavigation } from './lesson-navigation.js';

/**
 * Render the complete lesson page: sidebar, breadcrumbs, header,
 * objectives, content sections, navigation footer, and completion footer.
 * 
 * @param {Object} domElements - Cached DOM element references
 * @param {Object} data - `{ outline, lessonData }` from lesson-loader
 * @param {Object} progressState - `{ completedIds, bookmarkIds }` from lesson-loader
 * @param {Object} handlers - Event handler callbacks
 */
export function renderLessonPage(domElements, data, progressState, handlers) {
    const { outline, lessonData } = data;
    const { completedIds, bookmarkIds } = progressState;
    const { onSelectLesson, onToggleBookmark, onToggleComplete, onShare, onNavigateHome } = handlers;

    // 1. Compute course progress using course-manager
    const courseProgress = computeCourseProgress(outline, completedIds);

    // 2. Render Sidebar Navigation
    renderSidebar(
        domElements.sidebar,
        outline,
        lessonData.id,
        completedIds,
        onSelectLesson
    );

    // 3. Render Breadcrumbs with course link support
    const chapter = findChapterForLesson(outline, lessonData.id);
    const allLessons = flattenLessons(outline);
    const firstLessonId = allLessons.length > 0 ? allLessons[0].id : null;

    renderBreadcrumbs(
        domElements.breadcrumbs,
        lessonData.course,
        chapter ? chapter.chapterName : lessonData.chapter,
        lessonData.title,
        onNavigateHome,
        { courseId: outline.courseId, firstLessonId }
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

    // 5. Render Objectives
    if (lessonData.learningObjectives && lessonData.learningObjectives.length > 0) {
        domElements.objectives.classList.remove('hidden');
        domElements.objectives.innerHTML = `
            <div class="objectives-title">Learning Objectives</div>
            <ul class="objectives-list" role="list">
                ${lessonData.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
        `;
    } else {
        domElements.objectives.classList.add('hidden');
        domElements.objectives.innerHTML = '';
    }

    // 6. Render Dynamic Lesson Content Sections
    if (lessonData.sections && lessonData.sections.length > 0) {
        domElements.content.innerHTML = lessonData.sections.map((sec, idx) => {
            const sectionTypeClass = getSectionTypeClass(sec.type);
            const bodyHTML = renderSectionBody(sec);

            return `
                <div class="lesson-section ${sectionTypeClass}" id="section-${idx}">
                    <h3 class="lesson-section-title">${sec.title}</h3>
                    <div class="lesson-section-body">${bodyHTML}</div>
                </div>
            `;
        }).join('');
    } else {
        domElements.content.innerHTML = `
            <div class="lesson-empty-state" role="status">
                No sections have been defined for this lesson yet. Check back soon!
            </div>
        `;
    }

    // 7. Setup Previous/Next Navigation (using pre-computed data)
    const navigation = computeNavigation(outline, lessonData.id);
    setupLessonNavigation(navigation, handlers.onSelectLesson
        ? (courseId, lessonId) => {
            // Use the navigateToLesson from the router via the parent orchestrator
            window.location.hash = `#/lesson/${courseId}/${lessonId}`;
        }
        : () => {}
    );

    // 8. Render Lesson Footer
    const isCompleted = completedIds.includes(lessonData.id);
    renderLessonFooter(
        domElements.footer,
        lessonData.id,
        isCompleted,
        onToggleComplete
    );
}

/**
 * Map section type to a CSS modifier class.
 * @private
 * @param {string} type - Section type
 * @returns {string} CSS class name
 */
function getSectionTypeClass(type) {
    const classMap = {
        'theory': 'section-theory',
        'example': 'section-example',
        'note': 'section-note',
        'warning': 'section-warning',
        'tip': 'section-tip'
    };
    return classMap[type] || '';
}

/**
 * Render the body content of a lesson section.
 * Handles markdown-style code fences within content.
 * @private
 * @param {Object} section - The section object `{ type, title, content }`
 * @returns {string} HTML string for the section body
 */
function renderSectionBody(section) {
    const content = section.content || '';

    // Handle sections with code fences
    if (content.includes('```')) {
        return parseContentWithCodeBlocks(content);
    }

    // Plain text sections — convert newlines to <br>
    if (section.type === 'note') {
        return `<div class="callout callout-note"><p>${content.replace(/\n/g, '<br>')}</p></div>`;
    }
    if (section.type === 'warning') {
        return `<div class="callout callout-warning"><p>${content.replace(/\n/g, '<br>')}</p></div>`;
    }
    if (section.type === 'tip') {
        return `<div class="callout callout-tip"><p>${content.replace(/\n/g, '<br>')}</p></div>`;
    }

    return `<p>${content.replace(/\n/g, '<br>')}</p>`;
}

/**
 * Parse content containing markdown-style code fences (```).
 * Supports multiple code blocks per section.
 * @private
 * @param {string} content - Raw content string
 * @returns {string} HTML string with code blocks properly rendered
 */
function parseContentWithCodeBlocks(content) {
    const parts = content.split('```');
    let html = '';

    parts.forEach((part, index) => {
        if (index % 2 === 0) {
            // Text segment
            const trimmed = part.trim();
            if (trimmed) {
                html += `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
            }
        } else {
            // Code block — strip optional language identifier from first line
            const codeContent = part.replace(/^[a-zA-Z+]+\n/, '');
            html += `<pre><code>${escapeHTML(codeContent.trim())}</code></pre>`;
        }
    });

    return html;
}

/**
 * Escape HTML special characters to prevent XSS.
 * @private
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
