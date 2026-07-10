# ⚔️ AIM Game Dev Mastery Platform
### *Khaja's AAA Engineering Roadmap*

Welcome to **AIM Game Dev**, a high-fidelity, interactive, single-page dashboard companion designed to guide game programmers toward **AAA studio readiness**. This platform combines structured study curriculums, mock board interviews, linear algebra visualizers, a bitwise/algorithm simulator, and study routine tracking—all running locally in your browser.

---

## 🚀 Key Features

### 1. ⏱️ Focus Timer & Control Room
*   **Dual Mode Timer:** Configurable for **Weekday Focus** (45 mins) and **Weekend Grind** (60 mins) to support deep, uninterrupted learning.
*   **Daily Study Logger:** Log study duration, select study categories (Theory, Coding, Reflection, Revision, Quiz), and record reflection logs.
*   **Study Activity Matrix:** A GitHub-style interactive heatmap grid visualizing consistency and tracking active day streaks.

### 2. 🎓 Interactive Curriculum Tree
*   **9-Semester Roadmap:** Structured path from computer foundations up to production and shader/graphics programming.
*   **Dynamic Progress Tracking:** Checking off items computes your completion percentages in real-time, showing your overall platform mastery score.
*   **Study Portal Drawer:** Slide-out drawer displaying low-level concepts, C++ code recipes, and interviewer trap warnings.

### 3. 💼 Portfolio & AAA Interview Prep
*   **10 Portfolio Milestones:** A checklist of core technical projects (e.g., custom memory allocator, pathfinding visualizer, physics engine) to validate skills to recruiters.
*   **Interview Prep Tracker:** Curated interview questions categorized under C++ Native, Unreal Native, DSA, Design Patterns, and Game Math.
*   **Interactive Answers & Rubrics:** Read correct answers and assess yourself against professional rubrics.

### 4. ⚔️ Quiz Arena & Mock Board Interview
*   **Interactive Quizzes:** Challenge yourself with timers and detailed explanation windows on Modern C++, Systems, and Game Math.
*   **AAA Mock Board Interview:** Answer complex technical prompts and compare your solutions with standard reference code under self-evaluation grading rubrics.

### 5. 📐 The Vector Laboratory & Code Arena
*   **2D Vector Visualizer:** Drag cyan (Vector A) and magenta (Vector B) endpoints in real-time to compute dot product and cross product, with inline game engine application insights (e.g., perpendicular checking, surface normals).
*   **Code Arena Simulator:** Solve coding challenges directly inside a local simulated compiler box. Challenges include:
    1. Vector Normalization
    2. Dot Product Enemy Detector
    3. Emulate Custom `smart_ptr` (Memory Management)
    4. Binary Search Inventory

### 6. ⚙️ Backup, Restore, and Preferences
*   **Local Storage Backup:** Easily download your progress as a `progress.json` backup file or restore previous sessions by uploading it.
*   **Melodic Auditory Feedback:** Synthesized completion chimes using the browser's native Web Audio API (can be toggled on/off in settings).

---

## 📂 Project Structure

This project uses a clean, light-weight tech stack built purely on vanilla web standard technologies:

*   **[index.html](file:///c:/Users/dudek/OneDrive/Desktop/AIM/index.html)**: The structural hub of the platform. Defines the modular layouts, tabs, study drawer, and sidebar dashboard controls.
*   **[app.js](file:///c:/Users/dudek/OneDrive/Desktop/AIM/app.js)**: The interactive application engine managing state transitions, localStorage sync, the focus timer, canvas drawing, mock evaluation logic, and UI renders.
*   **[codex_data.js](file:///c:/Users/dudek/OneDrive/Desktop/AIM/codex_data.js)**: The comprehensive local database storing all semester guides, interview questions, rubrics, correct code recipes, and quiz banks.
*   **[styles.css](file:///c:/Users/dudek/OneDrive/Desktop/AIM/styles.css)**: The styling system featuring a dark-themed cyberpunk aesthetic with glassmorphism, responsive grids, neon cues, and CSS micro-animations.
*   **[progress.json](file:///c:/Users/dudek/OneDrive/Desktop/AIM/progress.json)**: The initial template file for seeds, tracking status, and project lists.
*   **[semesters/](file:///c:/Users/dudek/OneDrive/Desktop/AIM/semesters)**: Workspace directory holding local markdown study files corresponding to curriculum units.

---

## 🛠️ Getting Started

Since the dashboard runs entirely in the browser, no heavy builds or package managers are required.

### Option A: Local Browser Launch
1. Open your file explorer.
2. Double-click **[index.html](file:///c:/Users/dudek/OneDrive/Desktop/AIM/index.html)** to launch it instantly in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option B: Local HTTP Server (Recommended)
To prevent CORS issues when loading local markdown chapters from the workspace, serve the files via a light local server:

**Using Python:**
```bash
# In your terminal inside the AIM directory:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

**Using VS Code:**
Install the **Live Server** extension, click **Go Live** on the bottom status bar, and let it serve the repository automatically.

---

## 💾 Local Storage & Progress Synchronisation

All study logs, milestones, streak counters, and curriculum checklist selections are stored automatically in your browser's local cache under the key:
`AIM_GAMEDEV_MASTER_PROGRESS`.

> [!WARNING]  
> Clearing your browser cache or cookies will reset your learning database. Make sure to regularly use the **Download progress.json** feature in the **Config & Books** tab to save your progress! You can upload it at any time to restore your logs and checklist state.
