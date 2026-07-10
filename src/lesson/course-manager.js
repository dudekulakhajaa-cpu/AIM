/**
 * Course Manager Module
 * Single source of truth for all course outline data, navigation,
 * progress computation, and lesson resolution.
 * 
 * No DOM manipulation — this is a pure data layer.
 * 
 * @module course-manager
 */

import { COURSE_BASE_PATH } from './constants.js';
import { validateOutlineSchema } from './schema-validator.js';

/** In-memory cache for fetched course outlines, keyed by courseId */
const outlineCache = new Map();

/**
 * Load and cache a course outline from the server.
 * Returns the cached version if already loaded.
 * 
 * @param {string} courseId - The course identifier (e.g. "cpp", "math")
 * @returns {Promise<Object>} The validated outline object
 * @throws {Error} If fetch fails or outline schema is invalid
 */
export async function loadCourseOutline(courseId) {
    // Return from cache if available
    if (outlineCache.has(courseId)) {
        return outlineCache.get(courseId);
    }

    const url = `${COURSE_BASE_PATH}/${courseId}/outline.json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Course outline not found: "${courseId}" (HTTP ${response.status})`);
    }

    let outline;
    try {
        outline = await response.json();
    } catch (parseError) {
        throw new Error(`Course outline "${courseId}" contains invalid JSON: ${parseError.message}`);
    }

    // Validate outline schema
    const validation = validateOutlineSchema(outline);
    if (!validation.valid) {
        const detail = validation.errors.join('\n• ');
        throw new Error(`Course outline "${courseId}" has schema errors:\n• ${detail}`);
    }

    outlineCache.set(courseId, outline);
    return outline;
}

/**
 * Find a lesson entry inside an outline by its ID.
 * Searches all chapters sequentially.
 * 
 * @param {Object} outline - The course outline object
 * @param {string} lessonId - The lesson identifier to find
 * @returns {Object|null} The lesson entry `{ id, title, file }` or null if not found
 */
export function resolveLessonInOutline(outline, lessonId) {
    for (const chapter of outline.chapters) {
        const lesson = chapter.lessons.find(l => l.id === lessonId);
        if (lesson) {
            return lesson;
        }
    }
    return null;
}

/**
 * Find the chapter that contains a given lesson ID.
 * 
 * @param {Object} outline - The course outline object
 * @param {string} lessonId - The lesson identifier to find
 * @returns {Object|null} The chapter object or null
 */
export function findChapterForLesson(outline, lessonId) {
    for (const chapter of outline.chapters) {
        if (chapter.lessons.some(l => l.id === lessonId)) {
            return chapter;
        }
    }
    return null;
}

/**
 * Construct the file path for a lesson content JSON file.
 * 
 * @param {string} courseId - The course identifier
 * @param {Object} lessonEntry - The outline lesson entry `{ id, title, file }`
 * @returns {string} The relative file path
 */
export function getLessonFilePath(courseId, lessonEntry) {
    return `${COURSE_BASE_PATH}/${courseId}/${lessonEntry.file}`;
}

/**
 * Flatten all lessons across all chapters into a single ordered array.
 * Each entry includes `{ id, title, file, chapterName, courseId }`.
 * 
 * @param {Object} outline - The course outline object
 * @returns {Array<Object>} Ordered array of lesson descriptors
 */
export function flattenLessons(outline) {
    const lessons = [];
    for (const chapter of outline.chapters) {
        for (const lesson of chapter.lessons) {
            lessons.push({
                id: lesson.id,
                title: lesson.title,
                file: lesson.file,
                chapterName: chapter.chapterName,
                courseId: outline.courseId
            });
        }
    }
    return lessons;
}

/**
 * Compute Previous/Next navigation for a given lesson within a course.
 * 
 * @param {Object} outline - The course outline object
 * @param {string} currentLessonId - The current lesson's ID
 * @returns {{ prev: Object|null, next: Object|null, currentIndex: number, totalLessons: number }}
 */
export function computeNavigation(outline, currentLessonId) {
    const allLessons = flattenLessons(outline);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);

    return {
        prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
        next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
        currentIndex,
        totalLessons: allLessons.length
    };
}

/**
 * Compute course completion progress based on completed lesson IDs.
 * 
 * @param {Object} outline - The course outline object
 * @param {string[]} completedIds - Array of completed lesson IDs
 * @returns {{ completed: number, total: number, percentage: number }}
 */
export function computeCourseProgress(outline, completedIds) {
    const allLessons = flattenLessons(outline);
    const total = allLessons.length;
    const completed = allLessons.filter(l => completedIds.includes(l.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
}

/**
 * Generate breadcrumb trail data for a lesson.
 * Returns pure data — no DOM elements.
 * 
 * @param {string} courseName - Display name of the course
 * @param {string} chapterName - Display name of the chapter
 * @param {string} lessonTitle - Display name of the lesson
 * @returns {Array<{ label: string, type: string }>} Breadcrumb segments
 */
export function generateBreadcrumbTrail(courseName, chapterName, lessonTitle) {
    return [
        { label: 'Home', type: 'link' },
        { label: courseName, type: 'link' },
        { label: chapterName, type: 'static' },
        { label: lessonTitle, type: 'current' }
    ];
}

/**
 * Clear the outline cache. Useful for testing or forced refresh.
 */
export function clearOutlineCache() {
    outlineCache.clear();
}
