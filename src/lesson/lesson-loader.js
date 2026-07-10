/**
 * Lesson Loader Module
 * Loads lesson content JSON, manages progress persistence, and
 * synchronizes state between localStorage and the local database API.
 * 
 * Delegates outline management to course-manager.js.
 * Delegates validation to schema-validator.js.
 * 
 * @module lesson-loader
 */

import { loadCourseOutline, resolveLessonInOutline, getLessonFilePath } from './course-manager.js';
import { validateLessonSchema } from './schema-validator.js';
import { STORAGE_KEYS, API_ENDPOINTS, ERROR_CODES } from './constants.js';

/**
 * Load a complete lesson: fetches the outline, resolves the lesson entry,
 * fetches the lesson content JSON, and validates its schema.
 * 
 * @param {string} courseId - The course identifier (e.g. "cpp", "math")
 * @param {string} lessonId - The lesson identifier (e.g. "variables", "pointers")
 * @returns {Promise<{ outline: Object, lessonData: Object }>} Resolved lesson data
 * @throws {{ code: string, message: string, details?: string }} Structured error with code
 */
export async function loadLesson(courseId, lessonId) {
    // 1. Load and validate the course outline
    let outline;
    try {
        outline = await loadCourseOutline(courseId);
    } catch (err) {
        throw {
            code: ERROR_CODES.COURSE_MISSING,
            message: `Course "${courseId}" could not be loaded.`,
            details: err.message
        };
    }

    // 2. Resolve lesson entry from outline (single source of truth for IDs)
    const lessonEntry = resolveLessonInOutline(outline, lessonId);
    if (!lessonEntry) {
        throw {
            code: ERROR_CODES.NOT_FOUND,
            message: `Lesson "${lessonId}" not found in course "${courseId}".`,
            details: `Available lessons: ${outline.chapters.flatMap(c => c.lessons.map(l => l.id)).join(', ')}`
        };
    }

    // 3. Fetch the lesson content JSON
    const filePath = getLessonFilePath(courseId, lessonEntry);
    let response;
    try {
        response = await fetch(filePath);
    } catch (fetchErr) {
        throw {
            code: ERROR_CODES.LOAD_FAILURE,
            message: `Network error loading lesson file: ${filePath}`,
            details: fetchErr.message
        };
    }

    if (!response.ok) {
        throw {
            code: ERROR_CODES.LOAD_FAILURE,
            message: `Lesson file not found or inaccessible: ${filePath} (HTTP ${response.status})`
        };
    }

    // 4. Parse JSON
    let lessonData;
    try {
        lessonData = await response.json();
    } catch (parseErr) {
        throw {
            code: ERROR_CODES.INVALID_JSON,
            message: `Lesson file "${filePath}" contains malformed JSON.`,
            details: parseErr.message
        };
    }

    // 5. Validate lesson schema
    const validation = validateLessonSchema(lessonData);
    if (!validation.valid) {
        throw {
            code: ERROR_CODES.SCHEMA_INVALID,
            message: `Lesson "${lessonId}" failed schema validation.`,
            details: validation.errors.join('\n')
        };
    }

    return { outline, lessonData };
}

/**
 * Mapping of lesson IDs to master curriculum checklist item IDs.
 * 
 * TODO: This bridge between the lesson engine and the dashboard's curriculum
 * tracker should eventually be replaced by a shared data source (e.g. a
 * curriculum-map.json loaded at runtime). For now, it's maintained here
 * as the single location connecting the two systems.
 * 
 * Adding entries here is the ONLY manual step needed beyond JSON file creation
 * to sync lesson completion with the main dashboard.
 */
export const CURRICULUM_MAP = {
    'variables': { semId: 'sem0', itemId: 'sem0_m2_u1' },
    'data-types': { semId: 'sem0', itemId: 'sem0_m2_u2' },
    'operators': { semId: 'sem0', itemId: 'sem0_m2_u3' },
    'conditions': { semId: 'sem0', itemId: 'sem0_m2_u4' },
    'loops': { semId: 'sem0', itemId: 'sem0_m2_u5' },
    'functions': { semId: 'sem0', itemId: 'sem0_m2_u6' },
    'arrays': { semId: 'sem0', itemId: 'sem0_m2_u7' },
    'pointers': { semId: 'sem0', itemId: 'sem0_m2_u8' },
    'references': { semId: 'sem0', itemId: 'sem0_m2_u9' },
    'classes': { semId: 'sem0', itemId: 'sem0_m2_u10' },
    'objects': { semId: 'sem0', itemId: 'sem0_m2_u11' },
    'constructors': { semId: 'sem0', itemId: 'sem0_m2_u12' },
    'inheritance': { semId: 'sem0', itemId: 'sem0_m2_u13' },
    'polymorphism': { semId: 'sem0', itemId: 'sem0_m2_u14' },
    'templates': { semId: 'sem0', itemId: 'sem0_m2_u15' },
    'stl': { semId: 'sem0', itemId: 'sem0_m2_u16' },
    'smart-pointers': { semId: 'sem0', itemId: 'sem0_m2_u17' },
    'move-semantics': { semId: 'sem0', itemId: 'sem0_m2_u18' },
    'algebra': { semId: 'sem2', itemId: 'sem2_m1' },
    'trigonometry': { semId: 'sem2', itemId: 'sem2_m2' },
    'geometry': { semId: 'sem2', itemId: 'sem2_m3' },
    'linear-algebra': { semId: 'sem2', itemId: 'sem2_m4' },
    'vectors': { semId: 'sem2', itemId: 'sem2_m5' },
    'matrices': { semId: 'sem2', itemId: 'sem2_m6' },
    'quaternions': { semId: 'sem2', itemId: 'sem2_m7' },
    'physics': { semId: 'sem2', itemId: 'sem2_m8' }
};

