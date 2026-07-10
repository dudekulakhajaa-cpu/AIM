# ⚔️ AIM — Game Dev Mastery Platform
### *Khaja's Personal AAA Engineering Roadmap*

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-00e676?style=for-the-badge&logo=github)](https://dudekulakhajaa-cpu.github.io/AIM/)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML%20%7C%20CSS%20%7C%20JS-66fcf1?style=for-the-badge)]()
[![No Build Required](https://img.shields.io/badge/Build-Zero%20Dependencies-c100ff?style=for-the-badge)]()

---

> **AIM** is a fully client-side, zero-dependency interactive learning platform built to take Khaja from foundational computer science all the way to AAA game engine engineering. It runs entirely in the browser — no frameworks, no installs, no build step.

---

## 🌐 Live Site

**[https://dudekulakhajaa-cpu.github.io/AIM/](https://dudekulakhajaa-cpu.github.io/AIM/)**

---

## ✨ What This Platform Does

AIM is not just a tracker — it is an **active learning environment** built around six specialised modules:

| Tab | Module | Purpose |
|-----|--------|---------|
| 🖥️ | **Control Room** | Focus timer, daily study logger, activity heatmap |
| 🎓 | **Curriculum** | 9-semester roadmap with inline Codex cheatsheets |
| 💼 | **Portfolio & Jobs** | Project milestones + interview question tracker |
| ⚔️ | **Quiz Arena** | Timed quizzes + AAA Mock Board Interview simulator |
| 📐 | **Interactive Lab** | Live vector visualizer + C++ algorithm sandbox |
| ⚙️ | **Config & Books** | Reading list, backup/restore, sound preferences |

---

## 🚀 Feature Breakdown

### 1. ⏱️ Control Room — Focus & Consistency Engine

- **Dual-Mode Pomodoro Timer** — Weekday Focus (45 min) and Weekend Grind (60 min) modes, with persistent state that survives page refreshes
- **Daily Study Logger** — Log hours, select category (Theory / Coding / Reflection / Revision / Quiz), and write reflection notes per session
- **Study Activity Matrix** — A GitHub-style 12-week heatmap that tracks active training days and maintains a live **day streak counter**
- **Session History** — Scrollable log of every past study session with timestamps, hours, and notes

---

### 2. 🎓 Curriculum — 9-Semester Structured Roadmap

A 74+ unit roadmap structured into 9 semesters, progressing from computer fundamentals to AAA-grade graphics and production systems:

| Semester | Focus Area |
|----------|-----------|
| **Semester 0** | Computer Science Foundations (CPU, memory, OS, threading, C++ basics) |
| **Semester 1** | Core CS & Data Structures (algorithms, OOP, design patterns) |
| **Semester 2** | Game Mathematics (linear algebra, vectors, matrices, quaternions) |
| **Semester 3** | Game Engineering (memory management, ECS, physics, audio) |
| **Semester 4** | Unreal Engine Editor (Blueprints, gameplay framework, tooling) |
| **Semester 5** | Unreal Engine C++ (native gameplay, networking, async systems) |
| **Semester 6** | Advanced Systems (engine architecture, profiling, optimisation) |
| **Semester 7** | Graphics Programming (HLSL, rendering pipelines, shaders) |
| **Semester 8** | Production & Portfolio (shipping projects, code review, career) |

**Features per curriculum unit:**
- ✅ Checkable progress tracking (persisted to localStorage)
- 📖 **Codex Button** — expands an inline knowledge card showing:
  - 🧠 AAA Core Concept explanation
  - 💻 Correct C++ code snippet
  - ⚠️ Interviewer Trap Warning (the answer that fails candidates)
- 📊 Real-time completion percentage per semester and overall

---

### 3. 💼 Portfolio & AAA Interview Prep

**10 Portfolio Milestones** tracking Khaja's core technical projects:
- Chess Engine (Bitboards, C++)
- Pathfinding Visualizer (A*/Dijkstra)
- Physics Sandbox (2D Custom)
- Custom Memory Allocator
- Third-Person Action Game (Blueprints, UE5)
- RPG Prototype (C++ & BP UE5)
- Multiplayer Shooter (EOS, UE5, C++)
- And more...

**Interview Prep Tracker** with 13 categorised questions across:
- C++ Native (references, VTABLE, move semantics, smart pointers)
- Unreal Native (UObject lifecycle, RPCs, actor replication)
- DSA & Architecture (A* pathfinding, object pools)
- Design Patterns (Observer, State Machine)
- Game Mathematics (dot/cross product, quaternions & SLERP)

---

### 4. ⚔️ Quiz Arena & Mock Board Interview

**Timed Interactive Quizzes** across three banks:
- Modern C++ (virtual functions, templates, RAII, move semantics)
- Computer Systems (memory hierarchy, threading, OS primitives)
- Game Math & Vectors (dot product, quaternion rotations, matrices)

Each question features a countdown timer, multiple-choice options, and a detailed explanation box that unlocks on answer submission.

**AAA Mock Board Interview Simulator** — 3 board-level technical prompts:
1. *"What is Gimbal Lock, and how do Quaternions avoid it?"*
2. *"Design an Object Pool class in C++ to prevent memory fragmentation."*
3. *"Explain VTABLE lookup in C++. What is its performance impact on gameplay code?"*

For each question, Khaja writes a free-form answer, then reveals:
- 📋 A professional rubric listing the exact bullet points a senior interviewer checks
- 💻 A reference C++ implementation
- 🏆 Self-grade buttons (Pass / Fail) with a personalised final score verdict

---

### 5. 📐 Interactive Lab — Math Visualizer & Code Arena

#### Vector Laboratory (HTML5 Canvas)
- Live 400×400 Cartesian grid rendered using the Canvas API
- **Drag** the Cyan (Vector A) and Magenta (Vector B) endpoint handles
- Real-time updates of:
  - Vector coordinates `(x, y)`
  - Dot Product `A · B`
  - Cross Product `A × B`
  - Projection dashed line of A onto B
- Dynamic **Game Dev Application** explanation box — updates automatically with gameplay context (e.g. *"dot product > 0.707 means the enemy is inside your 90° FOV"*)

#### Code Arena — C++ Algorithm Sandbox
A local sandboxed test runner with 4 algorithm challenges:

| # | Challenge | Concept |
|---|-----------|---------|
| 1 | **Vector Normalization** | Linear algebra — `normalize({x, y})` |
| 2 | **Enemy FOV Check** | Dot product gameplay — `isEnemyInFOV(...)` |
| 3 | **Emulate `unique_ptr`** | C++ move semantics & ownership transfer |
| 4 | **Binary Search Inventory** | O(log N) sorted array lookup |

Write solutions directly in the editor, click **Run Test Suite**, and the JS engine executes assertion tests — printing pass/fail to the Execution Console.

---

### 6. ⚙️ Config & Books

- **Required Reading List** — 7 essential books tracked with status (To Read / Reading / Done):
  - *Effective Modern C++* — Scott Meyers
  - *Game Programming Patterns* — Robert Nystrom
  - *Game Engine Architecture* — Jason Gregory
  - *Real-Time Rendering* — Tomas Akenine-Möller
  - *Clean Code* / *Clean Architecture* — Robert C. Martin
  - *C++ Concurrency in Action* — Anthony Williams
- **Progress Backup & Restore** — Export entire progress as `progress.json` or import a previous save
- **Sound Preferences** — Toggle the Web Audio API completion chime on/off

---

## 📂 Project Structure

```
AIM/
├── index.html          # Single-page app shell — all tabs, panels, drawer, sidebar
├── app.js              # Application engine — state, timers, renders, canvas, quiz logic (~2,900 lines)
├── codex_data.js       # Educational database — 80+ codex entries, quiz banks, interview data (~2,260 lines)
├── styles.css          # Full design system — dark cyberpunk theme, glassmorphism, responsive grid (~2,530 lines)
├── progress.json       # Default seed data — curriculum structure, 74 units, portfolio, reading list
├── README.md           # This file
└── semesters/          # Local markdown study notes per semester (personal reference)
    ├── semester_0_foundation/
    ├── semester_1_cs/
    ├── semester_2_math/
    ├── semester_3_engineering/
    ├── semester_4_unreal_editor/
    ├── semester_5_unreal_cpp/
    ├── semester_6_advanced/
    ├── semester_7_graphics/
    └── semester_8_production/
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Structure | HTML5 (Semantic) | Single file, zero build overhead |
| Logic | Vanilla JavaScript (ES2022) | No framework weight, full control |
| Styling | Vanilla CSS3 | Custom design system, CSS variables, animations |
| Storage | Browser `localStorage` | 100% offline, no server required |
| Canvas | HTML5 Canvas API | Vector lab real-time rendering |
| Audio | Web Audio API | Synthesized C-major chime alerts |
| Fonts | Google Fonts (Outfit + JetBrains Mono) | Premium typography |
| Hosting | GitHub Pages | Free, instant, zero-config deployment |

---

## 🛠️ Getting Started

Since the platform runs entirely in the browser, **no installs or builds are needed**.

### Option A: Open Directly
```bash
git clone https://github.com/dudekulakhajaa-cpu/AIM.git
cd AIM
# Double-click index.html — opens instantly in Chrome, Edge, or Firefox
```

### Option B: Local HTTP Server (Recommended)
Avoids any browser CORS restrictions:

```bash
# Python 3
python -m http.server 8000
# Then visit: http://localhost:8000
```

Or use the **VS Code Live Server** extension — click `Go Live` in the status bar.

---

## 💾 Data Persistence

All progress is automatically saved to `localStorage` under the key `AIM_GAMEDEV_MASTER_PROGRESS`, including:

- ✅ Curriculum checklist states (74 units across 9 semesters)
- 📅 Day streak and last study date
- 🕐 Total cumulative hours logged
- 📝 Full session history with category tags and notes
- 📚 Reading list statuses
- 📂 Portfolio project statuses
- ⏱️ Active timer state (survives page refresh mid-session)
- 🔊 Sound preference toggle state

> [!WARNING]
> Clearing your browser cache or cookies **will erase all progress**. Regularly export your data via **Download progress.json** in the Config & Books tab. You can restore it at any time with **Upload progress.json**.

---

## 🗺️ Roadmap

- [ ] Add Codex entries for Semester 7 (HLSL shaders, rendering pipeline)
- [ ] Expand Code Arena with advanced challenges (BVH tree, ECS, memory pool)
- [ ] Add a 3D vector visualizer using WebGL
- [ ] Spaced repetition system for interview question review
- [ ] Sync progress to GitHub Gist for cross-device persistence

---

## 👤 About

Built and maintained by **Khaja** — an aspiring AAA game programmer working toward mastery in systems programming, Unreal Engine C++, and game mathematics.

> *"The only way to ship AAA-quality code is to study AAA-quality engineering every single day."*

---

*Made with 🔥 and vanilla JavaScript. No frameworks were harmed.*
