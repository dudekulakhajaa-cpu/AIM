/**
 * Lesson Router Module
 * Hash-based client-side routing for the lesson engine.
 * 
 * Responsibilities: Parse URL hash, dispatch route changes.
 * This module knows nothing about lesson loading, rendering, or navigation.
 * 
 * Route pattern: #/lesson/:courseId/:lessonId
 * Default route:  #/ (redirects to cpp/variables)
 * 
 * @module lesson-router
 */

/**
 * Initialize the hash-based router.
 * 
 * @param {Function} onRouteChanged - Callback invoked with (courseId, lessonId, is404)
 */
export function initRouter(onRouteChanged) {
    const handleRoute = () => {
        const hash = window.location.hash || '#/';

        // Match pattern: #/lesson/:courseId/:lessonId
        const match = hash.match(/^#\/lesson\/([^/]+)\/([^/]+)$/);

        if (match) {
            const courseId = match[1];
            const lessonId = match[2];
            onRouteChanged(courseId, lessonId);
        } else if (hash === '#/' || hash === '') {
            // Default route — load the first lesson
            onRouteChanged('cpp', 'variables');
        } else {
            // Unrecognized route — signal 404
            onRouteChanged(null, null, true);
        }
    };

    window.addEventListener('hashchange', handleRoute);

    // Trigger on initial page load
    handleRoute();
}

/**
 * Programmatically navigate to a specific lesson.
 * 
 * @param {string} courseId - The course identifier
 * @param {string} lessonId - The lesson identifier
 */
export function navigateToLesson(courseId, lessonId) {
    window.location.hash = `#/lesson/${courseId}/${lessonId}`;
}
