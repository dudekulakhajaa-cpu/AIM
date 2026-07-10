/**
 * Lesson Router Module
 * Handles hash-based client routing, parsing parameters, and dispatching loads
 */

import { loadLesson } from './lesson-loader.js';

export function initRouter(onRouteChanged) {
    const handleRoute = () => {
        const hash = window.location.hash || '#/';
        
        // Match path: #/lesson/:courseId/:lessonId
        const match = hash.match(/^#\/lesson\/([^/]+)\/([^/]+)$/);
        
        if (match) {
            const courseId = match[1];
            const lessonId = match[2];
            onRouteChanged(courseId, lessonId);
        } else if (hash === '#/' || hash === '') {
            // Default route (Modern C++ Variables lesson)
            onRouteChanged('cpp', 'variables');
        } else {
            // Unrecognized route, render 404
            onRouteChanged(null, null, true);
        }
    };

    window.addEventListener('hashchange', handleRoute);
    
    // Trigger on initial page load
    handleRoute();
}

export function navigateToLesson(courseId, lessonId) {
    window.location.hash = `#/lesson/${courseId}/${lessonId}`;
}
