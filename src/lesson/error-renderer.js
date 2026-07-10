/**
 * Error Renderer Module
 * Renders professional, styled error pages for the lesson engine.
 * All error types get consistent treatment with icons, explanations, and actions.
 * 
 * @module error-renderer
 */

import { ERROR_CODES } from './constants.js';

/**
 * Error page configuration for each error type.
 * @private
 */
const ERROR_CONFIG = {
    [ERROR_CODES.NOT_FOUND]: {
        icon: '🔍',
        title: 'Lesson Not Found',
        description: 'The requested lesson does not exist in this course. It may have been moved or removed.',
        showDiagnostics: false
    },
    [ERROR_CODES.COURSE_MISSING]: {
        icon: '📁',
        title: 'Course Not Found',
        description: 'The requested course could not be located. Verify the URL or return to the dashboard.',
        showDiagnostics: false
    },
    [ERROR_CODES.INVALID_JSON]: {
        icon: '⚠️',
        title: 'Data Corruption Detected',
        description: 'The lesson data file contains malformed JSON and could not be parsed.',
        showDiagnostics: true
    },
    [ERROR_CODES.SCHEMA_INVALID]: {
        icon: '🔧',
        title: 'Invalid Lesson Structure',
        description: 'The lesson data file is missing required fields or contains invalid values.',
        showDiagnostics: true
    },
    [ERROR_CODES.LOAD_FAILURE]: {
        icon: '📡',
        title: 'Connection Lost',
        description: 'Failed to retrieve lesson data from the server. Check your connection and try again.',
        showDiagnostics: false
    }
};

/**
 * Render a professional error page into a container element.
 * 
 * @param {HTMLElement} container - The DOM element to render the error into
 * @param {string} errorCode - One of the ERROR_CODES values
 * @param {Object} [options] - Additional options
 * @param {string} [options.details] - Technical diagnostic details (e.g. validation errors)
 * @param {string} [options.courseId] - Course ID that caused the error
 * @param {string} [options.lessonId] - Lesson ID that caused the error
 */
export function renderErrorPage(container, errorCode, options = {}) {
    const config = ERROR_CONFIG[errorCode] || ERROR_CONFIG[ERROR_CODES.LOAD_FAILURE];
    const { details, courseId, lessonId } = options;

    const diagnosticsHTML = config.showDiagnostics && details
        ? `<details class="error-diagnostics">
               <summary>Technical Details</summary>
               <pre class="error-diagnostics-content">${escapeHTML(details)}</pre>
           </details>`
        : '';

    const contextHTML = (courseId || lessonId)
        ? `<div class="error-context">
               ${courseId ? `<span class="error-context-item">Course: <code>${escapeHTML(courseId)}</code></span>` : ''}
               ${lessonId ? `<span class="error-context-item">Lesson: <code>${escapeHTML(lessonId)}</code></span>` : ''}
           </div>`
        : '';

    container.innerHTML = `
        <div class="error-page" role="alert" aria-live="polite">
            <div class="error-icon">${config.icon}</div>
            <h2 class="error-title">${config.title}</h2>
            <p class="error-description">${config.description}</p>
            ${contextHTML}
            ${diagnosticsHTML}
            <div class="error-actions">
                <a href="index.html" class="btn-primary error-btn" aria-label="Return to dashboard">
                    Return to Dashboard
                </a>
                <a href="index.html" class="btn-secondary error-btn" aria-label="Browse all courses"
                   onclick="localStorage.setItem('AIM_GAMEDEV_ACTIVE_TAB', 'curriculum')">
                    Browse Courses
                </a>
            </div>
        </div>
    `;
}

/**
 * Render a loading state into a container element.
 * 
 * @param {HTMLElement} container - The DOM element to render into
 */
export function renderLoadingState(container) {
    container.innerHTML = `
        <div class="error-page" role="status" aria-live="polite" aria-label="Loading lesson content">
            <div class="loading-spinner" aria-hidden="true"></div>
            <h2 class="error-title" style="font-size: 18px;">Loading Lesson...</h2>
            <p class="error-description">Retrieving content from the data core.</p>
        </div>
    `;
}

/**
 * Escape HTML special characters to prevent XSS in error messages.
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