/**
 * Read lesson completion and bookmark state from localStorage,
 * synchronizing with the master curriculum checklist.
 * 
 * @returns {{ completedIds: string[], bookmarkIds: string[] }}
 */
export function getProgressState() {
    try {
        const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
        const bookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);

        let completedIds = completed ? JSON.parse(completed) : [];
        const bookmarkIds = bookmarks ? JSON.parse(bookmarks) : [];

        // Synchronize with the master curriculum checklist state
        const masterProgressRaw = localStorage.getItem(STORAGE_KEYS.MASTER_PROGRESS);
        if (masterProgressRaw) {
            const masterState = JSON.parse(masterProgressRaw);
            if (masterState.semesters) {
                for (const [lessonId, mapInfo] of Object.entries(CURRICULUM_MAP)) {
                    for (const sem of masterState.semesters) {
                        if (sem.id === mapInfo.semId) {
                            for (const mod of sem.modules) {
                                for (const item of mod.items) {
                                    if (item.id === mapInfo.itemId && item.completed) {
                                        if (!completedIds.includes(lessonId)) {
                                            completedIds.push(lessonId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return { completedIds, bookmarkIds };
    } catch (e) {
        console.error('Failed to read progress state:', e);
        return { completedIds: [], bookmarkIds: [] };
    }
}

/**
 * Save lesson completion and bookmark state to localStorage,
 * and sync back to the master curriculum checklist.
 * 
 * @param {string[]} completedIds - Array of completed lesson IDs
 * @param {string[]} bookmarkIds - Array of bookmarked lesson IDs
 */
export function saveProgressState(completedIds, bookmarkIds) {
    try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completedIds));
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkIds));

        // Sync back to master state
        const masterProgressRaw = localStorage.getItem(STORAGE_KEYS.MASTER_PROGRESS);
        let masterState = masterProgressRaw ? JSON.parse(masterProgressRaw) : {};

        if (masterState.semesters) {
            for (const [lessonId, mapInfo] of Object.entries(CURRICULUM_MAP)) {
                const shouldBeCompleted = completedIds.includes(lessonId);
                for (const sem of masterState.semesters) {
                    if (sem.id === mapInfo.semId) {
                        for (const mod of sem.modules) {
                            for (const item of mod.items) {
                                if (item.id === mapInfo.itemId) {
                                    item.completed = shouldBeCompleted;
                                }
                            }
                        }
                    }
                }
            }
            localStorage.setItem(STORAGE_KEYS.MASTER_PROGRESS, JSON.stringify(masterState));
        }

        // Push to database in background (non-blocking)
        pushToDatabase(completedIds, bookmarkIds, masterState);
    } catch (e) {
        console.error('Failed to save progress state:', e);
    }
}

/**
 * Push current progress to the local database API server.
 * Fails silently if the server is offline.
 * @private
 */
async function pushToDatabase(completed, bookmarks, masterProgress) {
    try {
        await fetch(API_ENDPOINTS.PROGRESS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                completedLessons: completed,
                bookmarks: bookmarks,
                masterProgress: masterProgress,
                updatedAt: new Date().toISOString()
            })
        });
    } catch (e) {
        // Server offline — fail silently
    }
}

/**
 * Synchronize local state with the database server on page load.
 * If the server has newer data, it overwrites localStorage.
 * 
 * @returns {Promise<boolean>} True if sync was successful
 */
export async function syncDatabaseWithCache() {
    try {
        const res = await fetch(API_ENDPOINTS.PROGRESS);
        if (res.ok) {
            const dbData = await res.json();
            if (dbData.completedLessons) {
                localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(dbData.completedLessons));
            }
            if (dbData.bookmarks) {
                localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(dbData.bookmarks));
            }
            if (dbData.masterProgress && Object.keys(dbData.masterProgress).length > 0) {
                localStorage.setItem(STORAGE_KEYS.MASTER_PROGRESS, JSON.stringify(dbData.masterProgress));
            }
            return true;
        }
    } catch (e) {
        // Server offline — continue with local cache
    }
    return false;
}
