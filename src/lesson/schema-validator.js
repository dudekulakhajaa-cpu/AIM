/**
 * Schema Validator Module
 * Validates lesson JSON and outline JSON structures before rendering.
 * Returns structured results instead of throwing — caller decides how to handle.
 * 
 * @module schema-validator
 */

import { DIFFICULTY_LEVELS, SECTION_TYPES } from './constants.js';

/**
 * Validate a lesson content JSON object against the required schema.
 * 
 * @param {Object} data - The parsed lesson JSON object
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateLessonSchema(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Lesson data is null or not an object.'] };
    }

    // Required string fields
    const requiredStrings = ['id', 'title', 'description', 'difficulty'];
    for (const key of requiredStrings) {
        if (!(key in data)) {
            errors.push(`Missing required field: "${key}".`);
        } else if (typeof data[key] !== 'string' || data[key].trim() === '') {
            errors.push(`Field "${key}" must be a non-empty string.`);
        }
    }

    // Duration must be a positive number
    if (!('duration' in data)) {
        errors.push('Missing required field: "duration".');
    } else if (typeof data.duration !== 'number' || data.duration <= 0) {
        errors.push('"duration" must be a positive number.');
    }

    // Difficulty must be one of the allowed values
    if (data.difficulty && !DIFFICULTY_LEVELS.includes(data.difficulty)) {
        errors.push(`"difficulty" must be one of: ${DIFFICULTY_LEVELS.join(', ')}. Got: "${data.difficulty}".`);
    }

    // Sections must be a non-empty array
    if (!('sections' in data)) {
        errors.push('Missing required field: "sections".');
    } else if (!Array.isArray(data.sections)) {
        errors.push('"sections" must be an array.');
    } else if (data.sections.length === 0) {
        errors.push('"sections" array must contain at least one section.');
    } else {
        // Validate individual sections
        data.sections.forEach((section, index) => {
            if (!section.type) {
                errors.push(`Section [${index}]: missing "type" field.`);
            } else if (!SECTION_TYPES.includes(section.type)) {
                errors.push(`Section [${index}]: unknown type "${section.type}". Expected one of: ${SECTION_TYPES.join(', ')}.`);
            }
            if (!section.title || typeof section.title !== 'string') {
                errors.push(`Section [${index}]: missing or invalid "title" field.`);
            }
        });
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate a course outline JSON object against the required schema.
 * 
 * @param {Object} data - The parsed outline JSON object
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateOutlineSchema(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Outline data is null or not an object.'] };
    }

    if (!data.courseId || typeof data.courseId !== 'string') {
        errors.push('Missing or invalid "courseId" field.');
    }

    if (!data.courseName || typeof data.courseName !== 'string') {
        errors.push('Missing or invalid "courseName" field.');
    }

    if (!Array.isArray(data.chapters)) {
        errors.push('"chapters" must be an array.');
        return { valid: false, errors };
    }

    if (data.chapters.length === 0) {
        errors.push('"chapters" array must contain at least one chapter.');
    }

    // Validate each chapter and its lessons
    const seenLessonIds = new Set();

    data.chapters.forEach((chapter, chapterIdx) => {
        if (!chapter.chapterName || typeof chapter.chapterName !== 'string') {
            errors.push(`Chapter [${chapterIdx}]: missing or invalid "chapterName".`);
        }

        if (!Array.isArray(chapter.lessons)) {
            errors.push(`Chapter [${chapterIdx}] ("${chapter.chapterName || 'unknown'}"): "lessons" must be an array.`);
            return;
        }

        chapter.lessons.forEach((lesson, lessonIdx) => {
            const prefix = `Chapter [${chapterIdx}] → Lesson [${lessonIdx}]`;

            if (!lesson.id || typeof lesson.id !== 'string') {
                errors.push(`${prefix}: missing or invalid "id".`);
            } else {
                if (seenLessonIds.has(lesson.id)) {
                    errors.push(`${prefix}: duplicate lesson ID "${lesson.id}".`);
                }
                seenLessonIds.add(lesson.id);
            }

            if (!lesson.title || typeof lesson.title !== 'string') {
                errors.push(`${prefix}: missing or invalid "title".`);
            }

            if (!lesson.file || typeof lesson.file !== 'string') {
                errors.push(`${prefix}: missing or invalid "file".`);
            }
        });
    });

    return { valid: errors.length === 0, errors };
}
