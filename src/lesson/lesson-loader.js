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

// Mapping of lesson IDs to master curriculum checklist item IDs
export const CURRICULUM_MAP = {
    "variables": { semId: "sem0", itemId: "sem0_m2_u1" },
    "pointers": { semId: "sem0", itemId: "sem0_m2_u8" },
    "references": { semId: "sem0", itemId: "sem0_m2_u9" },
    "vectors": { semId: "sem2", itemId: "sem2_m5" }
};

// Progress and Bookmark states persisted in LocalStorage
export function getProgressState() {
    try {
        const completed = localStorage.getItem("AIM_GAMEDEV_COMPLETED_LESSONS");
        const bookmarks = localStorage.getItem("AIM_GAMEDEV_BOOKMARKS");
        
        let completedIds = completed ? JSON.parse(completed) : [];
        const bookmarkIds = bookmarks ? JSON.parse(bookmarks) : [];
        
        // Synchronize with the master curriculum checklist state
        const masterProgressRaw = localStorage.getItem("AIM_GAMEDEV_MASTER_PROGRESS");
        if (masterProgressRaw) {
            const masterState = JSON.parse(masterProgressRaw);
            if (masterState.semesters) {
                Object.entries(CURRICULUM_MAP).forEach(([lessonId, mapInfo]) => {
                    masterState.semesters.forEach(sem => {
                        if (sem.id === mapInfo.semId) {
                            sem.modules.forEach(mod => {
                                mod.items.forEach(item => {
                                    if (item.id === mapInfo.itemId && item.completed) {
                                        if (!completedIds.includes(lessonId)) {
                                            completedIds.push(lessonId);
                                        }
                                    }
                                });
                            });
                        }
                    });
                });
            }
        }
        
        return { completedIds, bookmarkIds };
    } catch (e) {
        return { completedIds: [], bookmarkIds: [] };
    }
}

export function saveProgressState(completedIds, bookmarkIds) {
    try {
        localStorage.setItem("AIM_GAMEDEV_COMPLETED_LESSONS", JSON.stringify(completedIds));
        localStorage.setItem("AIM_GAMEDEV_BOOKMARKS", JSON.stringify(bookmarkIds));
        
        // Sync back to master state
        const masterProgressRaw = localStorage.getItem("AIM_GAMEDEV_MASTER_PROGRESS");
        if (masterProgressRaw) {
            const masterState = JSON.parse(masterProgressRaw);
            if (masterState.semesters) {
                Object.entries(CURRICULUM_MAP).forEach(([lessonId, mapInfo]) => {
                    const shouldBeCompleted = completedIds.includes(lessonId);
                    masterState.semesters.forEach(sem => {
                        if (sem.id === mapInfo.semId) {
                            sem.modules.forEach(mod => {
                                mod.items.forEach(item => {
                                    if (item.id === mapInfo.itemId) {
                                        item.completed = shouldBeCompleted;
                                    }
                                });
                            });
                        }
                    });
                });
                localStorage.setItem("AIM_GAMEDEV_MASTER_PROGRESS", JSON.stringify(masterState));
            }
        }
    } catch (e) {
        console.error("Failed saving local progress:", e);
    }
}
