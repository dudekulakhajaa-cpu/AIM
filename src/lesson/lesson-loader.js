/**
 * Lesson Loader Module
 * Loads JSON outline and content, manages API caching and schema validation
 */

const outlineCache = {};

export async function loadLesson(courseId, lessonId) {
    try {
        // 1. Fetch or resolve outline from cache
        let outline = outlineCache[courseId];
        if (!outline) {
            const res = await fetch(`src/courses/${courseId}/outline.json`);
            if (!res.ok) throw new Error("Course outline not found.");
            outline = await res.json();
            outlineCache[courseId] = outline;
        }

        // Find the lesson object in the outline
        let foundLesson = null;
        outline.chapters.forEach(chap => {
            const lesson = chap.lessons.find(l => l.id === lessonId);
            if (lesson) foundLesson = lesson;
        });

        if (!foundLesson) {
            throw new Error(`Lesson ID "${lessonId}" not found in course outline.`);
        }

        // 2. Fetch the actual lesson JSON file
        const lessonRes = await fetch(`src/courses/${courseId}/${foundLesson.file}`);
        if (!lessonRes.ok) throw new Error("Lesson content file could not be loaded.");
        const lessonData = await lessonRes.json();

        // 3. Simple schema validation
        const requiredKeys = ["id", "course", "chapter", "title", "difficulty", "duration", "sections"];
        requiredKeys.forEach(k => {
            if (!(k in lessonData)) throw new Error(`Invalid schema: Missing required key "${k}".`);
        });

        return { outline, lessonData };
    } catch (err) {
        console.error("Error loading lesson:", err);
        throw err;
    }
}

// Progress and Bookmark states persisted in LocalStorage
export function getProgressState() {
    try {
        const completed = localStorage.getItem("AIM_GAMEDEV_COMPLETED_LESSONS");
        const bookmarks = localStorage.getItem("AIM_GAMEDEV_BOOKMARKS");
        return {
            completedIds: completed ? JSON.parse(completed) : [],
            bookmarkIds: bookmarks ? JSON.parse(bookmarks) : []
        };
    } catch (e) {
        return { completedIds: [], bookmarkIds: [] };
    }
}

export function saveProgressState(completedIds, bookmarkIds) {
    try {
        localStorage.setItem("AIM_GAMEDEV_COMPLETED_LESSONS", JSON.stringify(completedIds));
        localStorage.setItem("AIM_GAMEDEV_BOOKMARKS", JSON.stringify(bookmarkIds));
    } catch (e) {
        console.error("Failed saving local progress:", e);
    }
}
