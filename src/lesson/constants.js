/**
 * Constants Module
 * Shared constants for the AIM Lesson Engine — eliminates magic strings.
 * 
 * @module constants
 */

/** Base URL for the local progress sync API server */
export const API_BASE_URL = 'http://localhost:3000';

/** API endpoint paths */
export const API_ENDPOINTS = {
    PROGRESS: `${API_BASE_URL}/api/progress`
};

/** localStorage key names used across the lesson engine */
export const STORAGE_KEYS = {
    COMPLETED_LESSONS: 'AIM_GAMEDEV_COMPLETED_LESSONS',
    BOOKMARKS: 'AIM_GAMEDEV_BOOKMARKS',
    MASTER_PROGRESS: 'AIM_GAMEDEV_MASTER_PROGRESS'
};

/** Error classification codes for the error renderer */
export const ERROR_CODES = {
    NOT_FOUND: 'NOT_FOUND',
    COURSE_MISSING: 'COURSE_MISSING',
    INVALID_JSON: 'INVALID_JSON',
    SCHEMA_INVALID: 'SCHEMA_INVALID',
    LOAD_FAILURE: 'LOAD_FAILURE'
};

/** Valid difficulty levels for lesson schema validation */
export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

/** Valid section types supported by the lesson renderer */
export const SECTION_TYPES = ['theory', 'example', 'note', 'warning', 'tip'];

/** Path pattern for course data files */
export const COURSE_BASE_PATH = 'src/courses';
