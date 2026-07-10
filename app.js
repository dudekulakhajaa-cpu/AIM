// Gamedev Mastery Dashboard - Application Engine
let state = {
    streak: 0,
    lastStudyDate: "",
    totalHours: 0,
    studyLogs: [],
    semesters: [],
    portfolio: [],
    interviewTracker: {},
    readingList: [],
    activeAcademy: "game-development"
};

// Local storage key
const STORAGE_KEY = "AIM_GAMEDEV_MASTER_PROGRESS";

// Synthesise a beautiful melodic completion chime using multiple Web Audio oscillators
const playAudioBeep = () => {
    const toggle = elements.soundFxToggle || document.getElementById("sound-fx-toggle");
    if (toggle && !toggle.checked) return;
    
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        const playTone = (freq, type, duration, startTime) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
            gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(ctx.currentTime + startTime);
            osc.stop(ctx.currentTime + startTime + duration);
        };
        
        // Synthesise an arpeggiated C-major chord
        playTone(523.25, "sine", 0.4, 0);       // C5
        playTone(659.25, "triangle", 0.4, 0.12);  // E5
        playTone(783.99, "sine", 0.5, 0.24);      // G5
        playTone(1046.50, "sine", 0.6, 0.36);     // C6
    } catch (e) {
        console.warn("Web Audio API Chime failed: ", e);
    }
};

// DOM Elements
const elements = {
    streakCount: document.getElementById("streak-count"),
    overallProgressPct: document.getElementById("overall-progress-pct"),
    overallProgressFill: document.getElementById("overall-progress-fill"),
    pageTitle: document.getElementById("page-title"),
    navButtons: document.querySelectorAll(".nav-btn, .mobile-nav-btn"),
    tabPanels: document.querySelectorAll(".tab-panel"),
    
    // Timer
    timeDisplay: document.getElementById("time-display"),
    timerModePill: document.getElementById("timer-mode"),
    btnStartTimer: document.getElementById("btn-start-timer"),
    btnResetTimer: document.getElementById("btn-reset-timer"),
    btnToggleTimerMode: document.getElementById("btn-toggle-mode"),
    
    // Stats
    statCompletedItems: document.getElementById("stat-completed-items"),
    statHours: document.getElementById("stat-hours"),
    
    // Logger
    logForm: document.getElementById("log-form"),
    logDate: document.getElementById("log-date"),
    logHours: document.getElementById("log-hours"),
    logCategory: document.getElementById("log-category"),
    logNotes: document.getElementById("log-notes"),
    historyList: document.getElementById("history-list"),
    
    // Curriculum
    curriculumStatus: document.getElementById("curriculum-status-text"),
    curriculumChecklistRatio: document.getElementById("curriculum-checklist-ratio"),
    semesterAccordionList: document.getElementById("semester-accordion-list"),
    
    // Portfolio & Interview
    portfolioProjectList: document.getElementById("portfolio-project-list"),
    interviewCategoryTabs: document.getElementById("interview-category-tabs"),
    interviewQuestionsList: document.getElementById("interview-questions-list"),
    
    // Quiz
    quizIntro: document.getElementById("quiz-intro"),
    quizQuestionBox: document.getElementById("quiz-question-box"),
    quizProgressText: document.getElementById("quiz-progress-text"),
    quizTimer: document.getElementById("quiz-timer"),
    quizQuestionText: document.getElementById("quiz-question-text"),
    quizOptionsContainer: document.getElementById("quiz-options-container"),
    quizExplanationBox: document.getElementById("quiz-explanation-box"),
    explanationStatus: document.getElementById("explanation-status"),
    explanationText: document.getElementById("explanation-text"),
    quizNextBtn: document.getElementById("quiz-next-btn"),
    quizResultBox: document.getElementById("quiz-result-box"),
    quizScoreVal: document.getElementById("quiz-score-val"),
    quizTotalVal: document.getElementById("quiz-total-val"),
    quizVerdict: document.getElementById("quiz-verdict"),
    
    // Reading List & Backup
    readingListContainer: document.getElementById("reading-list-container"),
    btnExportData: document.getElementById("btn-export-data"),
    btnImportTrigger: document.getElementById("btn-import-trigger"),
    importFileInput: document.getElementById("import-file-input"),
    soundFxToggle: document.getElementById("sound-fx-toggle"),
    activityHeatmap: document.getElementById("activity-heatmap"),
    
    // Vector Lab
    vectorCanvas: document.getElementById("vector-canvas"),
    outputVecA: document.getElementById("output-vec-a"),
    outputVecB: document.getElementById("output-vec-b"),
    outputDot: document.getElementById("output-dot"),
    outputCross: document.getElementById("output-cross"),
    mathRelationTitle: document.getElementById("math-relation-title"),
    mathExplanationText: document.getElementById("math-explanation-text"),
    mathApplicationText: document.getElementById("math-application-text"),
    btnResetVectors: document.getElementById("btn-reset-vectors"),
    
    // Code Arena
    challengeSelector: document.getElementById("challenge-selector"),
    challengeTitle: document.getElementById("challenge-title"),
    challengeDescription: document.getElementById("challenge-description"),
    codeEditor: document.getElementById("code-editor"),
    btnResetCode: document.getElementById("btn-reset-code"),
    btnRunCode: document.getElementById("btn-run-code"),
    consoleOutput: document.getElementById("console-output"),
    
    // IA Navigation elements
    searchModal: document.getElementById("search-modal"),
    searchInput: document.getElementById("search-input"),
    searchResultsList: document.getElementById("search-results-list"),
    commandPalette: document.getElementById("command-palette"),
    breadcrumbsTrail: document.getElementById("breadcrumbs-trail")
};

// Timer variables
let timerInterval = null;
let timerSecondsRemaining = 45 * 60; // 45 minutes default
let currentTimerMode = "weekday"; // "weekday" or "weekend"
let isTimerRunning = false;

// Quiz State
let quizQuestions = [];
let quizCurrentIndex = 0;
let quizScore = 0;
let quizSelectedOptionIndex = null;
let quizTimerInterval = null;
let quizTimerSecs = 0;

const QUIZ_BANK = {
    cpp: [
        {
            q: "What is the primary benefit of C++11 list initialization (e.g. `int x{5};` or `double y{2.5};`)?",
            options: [
                "It executes faster at compile time.",
                "It prevents narrowing conversions (e.g., trying to implicitly store a double in an int).",
                "It automatically places the variable in the CPU L1 cache.",
                "It creates a smart pointer automatically."
            ],
            correct: 1,
            exp: "List initialization (uniform initialization) triggers a compiler error or warning if a narrowing conversion occurs (e.g., placing a fractional double into an integer), making your code much safer."
        },
        {
            q: "What does `std::move` actually do in C++?",
            options: [
                "It physically transfers bytes of data across RAM address boundaries.",
                "It offloads the object execution to a separate worker thread.",
                "It performs a static cast to an rvalue reference, signifying that the object can be cannibalized.",
                "It releases heap memory back to the OS immediately."
            ],
            correct: 2,
            exp: "`std::move` does not copy or move any data at runtime. It simply casts its argument to an rvalue reference (`T&&`), enabling compilers to trigger move constructors or move assignment operators to transfer ownership of resources without copying."
        },
        {
            q: "In a class hierarchy, what happens if you delete a derived class object through a pointer to a base class that lacks a virtual destructor?",
            options: [
                "The compiler will fail to build the project.",
                "It results in undefined behavior, typically leaking the memory allocated by the derived class.",
                "It executes both destructors perfectly anyway.",
                "The OS automatically garbage collects the derived portion."
            ],
            correct: 1,
            exp: "If a base class destructor is not marked `virtual`, deleting a derived object through a base pointer causes undefined behavior. In practice, only the base class destructor runs, leaking any resource or memory initialized solely by the derived class."
        },
        {
            q: "Which smart pointer should be used to resolve cyclical references (e.g., Node A points to Node B, and Node B points to Node A)?",
            options: [
                "std::unique_ptr",
                "std::shared_ptr",
                "std::weak_ptr",
                "std::auto_ptr"
            ],
            correct: 2,
            exp: "`std::weak_ptr` holds a non-owning ('weak') reference to an object managed by `std::shared_ptr`. It does not increase the reference count, breaking cyclical reference deadlocks that prevent memory reclamation."
        },
        {
            q: "What is the primary performance overhead of calling a Virtual function in C++ compared to a regular member function?",
            options: [
                "None; virtual functions are always optimized and inlined by modern compilers.",
                "High overhead because the thread has to wait for a kernel mode context switch.",
                "A double dereference overhead: looking up the object's VTABLE pointer and then fetching the function address from the virtual table, which can also cause cache misses.",
                "Virtual functions copy the entire class data inside the stack."
            ],
            correct: 2,
            exp: "Calling a virtual function requires accessing the object's vptr (VTABLE pointer), navigating to the class VTABLE in memory, and resolving the function pointer. This indirection adds overhead and prevents inlining optimizations, which is why performance-critical AAA loops often avoid virtual overrides."
        }
    ],
    systems: [
        {
            q: "Why is iterating through a flat sequential C++ array faster than iterating through a linked list of equivalent size?",
            options: [
                "Linked lists take 10x more stack space.",
                "Array elements are contiguous in memory, leading to high CPU cache hits; linked list nodes are scattered, causing constant cache misses.",
                "Arrays use inline GPU instructions.",
                "Pointers are deprecated in modern OS kernels."
            ],
            correct: 1,
            exp: "Contiguous memory layout ensures that when the CPU requests one element, the hardware cache pre-fetches adjacent elements. Linked lists scatter nodes dynamically on the heap, causing the CPU to wait (stall) on high-latency RAM fetches (cache misses)."
        },
        {
            q: "What is a 'Race Condition' in multithreaded programming?",
            options: [
                "When a thread takes longer than 16.6ms to execute a frame.",
                "When multiple threads concurrently read and write to the same shared memory address without synchronization, producing unpredictable values.",
                "When the CPU core execution speed throttle reaches 100%.",
                "When two processes try to bind to the same network port."
            ],
            correct: 1,
            exp: "A race condition occurs when the outcome of execution depends on the non-deterministic relative order/timing of threads. Proper locking (mutex, atomic operations, lock-free queues) is necessary to ensure data safety."
        },
        {
            q: "What is the primary distinction between User Mode and Kernel Mode execution?",
            options: [
                "User Mode is for Linux applications only; Kernel Mode is for Windows.",
                "User Mode code runs with restricted access to physical hardware; Kernel Mode runs with full hardware capabilities and system control.",
                "User Mode has access to twice the RAM size of Kernel Mode.",
                "There is no difference in modern hardware."
            ],
            correct: 1,
            exp: "To prevent applications from damaging hardware or other processes, CPU hardware enforces privilege rings. User Mode code must request Kernel Mode services (via system calls) to perform disk I/O, network packets, or memory allocation."
        },
        {
            q: "What happens during a CPU Cache Miss?",
            options: [
                "The computer crashes with a Blue Screen.",
                "The requested data is not present in the L1/L2/L3 caches, forcing the CPU to fetch it from slow system RAM, stalling execution for hundreds of cycles.",
                "The GPU takes over calculation automatically.",
                "The cache memory resets itself."
            ],
            correct: 1,
            exp: "Retrieving data from cache takes 1 to 15 cycles. Retrieving from RAM takes 150 to 300+ cycles. Constant cache misses cause CPU stalls, meaning the processor spends most of its time waiting, leading to performance drops."
        },
        {
            q: "Why is context switching between threads considered expensive in high-performance loops?",
            options: [
                "It requires downloading files.",
                "The OS must save all CPU registers, flush instruction pipelines, reload the new thread's states, and invalidate cache mappings, stalling execution.",
                "It deletes the application's heap memory allocation.",
                "It changes the compiler optimization settings."
            ],
            correct: 1,
            exp: "Context switching shifts thread execution on a CPU core. The overhead is significant because it invalidates the current caches, causing cache misses when the new thread begins executing, which degrades gameplay responsiveness."
        }
    ],
    math: [
        {
            q: "If vector A points straight up (0, 1, 0) and vector B points straight right (1, 0, 0), what is their Dot Product (A · B)?",
            options: [
                "1.0",
                "0.0",
                "-1.0",
                "Square root of 2"
            ],
            correct: 1,
            exp: "The dot product of two perpendicular vectors is always 0. Mathematical definition: A · B = |A||B| cos(theta). Since cos(90°) = 0, the result is 0. In games, this is used to check if objects are perpendicular or behind/facing."
        },
        {
            q: "If vector A points forward (0, 0, 1) and vector B points right (1, 0, 0), what direction does their Cross Product (A x B) point in a right-handed system?",
            options: [
                "Up (0, 1, 0)",
                "Down (0, -1, 0)",
                "Backward (0, 0, -1)",
                "Zero vector"
            ],
            correct: 0,
            exp: "The cross product generates a third vector perpendicular to both input vectors. Using the Right-Hand Rule: pointing fingers forward (A) and curling them right (B) leaves the thumb pointing straight Up. Useful for generating surface normals."
        },
        {
            q: "Why are Quaternions heavily preferred over Euler angles for representing rotations in 3D game engines?",
            options: [
                "Quaternions are much easier for humans to read and write.",
                "Quaternions prevent Gimbal Lock (the loss of a degree of freedom when two rotation axes align) and support smooth interpolation (SLERP).",
                "Quaternions do not use floating-point math.",
                "Quaternions are computed entirely on the sound card."
            ],
            correct: 1,
            exp: "Euler angles (pitch, yaw, roll) suffer from Gimbal Lock, where rotating an object by 90 degrees can align two axes, causing rotations to lose a degree of freedom. Quaternions represent rotations in 4D hyper-spherical space, avoiding this issues and allowing easy spherical linear interpolation (SLERP)."
        },
        {
            q: "How do you 'normalize' a 3D vector?",
            options: [
                "Add 1.0 to the X, Y, and Z components.",
                "Divide each component of the vector by its total length (magnitude), scaling the vector's length to exactly 1.0.",
                "Set all values that are negative to positive.",
                "Multiply the vector by its transpose matrix."
            ],
            correct: 1,
            exp: "Normalization scales a vector so its length is 1, turning it into a pure direction vector. Mathematically: V_normalized = V / ||V||, where ||V|| is the magnitude (sqrt(x^2 + y^2 + z^2)). Direction vectors are core to lighting, camera calculations, and physics."
        },
        {
            q: "Why do 3D game engines represent object transformations using 4x4 matrices instead of 3x3 matrices?",
            options: [
                "4x4 matrices take less GPU bandwidth.",
                "A 3x3 matrix cannot represent translation (movement) in linear vector transformations; a 4x4 matrix uses homogeneous coordinates to combine translation, rotation, and scale.",
                "3x3 matrices are unsupported by modern C++ standard libraries.",
                "4x4 matrices are required to support ray tracing."
            ],
            correct: 1,
            exp: "A 3x3 matrix can only handle linear transformations like rotation, scaling, and shearing. By adding a 4th coordinate (homogeneous coordinates, W), a 4x4 matrix can represent translation. This allows engines to combine translation, rotation, and scale into a single matrix multiplication."
        }
    ]
};

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load data from local storage or seed progress.json
    await initData();
    state.activeAcademy = state.activeAcademy || "game-development";
    
    // Sync active academy custom dropdown trigger & progress percentages
    syncAcademyDropdownUI(state.activeAcademy);
    updateAcademyPortalProgress();
    
    // 2. Setup navigation
    setupNavigation();
    
    // 3. Render Dashboard stats, logs & forms
    renderDashboard();
    setupDashboardHandlers();
    
    // 4. Render Curriculum list
    renderCurriculum();
    
    // 5. Render Portfolio & Job trackers
    renderPortfolioAndInterviews();
    
    // 6. Render Settings & Books
    renderSettings();
    setupBackupHandlers();
    
    // 7. Setup date input default to today
    const today = new Date().toISOString().split('T')[0];
    elements.logDate.value = today;
    
    // 8. Render Study Activity Matrix Heatmap
    renderHeatmap();
    
    // 9. Load Sound Preference state
    const soundSetting = localStorage.getItem("AIM_GAMEDEV_SOUND_ENABLED");
    if (soundSetting !== null && elements.soundFxToggle) {
        elements.soundFxToggle.checked = (soundSetting === "true");
    }
    if (elements.soundFxToggle) {
        elements.soundFxToggle.addEventListener("change", (e) => {
            localStorage.setItem("AIM_GAMEDEV_SOUND_ENABLED", e.target.checked);
        });
    }
    
    // 10. Load and resume Focus Timer if active
    loadTimerState();
    
    // 11. Initialize Interactive Lab & Sandbox components
    initVectorLab();
    initCodeArena();
    
    // 13. Initialize Study Drawer
    setupStudyDrawerHandlers();
    
    // 12. Restore last active tab
    const activeTab = localStorage.getItem("AIM_GAMEDEV_ACTIVE_TAB") || "dashboard";
    const tabButton = document.querySelector(`.nav-btn[data-tab="${activeTab}"]`);
    if (tabButton) tabButton.click();
});

// Default seed data fallback for file:// protocol loading
const DEFAULT_SEED_DATA = {
  "activeAcademy": "game-development",
  "streak": 0,
  "lastStudyDate": "",
  "totalHours": 0,
  "studyLogs": [],
  "semesters": [
    {
      "id": "sem0",
      "name": "Semester 0 — Programming Foundation",
      "modules": [
        {
          "name": "Module 1 — Computer Fundamentals",
          "items": [
            {"id": "sem0_m1_c1", "name": "Chapter 1: How Computers Work", "completed": false},
            {"id": "sem0_m1_c2", "name": "Chapter 2: Operating Systems & Threading", "completed": false},
            {"id": "sem0_m1_c3", "name": "Chapter 3: Developer Setup", "completed": false}
          ]
        },
        {
          "name": "Module 2 — Modern C++",
          "items": [
            {"id": "sem0_m2_u1", "name": "Unit 1: Variables", "completed": false},
            {"id": "sem0_m2_u2", "name": "Unit 2: Data Types", "completed": false},
            {"id": "sem0_m2_u3", "name": "Unit 3: Operators", "completed": false},
            {"id": "sem0_m2_u4", "name": "Unit 4: Conditions", "completed": false},
            {"id": "sem0_m2_u5", "name": "Unit 5: Loops", "completed": false},
            {"id": "sem0_m2_u6", "name": "Unit 6: Functions", "completed": false},
            {"id": "sem0_m2_u7", "name": "Unit 7: Arrays", "completed": false},
            {"id": "sem0_m2_u8", "name": "Unit 8: Pointers", "completed": false},
            {"id": "sem0_m2_u9", "name": "Unit 9: References", "completed": false},
            {"id": "sem0_m2_u10", "name": "Unit 10: Classes", "completed": false},
            {"id": "sem0_m2_u11", "name": "Unit 11: Objects", "completed": false},
            {"id": "sem0_m2_u12", "name": "Unit 12: Constructors", "completed": false},
            {"id": "sem0_m2_u13", "name": "Unit 13: Inheritance", "completed": false},
            {"id": "sem0_m2_u14", "name": "Unit 14: Polymorphism", "completed": false},
            {"id": "sem0_m2_u15", "name": "Unit 15: Templates", "completed": false},
            {"id": "sem0_m2_u16", "name": "Unit 16: STL (Standard Template Library)", "completed": false},
            {"id": "sem0_m2_u17", "name": "Unit 17: Smart Pointers", "completed": false},
            {"id": "sem0_m2_u18", "name": "Unit 18: Move Semantics", "completed": false}
          ],
          "projects": [
            {"id": "sem0_p1", "name": "Calculator", "completed": false, "status": "Not Started"},
            {"id": "sem0_p2", "name": "Snake Game", "completed": false, "status": "Not Started"},
            {"id": "sem0_p3", "name": "Banking System", "completed": false, "status": "Not Started"},
            {"id": "sem0_p4", "name": "Inventory System", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem1",
      "name": "Semester 1 — Computer Science",
      "modules": [
        {
          "name": "Core DSA & Systems Concepts",
          "items": [
            {"id": "sem1_m1", "name": "Data Structures Basics", "completed": false},
            {"id": "sem1_m2", "name": "Algorithms & Complexity (Big O)", "completed": false},
            {"id": "sem1_m3", "name": "Recursion & Backtracking", "completed": false},
            {"id": "sem1_m4", "name": "Linked Lists (Single, Double, Circular)", "completed": false},
            {"id": "sem1_m5", "name": "Trees (BST, AVL, Red-Black)", "completed": false},
            {"id": "sem1_m6", "name": "Graphs (DFS, BFS, Dijkstra, A*)", "completed": false},
            {"id": "sem1_m7", "name": "Hash Tables & Collisions", "completed": false},
            {"id": "sem1_m8", "name": "Dynamic Programming (DP)", "completed": false},
            {"id": "sem1_m9", "name": "Multithreading & Concurrency Basics", "completed": false}
          ],
          "projects": [
            {"id": "sem1_p1", "name": "Chess Engine in C++", "completed": false, "status": "Not Started"},
            {"id": "sem1_p2", "name": "Pathfinding Visualizer", "completed": false, "status": "Not Started"},
            {"id": "sem1_p3", "name": "Custom Memory Allocator", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem2",
      "name": "Semester 2 — Mathematics",
      "modules": [
        {
          "name": "Game Math & Physics Fundamentals",
          "items": [
            {"id": "sem2_m1", "name": "Algebra & Equation Solving", "completed": false},
            {"id": "sem2_m2", "name": "Trigonometry & Unit Circle", "completed": false},
            {"id": "sem2_m3", "name": "Geometry & Shapes", "completed": false},
            {"id": "sem2_m4", "name": "Linear Algebra Foundations", "completed": false},
            {"id": "sem2_m5", "name": "Vectors (Dot, Cross product, Normalization)", "completed": false},
            {"id": "sem2_m6", "name": "Matrices (Transformations, Rotation, Scaling)", "completed": false},
            {"id": "sem2_m7", "name": "Quaternions & Gimbal Lock", "completed": false},
            {"id": "sem2_m8", "name": "Physics Basics (Kinematics, Collision, Forces)", "completed": false}
          ],
          "projects": [
            {"id": "sem2_p1", "name": "Physics Sandbox (Rigid body, gravity)", "completed": false, "status": "Not Started"},
            {"id": "sem2_p2", "name": "2D Custom Game Engine", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem3",
      "name": "Semester 3 — Software Engineering",
      "modules": [
        {
          "name": "Design & Software Architecture",
          "items": [
            {"id": "sem3_m1", "name": "Clean Code Principles", "completed": false},
            {"id": "sem3_m2", "name": "SOLID Principles", "completed": false},
            {"id": "sem3_m3", "name": "Creational, Structural & Behavioral Patterns", "completed": false},
            {"id": "sem3_m4", "name": "Game Programming Patterns (Game Loop, Update, State)", "completed": false},
            {"id": "sem3_m5", "name": "Entity Component System (ECS)", "completed": false},
            {"id": "sem3_m6", "name": "Unit Testing & Test-Driven Development (TDD)", "completed": false},
            {"id": "sem3_m7", "name": "Debugging Strategies (Breakpoints, Memory dumps)", "completed": false},
            {"id": "sem3_m8", "name": "Profiling & Optimization Tools", "completed": false}
          ],
          "projects": [
            {"id": "sem3_p1", "name": "Engine Architecture Demo (ECS Implementation)", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem4",
      "name": "Semester 4 — Unreal Engine",
      "modules": [
        {
          "name": "Unreal Editor & Blueprints Blueprint Scripting",
          "items": [
            {"id": "sem4_m1", "name": "Unreal Editor Interface & Navigating", "completed": false},
            {"id": "sem4_m2", "name": "Gameplay Framework (GameMode, Pawn, Character, Controller)", "completed": false},
            {"id": "sem4_m3", "name": "Blueprints Visual Scripting Basics", "completed": false},
            {"id": "sem4_m4", "name": "Materials & Shader Graph Basics", "completed": false},
            {"id": "sem4_m5", "name": "Animation Blueprints & State Machines", "completed": false},
            {"id": "sem4_m6", "name": "Unreal Physics Engine (Collisions, Traces, Ragdolls)", "completed": false},
            {"id": "sem4_m7", "name": "UI Creation with UMG (Widgets, Bindings)", "completed": false},
            {"id": "sem4_m8", "name": "Audio Engine (Sound Cues, MetaSounds)", "completed": false}
          ],
          "projects": [
            {"id": "sem4_p1", "name": "Third Person Action Game (Full Blueprint)", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem5",
      "name": "Semester 5 — Unreal C++",
      "modules": [
        {
          "name": "Unreal Engine Native C++ Integration",
          "items": [
            {"id": "sem5_m1", "name": "UObject Lifecycle & Garbage Collection", "completed": false},
            {"id": "sem5_m2", "name": "AActor & Component Architecture", "completed": false},
            {"id": "sem5_m3", "name": "Delegates (Single, Multi-cast, Dynamic)", "completed": false},
            {"id": "sem5_m4", "name": "Unreal Reflection System (UPROPERTY, UFUNCTION)", "completed": false},
            {"id": "sem5_m5", "name": "AI Systems (Behavior Trees, Blackboard, Navigation)", "completed": false},
            {"id": "sem5_m6", "name": "Inventory Systems in C++", "completed": false},
            {"id": "sem5_m7", "name": "Save Game & Serialization System", "completed": false}
          ],
          "projects": [
            {"id": "sem5_p1", "name": "RPG Prototype in C++", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem6",
      "name": "Semester 6 — Advanced Game Programming",
      "modules": [
        {
          "name": "Advanced Multiplayer & Optimizations",
          "items": [
            {"id": "sem6_m1", "name": "Multiplayer Architecture (Server-Client Model)", "completed": false},
            {"id": "sem6_m2", "name": "Networking Concepts (TCP vs UDP, Latency, Jitter)", "completed": false},
            {"id": "sem6_m3", "name": "Replication (Actor, Variables, RPCs, Ownership)", "completed": false},
            {"id": "sem6_m4", "name": "Rendering Optimization & GPU profiling", "completed": false},
            {"id": "sem6_m5", "name": "Unreal Custom Memory Management & Pool Allocators", "completed": false},
            {"id": "sem6_m6", "name": "Advanced AI Systems (EQS, Utility AI)", "completed": false}
          ],
          "projects": [
            {"id": "sem6_p1", "name": "Multiplayer Shooter Game (Steam/EOS Integrations)", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem7",
      "name": "Semester 7 — Graphics & Engine",
      "modules": [
        {
          "name": "Graphics Programming & Hardware Rendering",
          "items": [
            {"id": "sem7_m1", "name": "Rendering Pipeline (Rasterization, Ray Tracing)", "completed": false},
            {"id": "sem7_m2", "name": "OpenGL Concepts & Setup", "completed": false},
            {"id": "sem7_m3", "name": "DirectX Concepts & Command Buffers", "completed": false},
            {"id": "sem7_m4", "name": "Shader Basics (HLSL/GLSL, Vertex & Fragment Shaders)", "completed": false},
            {"id": "sem7_m5", "name": "Lighting Models (Phong, PBR)", "completed": false},
            {"id": "sem7_m6", "name": "Post Processing Shaders & Screen Space Effects", "completed": false},
            {"id": "sem7_m7", "name": "GPU Debugging (RenderDoc, Pix)", "completed": false}
          ],
          "projects": [
            {"id": "sem7_p1", "name": "Mini Custom Rendering Demo (OpenGL/DirectX)", "completed": false, "status": "Not Started"}
          ]
        }
      ]
    },
    {
      "id": "sem8",
      "name": "Semester 8 — Production & Career",
      "modules": [
        {
          "name": "Professional Production Pipelines & Career Crack",
          "items": [
            {"id": "sem8_m1", "name": "Steam/Console Publishing Procedures", "completed": false},
            {"id": "sem8_m2", "name": "Source Control (Perforce/Git LFS for AAA)", "completed": false},
            {"id": "sem8_m3", "name": "Team Workflows & Production methodologies", "completed": false},
            {"id": "sem8_m4", "name": "Build Systems & CI/CD Pipelines for Unreal", "completed": false},
            {"id": "sem8_m5", "name": "Interview Preparation & Practice (LeetCode, C++, UE5)", "completed": false},
            {"id": "sem8_m6", "name": "Resume & Portfolio polishing", "completed": false}
          ],
          "projects": [
            {"id": "sem8_p1", "name": "Capstone: AAA-Quality Gameplay Demo", "completed": false, "status": "Planned"}
          ]
        }
      ]
    }
  ],
  "portfolio": [
    {"id": "port1", "name": "Calculator (C++)", "semester": "Semester 0", "status": "Planned", "link": ""},
    {"id": "port2", "name": "Snake Game (C++ console)", "semester": "Semester 0", "status": "Planned", "link": ""},
    {"id": "port3", "name": "Banking System (OOP C++)", "semester": "Semester 0", "status": "Planned", "link": ""},
    {"id": "port4", "name": "Inventory System (Data Structures C++)", "semester": "Semester 0", "status": "Planned", "link": ""},
    {"id": "port5", "name": "Chess Engine (Bitboards C++)", "semester": "Semester 1", "status": "Planned", "link": ""},
    {"id": "port6", "name": "Pathfinding Visualizer (A*/Dijkstra)", "semester": "Semester 1", "status": "Planned", "link": ""},
    {"id": "port7", "name": "Physics Sandbox (2D Custom)", "semester": "Semester 2", "status": "Planned", "link": ""},
    {"id": "port8", "name": "Third Person Action Game (BP UE5)", "semester": "Semester 4", "status": "Planned", "link": ""},
    {"id": "port9", "name": "RPG Prototype (C++ & BP UE5)", "semester": "Semester 5", "status": "Planned", "link": ""},
    {"id": "port10", "name": "Multiplayer Shooter Game (EOS UE5 C++)", "semester": "Semester 6", "status": "Planned", "link": ""}
  ],
  "interviewTracker": {
    "cpp": [{"id": "int_cpp_1", "q": "Difference between reference and pointer", "status": "To Learn"}, {"id": "int_cpp_2", "q": "Virtual functions and VTABLE lookup mechanism", "status": "To Learn"}, {"id": "int_cpp_3", "q": "Move Semantics, Rvalues & std::move", "status": "To Learn"}, {"id": "int_cpp_4", "q": "Smart Pointers implementation details (ref count)", "status": "To Learn"}],
    "unreal": [{"id": "int_ue_1", "q": "UObject Lifecycle & Garbage Collection", "status": "To Learn"}, {"id": "int_ue_2", "q": "RPCs (Server, Client, Multicast) & Reliability", "status": "To Learn"}, {"id": "int_ue_3", "q": "Actor replication lifecycle & Net driver", "status": "To Learn"}],
    "dsa": [{"id": "int_dsa_1", "q": "Implement A* pathfinding on grid", "status": "To Learn"}, {"id": "int_dsa_2", "q": "Design a custom Object Pool for bullets", "status": "To Learn"}],
    "patterns": [{"id": "int_pat_1", "q": "Observer Pattern implementation in C++", "status": "To Learn"}, {"id": "int_pat_2", "q": "State Pattern for Player State Machine", "status": "To Learn"}],
    "math": [{"id": "int_math_1", "q": "Dot product vs Cross product in gameplay", "status": "To Learn"}, {"id": "int_math_2", "q": "Explain Quaternions and SLERP", "status": "To Learn"}]
  },
  "readingList": [
    {"id": "book1", "title": "Effective Modern C++", "author": "Scott Meyers", "status": "To Read"},
    {"id": "book2", "title": "Game Programming Patterns", "author": "Robert Nystrom", "status": "To Read"},
    {"id": "book3", "title": "Game Engine Architecture", "author": "Jason Gregory", "status": "To Read"},
    {"id": "book4", "title": "Real-Time Rendering", "author": "Tomas Akenine-Möller", "status": "To Read"},
    {"id": "book5", "title": "Clean Code", "author": "Robert C. Martin", "status": "To Read"},
    {"id": "book6", "title": "Clean Architecture", "author": "Robert C. Martin", "status": "To Read"},
    {"id": "book7", "title": "C++ Concurrency in Action", "author": "Anthony Williams", "status": "To Read"}
  ]
};

// Load progress seed or read from local storage
async function initData() {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
        try {
            const parsed = JSON.parse(localData);
            if (parsed && parsed.semesters && parsed.semesters.length > 0) {
                state = parsed;
                console.log("Loaded student data from localStorage.");
                return;
            } else {
                console.warn("localStorage data has empty semesters. Re-initializing.");
            }
        } catch (e) {
            console.error("Error parsing local student storage data. Loading default.", e);
        }
    }
    
    // Fallback: Fetch progress.json seeded by script, or use inline default if fetch fails
    try {
        const response = await fetch("progress.json");
        if (response.ok) {
            state = await response.json();
            saveState();
            console.log("Seeded student data from progress.json.");
        } else {
            throw new Error("Local server file fetch returned non-ok status.");
        }
    } catch (err) {
        console.warn("Failed to fetch progress.json (likely due to running via file:// protocol). Falling back to inline seed data.", err);
        state = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA)); // Deep clone
        saveState();
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateTopProgressBar();
    renderHeatmap();
}

// Navigation Controllers
function setupNavigation() {
    elements.navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            // Toggle active button (syncing desktop sidebar and mobile bottom nav)
            elements.navButtons.forEach(b => {
                if (b.getAttribute("data-tab") === targetTab) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
            
            // Toggle active panel
            elements.tabPanels.forEach(panel => {
                panel.classList.remove("active");
                if (panel.id === `tab-${targetTab}`) {
                    panel.classList.add("active");
                }
            });
            
            // Save tab preference to localStorage
            localStorage.setItem("AIM_GAMEDEV_ACTIVE_TAB", targetTab);
            
            // Set header title
            const tabTitleMap = {
                academies: "Academies Portal",
                dashboard: "Control Room",
                curriculum: "Roadmap Curriculum",
                portfolio: "Portfolio & Job Strategy",
                quiz: "Quiz Arena",
                lab: "Interactive Laboratory & Sandbox",
                settings: "Configurations & Readings"
            };
            elements.pageTitle.innerText = tabTitleMap[targetTab] || "Gamedev Tracker";
            
            // Update Breadcrumbs
            updateBreadcrumbs(targetTab);
            
            // Redraw vector visualizer grid if entering the lab tab
            if (targetTab === "lab") {
                setTimeout(drawVectorGrid, 50);
            }
        });
    });
}

// Global Helper to switch tabs programmatically
window.switchTab = function(tabName) {
    const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"], .mobile-nav-btn[data-tab="${tabName}"]`);
    if (btn) {
        btn.click();
    }
};

// IA Breadcrumbs trail updater
function updateBreadcrumbs(tabName, activeLessonId = null) {
    if (!elements.breadcrumbsTrail) return;
    
    let crumbs = [];
    crumbs.push(`<a onclick="switchTab('academies')">Academies</a>`);
    
    const academyName = state.activeAcademy === "game-development" ? "Game Dev" : "Other Academy";
    crumbs.push(`<a onclick="switchTab('dashboard')">${academyName}</a>`);
    
    const tabNameMap = {
        academies: "Portal",
        dashboard: "Control Room",
        curriculum: "Curriculum",
        portfolio: "Portfolio",
        quiz: "Quiz Arena",
        lab: "Interactive Lab",
        settings: "Config"
    };
    
    const tabLabel = tabNameMap[tabName] || "Control Room";
    
    if (tabName === "academies") {
        crumbs.push(`<span class="active-crumb">Portal</span>`);
    } else {
        if (activeLessonId) {
            crumbs.push(`<a onclick="switchTab('${tabName}')">${tabLabel}</a>`);
            const lessonData = CODEX_DATA[activeLessonId];
            const title = lessonData ? (lessonData.title.length > 25 ? lessonData.title.slice(0, 22) + "..." : lessonData.title) : "Study";
            crumbs.push(`<span class="active-crumb">${title}</span>`);
        } else {
            crumbs.push(`<span class="active-crumb">${tabLabel}</span>`);
        }
    }
    
    elements.breadcrumbsTrail.innerHTML = crumbs.join(' <span class="separator">/</span> ');
}

// Update Top Progress Bar
function updateTopProgressBar() {
    let totalItems = 0;
    let completedItems = 0;
    
    state.semesters.forEach(sem => {
        sem.modules.forEach(mod => {
            if (mod.items) {
                mod.items.forEach(item => {
                    totalItems++;
                    if (item.completed) completedItems++;
                });
            }
        });
    });
    
    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    elements.overallProgressPct.innerText = `${pct}%`;
    elements.overallProgressFill.style.width = `${pct}%`;
    
    // Update stats on Dashboard page
    if (elements.statCompletedItems) {
        elements.statCompletedItems.innerText = completedItems;
    }
    
    // Update curriculum header info
    if (elements.curriculumChecklistRatio) {
        elements.curriculumChecklistRatio.innerText = `${completedItems} / ${totalItems}`;
    }
    
    // Update curriculum status message
    if (elements.curriculumStatus) {
        let currentSemName = "Semester 0 — Foundation";
        for (let i = 0; i < state.semesters.length; i++) {
            const sem = state.semesters[i];
            let semComplete = true;
            sem.modules.forEach(mod => {
                if (mod.items) {
                    mod.items.forEach(it => {
                        if (!it.completed) semComplete = false;
                    });
                }
            });
            
            if (!semComplete) {
                currentSemName = sem.name.split(" — ")[0];
                break;
            } else {
                currentSemName = "All Semesters Mastered!";
            }
        }
        elements.curriculumStatus.innerText = `Active Phase: ${currentSemName}`;
    }
}

// ----------------------------------------------------
// TAB 1: CONTROL ROOM (DASHBOARD)
// ----------------------------------------------------
function renderDashboard() {
    // 1. Streak
    elements.streakCount.innerText = state.streak || 0;
    
    // 2. Stats
    elements.statHours.innerText = `${(state.totalHours || 0).toFixed(1)}h`;
    
    // 3. Study logs feed
    renderLogsList();
    
    // 4. Reset focus timer display
    resetTimerDisplay();
}

function renderLogsList() {
    if (!state.studyLogs || state.studyLogs.length === 0) {
        elements.historyList.innerHTML = `<p class="empty-state">No logs recorded yet. Begin your study routine to populate this feed!</p>`;
        return;
    }
    
    // Sort logs descending by date
    const sortedLogs = [...state.studyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    elements.historyList.innerHTML = sortedLogs.map((log, index) => `
        <div class="log-item">
            <button class="log-item-delete" onclick="deleteStudyLog('${log.id}')">&times;</button>
            <div class="log-item-header">
                <span>${log.date} — <strong>${log.category}</strong></span>
                <span class="log-item-hours">${log.hours} hours</span>
            </div>
            <div class="log-item-notes">${escapeHTML(log.notes)}</div>
        </div>
    `).join("");
}

// Global helper to delete log
window.deleteStudyLog = function(logId) {
    const logToDelete = state.studyLogs.find(l => l.id === logId);
    if (logToDelete) {
        state.totalHours = Math.max(0, state.totalHours - parseFloat(logToDelete.hours));
        state.studyLogs = state.studyLogs.filter(l => l.id !== logId);
        saveState();
        renderDashboard();
    }
};

function setupDashboardHandlers() {
    // Submit Log Form
    elements.logForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const dateVal = elements.logDate.value;
        const hoursVal = parseFloat(elements.logHours.value);
        const categoryVal = elements.logCategory.value;
        const notesVal = elements.logNotes.value;
        
        if (!dateVal || isNaN(hoursVal) || !notesVal) return;
        
        // 1. Calculate Streak Update
        updateStreak(dateVal);
        
        // 2. Add log entry
        const newLog = {
            id: 'log_' + Date.now(),
            date: dateVal,
            hours: hoursVal,
            category: categoryVal,
            notes: notesVal
        };
        
        state.studyLogs = state.studyLogs || [];
        state.studyLogs.push(newLog);
        state.totalHours = (state.totalHours || 0) + hoursVal;
        
        saveState();
        renderDashboard();
        
        // Reset form
        elements.logHours.value = "";
        elements.logNotes.value = "";
        elements.logDate.value = new Date().toISOString().split('T')[0];
        
        alert("Study log successfully saved! Keep up the momentum.");
    });
    
    // Focus Timer Controls
    elements.btnStartTimer.addEventListener("click", () => {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    elements.btnResetTimer.addEventListener("click", () => {
        resetTimer();
    });
    
    elements.btnToggleTimerMode.addEventListener("click", () => {
        if (currentTimerMode === "weekday") {
            currentTimerMode = "weekend";
            elements.btnToggleTimerMode.innerText = "Switch to Weekday (45m)";
            elements.timerModePill.innerText = "Weekend Sprint";
            timerSecondsRemaining = 60 * 60; // 60 minutes
        } else {
            currentTimerMode = "weekday";
            elements.btnToggleTimerMode.innerText = "Switch to Weekend (60m)";
            elements.timerModePill.innerText = "Weekday Focus";
            timerSecondsRemaining = 45 * 60; // 45 minutes
        }
        updateTimerDisplay();
        if (isTimerRunning) {
            pauseTimer();
        }
    });
}

// Timer State Saving & Resuming
const saveTimerState = () => {
    const timerState = {
        timerSecondsRemaining,
        isTimerRunning,
        currentTimerMode,
        timerLastUpdated: Date.now()
    };
    localStorage.setItem("AIM_GAMEDEV_TIMER_STATE", JSON.stringify(timerState));
};

const loadTimerState = () => {
    const saved = localStorage.getItem("AIM_GAMEDEV_TIMER_STATE");
    if (!saved) return;
    
    try {
        const timerState = JSON.parse(saved);
        currentTimerMode = timerState.currentTimerMode || "weekday";
        
        if (currentTimerMode === "weekday") {
            elements.btnToggleTimerMode.innerText = "Switch to Weekend (60m)";
            elements.timerModePill.innerText = "Weekday Focus";
        } else {
            elements.btnToggleTimerMode.innerText = "Switch to Weekday (45m)";
            elements.timerModePill.innerText = "Weekend Sprint";
        }
        
        timerSecondsRemaining = parseInt(timerState.timerSecondsRemaining);
        
        if (timerState.isTimerRunning) {
            const elapsed = Math.floor((Date.now() - timerState.timerLastUpdated) / 1000);
            timerSecondsRemaining = Math.max(0, timerSecondsRemaining - elapsed);
            
            if (timerSecondsRemaining > 0) {
                startTimer();
            } else {
                timerSecondsRemaining = 0;
                updateTimerDisplay();
                playAudioBeep();
                alert("⏰ Study Session Complete! Great work. Lock in your session hours in the Logger Form.");
                resetTimerDisplay();
                saveTimerState();
            }
        } else {
            updateTimerDisplay();
        }
    } catch (e) {
        console.error("Failed to restore timer state: ", e);
    }
};

// Render GitHub-Style Study Activity Heatmap
const renderHeatmap = () => {
    const container = elements.activityHeatmap;
    if (!container) return;
    
    container.innerHTML = "";
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const totalCells = 84 + dayOfWeek; // 12 full weeks aligned to start on Sunday
    
    const cellsHtml = [];
    const logsMap = {};
    
    if (state.studyLogs) {
        state.studyLogs.forEach(log => {
            logsMap[log.date] = (logsMap[log.date] || 0) + parseFloat(log.hours);
        });
    }
    
    for (let i = totalCells - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0,0,0,0);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        const hours = logsMap[dateKey] || 0;
        
        let level = 0;
        if (hours > 0 && hours < 2) level = 1;
        else if (hours >= 2 && hours < 5) level = 2;
        else if (hours >= 5) level = 3;
        
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = d.toLocaleDateString(undefined, dateOptions);
        
        cellsHtml.push(`
            <div class="heatmap-cell level-${level}" 
                 data-tooltip="${formattedDate}: ${hours.toFixed(1)}h logged"
                 onclick="document.getElementById('log-date').value='${dateKey}'"></div>
        `);
    }
    
    container.innerHTML = cellsHtml.join("");
};

function updateStreak(dateStr) {
    if (!state.lastStudyDate) {
        state.streak = 1;
        state.lastStudyDate = dateStr;
        return;
    }
    
    const lastDate = new Date(state.lastStudyDate);
    const newDate = new Date(dateStr);
    
    // Set time variables to zero for exact day comparisons
    lastDate.setHours(0,0,0,0);
    newDate.setHours(0,0,0,0);
    
    const timeDiff = newDate.getTime() - lastDate.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff === 1) {
        // Consecutive study day!
        state.streak = (state.streak || 0) + 1;
        state.lastStudyDate = dateStr;
    } else if (dayDiff > 1) {
        // Streak broken
        state.streak = 1;
        state.lastStudyDate = dateStr;
    } else if (dayDiff === 0) {
        // Multiple logs on same day, streak unchanged
    } else {
        // Retroactive logging, don't affect streak negatively
    }
}

// Timer Engine
function startTimer() {
    isTimerRunning = true;
    elements.btnStartTimer.innerText = "Pause Session";
    elements.btnStartTimer.classList.remove("btn-primary");
    elements.btnStartTimer.classList.add("btn-secondary");
    saveTimerState();
    
    timerInterval = setInterval(() => {
        timerSecondsRemaining--;
        updateTimerDisplay();
        
        // Save timer state every second to prevent losing track on exit/refresh
        saveTimerState();
        
        if (timerSecondsRemaining <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            elements.btnStartTimer.innerText = "Start Session";
            elements.btnStartTimer.classList.remove("btn-secondary");
            elements.btnStartTimer.classList.add("btn-primary");
            
            playAudioBeep();
            alert("⏰ Study Session Complete! Great work. Lock in your session hours in the Logger Form.");
            resetTimerDisplay();
            saveTimerState();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    elements.btnStartTimer.innerText = "Resume Session";
    elements.btnStartTimer.classList.remove("btn-secondary");
    elements.btnStartTimer.classList.add("btn-primary");
    saveTimerState();
}

function resetTimer() {
    pauseTimer();
    resetTimerDisplay();
    saveTimerState();
}

function resetTimerDisplay() {
    if (currentTimerMode === "weekday") {
        timerSecondsRemaining = 45 * 60;
    } else {
        timerSecondsRemaining = 60 * 60;
    }
    updateTimerDisplay();
    elements.btnStartTimer.innerText = "Start Session";
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSecondsRemaining / 60);
    const secs = timerSecondsRemaining % 60;
    elements.timeDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ----------------------------------------------------
// TAB 2: ROADMAP CURRICULUM
// ----------------------------------------------------
function renderCurriculum() {
    if (!state.semesters || state.semesters.length === 0) {
        elements.semesterAccordionList.innerHTML = `<p class="empty-state">Loading curriculum...</p>`;
        return;
    }
    
    // Read saved open accordions state
    let openSems = [];
    try {
        const saved = localStorage.getItem("AIM_GAMEDEV_OPEN_ACCORDIONS");
        if (saved) openSems = JSON.parse(saved);
    } catch (e) {}
    
    // Fallback: Open Semester 0 by default if nothing saved
    if (openSems.length === 0 && state.semesters[0]) {
        openSems.push(state.semesters[0].id);
    }
    
    elements.semesterAccordionList.innerHTML = state.semesters.map((sem, idx) => {
        // Calculate items completed for this semester
        let totalItems = 0;
        let completedItems = 0;
        
        sem.modules.forEach(mod => {
            if (mod.items) {
                mod.items.forEach(it => {
                    totalItems++;
                    if (it.completed) completedItems++;
                });
            }
        });
        
        const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        const isOpen = openSems.includes(sem.id) ? "open" : "";
        
        return `
            <div class="semester-group ${isOpen}" id="sem-group-${sem.id}">
                <div class="semester-header" onclick="toggleSemesterAccordion('${sem.id}')">
                    <div class="semester-title-box">
                        <span class="semester-toggle-icon">▼</span>
                        <h3>${sem.name}</h3>
                    </div>
                    <span class="semester-progress-pill">${completedItems}/${totalItems} Units (${pct}%)</span>
                </div>
                
                <div class="semester-content">
                    ${sem.modules.map(mod => `
                        <div class="module-group">
                            <h4 class="module-title">${mod.name}</h4>
                            <div class="module-items-grid">
                                ${(mod.items || []).map((item, itemIdx, itemsArr) => {
                                    const hasCodex = CODEX_DATA[item.id] !== undefined;
                                    const isLocked = itemIdx > 0 && !itemsArr[itemIdx - 1].completed;
                                    
                                    if (isLocked) {
                                        return `
                                        <div class="checklist-item-wrapper locked-item" data-tooltip="Complete previous unit to unlock">
                                            <div class="checklist-item locked">
                                                <div class="checklist-item-left">
                                                    <span class="item-lock-icon">🔒</span>
                                                    <span class="item-name">${item.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        `;
                                    }
                                    
                                    const LESSON_MAP = {
                                        "sem0_m2_u1": { course: "cpp", lesson: "variables" },
                                        "sem0_m2_u8": { course: "cpp", lesson: "pointers" },
                                        "sem0_m2_u9": { course: "cpp", lesson: "references" },
                                        "sem2_m5": { course: "math", lesson: "vectors" }
                                    };
                                    
                                    const lessonInfo = LESSON_MAP[item.id];
                                    const lessonButton = lessonInfo ? `<a href="lesson.html#/lesson/${lessonInfo.course}/${lessonInfo.lesson}" target="_blank" class="btn btn-outline btn-xs btn-lesson" style="margin-left: 6px; border-color: rgba(255, 0, 127, 0.3); color: var(--neon-magenta);" onclick="event.stopPropagation();">🎓 Lesson</a>` : '';

                                    return `
                                    <div class="checklist-item-wrapper">
                                        <div class="checklist-item ${item.completed ? 'completed' : ''}">
                                            <div class="checklist-item-left">
                                                <div class="custom-checkbox" onclick="event.stopPropagation(); toggleRoadmapItem('${sem.id}', '${item.id}')">
                                                    <div class="checkmark"></div>
                                                </div>
                                                <span class="item-name" onclick="event.stopPropagation(); openStudyDrawer('${item.id}')">${item.name}</span>
                                            </div>
                                            <div style="display: flex; gap: 4px;">
                                                ${hasCodex ? `<button class="btn btn-outline btn-xs btn-codex" onclick="event.stopPropagation(); openStudyDrawer('${item.id}')">📖 Study</button>` : ''}
                                                ${lessonButton}
                                            </div>
                                        </div>
                                    </div>
                                    `;
                                }).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    }).join("");
    
    updateTopProgressBar();
}

window.toggleSemesterAccordion = function(semId) {
    const semElement = document.getElementById(`sem-group-${semId}`);
    if (semElement) {
        semElement.classList.toggle("open");
        
        // Save current accordion states
        const openElements = document.querySelectorAll(".semester-group.open");
        const openIds = Array.from(openElements).map(el => el.id.replace("sem-group-", ""));
        localStorage.setItem("AIM_GAMEDEV_OPEN_ACCORDIONS", JSON.stringify(openIds));
    }
};

window.toggleRoadmapItem = function(semId, itemId) {
    state.semesters.forEach(sem => {
        if (sem.id === semId) {
            sem.modules.forEach(mod => {
                mod.items.forEach(item => {
                    if (item.id === itemId) {
                        item.completed = !item.completed;
                    }
                });
            });
        }
    });
    
    saveState();
    renderCurriculum();
};

// ----------------------------------------------------
// TAB 3: PORTFOLIO & INTERVIEWS
// ----------------------------------------------------
function renderPortfolioAndInterviews() {
    // 1. Render Projects
    if (state.portfolio && state.portfolio.length > 0) {
        elements.portfolioProjectList.innerHTML = state.portfolio.map(proj => `
            <div class="project-item">
                <div class="project-meta">
                    <h4>${proj.name}</h4>
                    <span class="project-sem">${proj.semester}</span>
                </div>
                <select class="project-status-selector" onchange="updateProjectStatus('${proj.id}', this.value)">
                    <option value="Planned" ${proj.status === 'Planned' ? 'selected' : ''}>Planned</option>
                    <option value="In Progress" ${proj.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Complete" ${proj.status === 'Complete' ? 'selected' : ''}>Complete</option>
                    <option value="Published" ${proj.status === 'Published' ? 'selected' : ''}>Published</option>
                </select>
            </div>
        `).join("");
    }
    
    // 2. Render Interviews initial category
    setupInterviewTabs();
    renderInterviewCategory("cpp");
}

window.updateProjectStatus = function(projId, statusVal) {
    state.portfolio.forEach(proj => {
        if (proj.id === projId) {
            proj.status = statusVal;
            proj.completed = (statusVal === 'Complete' || statusVal === 'Published');
        }
    });
    saveState();
};

function setupInterviewTabs() {
    const tabs = elements.interviewCategoryTabs.querySelectorAll(".category-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const cat = tab.getAttribute("data-cat");
            renderInterviewCategory(cat);
        });
    });
}

function renderInterviewCategory(cat) {
    const questions = state.interviewTracker[cat] || [];
    if (questions.length === 0) {
        elements.interviewQuestionsList.innerHTML = `<p class="empty-state">No questions populated for this category.</p>`;
        return;
    }
    
    elements.interviewQuestionsList.innerHTML = questions.map(q => `
        <div class="interview-item" onclick="toggleInterviewQuestionStatus('${cat}', '${q.id}')" style="cursor:pointer">
            <p>${q.q}</p>
            <span class="semester-progress-pill" style="color: ${q.status === 'Mastered' ? 'var(--color-success)' : 'var(--neon-magenta)'}; border-color: ${q.status === 'Mastered' ? 'rgba(0,230,118,0.2)' : 'rgba(255,0,127,0.2)'}; background: ${q.status === 'Mastered' ? 'rgba(0,230,118,0.05)' : 'rgba(255,0,127,0.05)'}">
                ${q.status}
            </span>
        </div>
    `).join("");
}

window.toggleInterviewQuestionStatus = function(cat, qId) {
    state.interviewTracker[cat].forEach(q => {
        if (q.id === qId) {
            q.status = q.status === "Mastered" ? "To Learn" : "Mastered";
        }
    });
    saveState();
    renderInterviewCategory(cat);
};

// ----------------------------------------------------
// TAB 4: QUIZ ARENA
// ----------------------------------------------------
window.startQuiz = function(topic) {
    quizQuestions = QUIZ_BANK[topic] || [];
    if (quizQuestions.length === 0) return;
    
    quizCurrentIndex = 0;
    quizScore = 0;
    
    elements.quizIntro.classList.add("hidden");
    elements.quizQuestionBox.classList.remove("hidden");
    elements.quizResultBox.classList.add("hidden");
    
    quizTimerSecs = 0;
    elements.quizTimer.innerText = "Time: 0s";
    clearInterval(quizTimerInterval);
    quizTimerInterval = setInterval(() => {
        quizTimerSecs++;
        elements.quizTimer.innerText = `Time: ${quizTimerSecs}s`;
    }, 1000);
    
    loadQuizQuestion();
};

function loadQuizQuestion() {
    const qData = quizQuestions[quizCurrentIndex];
    elements.quizProgressText.innerText = `Question ${quizCurrentIndex + 1} of ${quizQuestions.length}`;
    elements.quizQuestionText.innerText = qData.q;
    
    elements.quizExplanationBox.classList.add("hidden");
    quizSelectedOptionIndex = null;
    
    elements.quizOptionsContainer.innerHTML = qData.options.map((opt, idx) => `
        <button class="quiz-option-btn" onclick="submitQuizAnswer(${idx})">${escapeHTML(opt)}</button>
    `).join("");
}

window.submitQuizAnswer = function(optIdx) {
    if (quizSelectedOptionIndex !== null) return; // Prevent double submit
    
    quizSelectedOptionIndex = optIdx;
    const qData = quizQuestions[quizCurrentIndex];
    const buttons = elements.quizOptionsContainer.querySelectorAll(".quiz-option-btn");
    
    const isCorrect = (optIdx === qData.correct);
    if (isCorrect) {
        quizScore++;
        buttons[optIdx].classList.add("correct");
        elements.explanationStatus.innerText = "✅ Correct!";
        elements.explanationStatus.className = "explanation-title correct";
    } else {
        buttons[optIdx].classList.add("incorrect");
        buttons[qData.correct].classList.add("correct");
        elements.explanationStatus.innerText = "❌ Incorrect";
        elements.explanationStatus.className = "explanation-title incorrect";
    }
    
    // Disable all options
    buttons.forEach(btn => btn.disabled = true);
    
    // Show explanation
    elements.explanationText.innerText = qData.exp;
    elements.quizExplanationBox.classList.remove("hidden");
    
    if (quizCurrentIndex === quizQuestions.length - 1) {
        elements.quizNextBtn.innerText = "Complete Quiz";
    } else {
        elements.quizNextBtn.innerText = "Next Question";
    }
};

elements.quizNextBtn.addEventListener("click", () => {
    if (quizCurrentIndex < quizQuestions.length - 1) {
        quizCurrentIndex++;
        loadQuizQuestion();
    } else {
        // Complete Quiz
        clearInterval(quizTimerInterval);
        elements.quizQuestionBox.classList.add("hidden");
        elements.quizResultBox.classList.remove("hidden");
        
        elements.quizScoreVal.innerText = quizScore;
        elements.quizTotalVal.innerText = quizQuestions.length;
        
        if (quizScore === quizQuestions.length) {
            elements.quizVerdict.innerText = "👑 Flawless performance! You are demonstrating AAA coding standard.";
        } else if (quizScore >= 3) {
            elements.quizVerdict.innerText = "👍 Good result. You understand the core dynamics, but review your modules to prevent debugging stutters.";
        } else {
            elements.quizVerdict.innerText = "⚠️ Review necessary. Go back to Semester 0 notes or C++ compiler sandbox and practice.";
        }
    }
});

window.resetQuizArena = function() {
    elements.quizIntro.classList.remove("hidden");
    elements.quizQuestionBox.classList.add("hidden");
    elements.quizResultBox.classList.add("hidden");
};

// ----------------------------------------------------
// TAB 5: CONFIG & BOOKS (SETTINGS)
// ----------------------------------------------------
function renderSettings() {
    if (state.readingList && state.readingList.length > 0) {
        elements.readingListContainer.innerHTML = state.readingList.map(book => `
            <div class="book-item" onclick="toggleBookStatus('${book.id}')">
                <span class="book-icon">${book.status === 'Read' ? '✅' : '📖'}</span>
                <div class="book-meta">
                    <div class="book-title" style="${book.status === 'Read' ? 'text-decoration: line-through; color: var(--color-text-muted)' : ''}">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                </div>
                <span class="semester-progress-pill">${book.status}</span>
            </div>
        `).join("");
    }
}

window.toggleBookStatus = function(bookId) {
    state.readingList.forEach(book => {
        if (book.id === bookId) {
            book.status = book.status === "Read" ? "To Read" : "Read";
        }
    });
    saveState();
    renderSettings();
};

function setupBackupHandlers() {
    // Export File
    elements.btnExportData.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "progress.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });
    
    // Import Trigger
    elements.btnImportTrigger.addEventListener("click", () => {
        elements.importFileInput.click();
    });
    
    elements.importFileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const parsed = JSON.parse(evt.target.result);
                
                // Simple validation check
                if (parsed.semesters && parsed.portfolio) {
                    state = parsed;
                    saveState();
                    
                    // Reload all panels
                    renderDashboard();
                    renderCurriculum();
                    renderPortfolioAndInterviews();
                    renderSettings();
                    
                    alert("Import successful! Progress database restored.");
                } else {
                    alert("Invalid progress.json schema. Make sure it contains semesters/portfolio database.");
                }
            } catch (err) {
                alert("Failed to parse JSON file. Ensure it is a valid progress.json.");
            }
        };
        reader.readAsText(file);
    });
}

// Global String Escaper
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ----------------------------------------------------
// CURRICULUM STUDY DRAWER PLATFORM
// ----------------------------------------------------
let activeDrawerItemId = null;
let drawerQuizScore = 0;
let drawerQuizIndex = 0;
let drawerQuizQuestions = [];
let drawerSelectedOptionIdx = null;

window.openStudyDrawer = async function(itemId) {
    activeDrawerItemId = itemId;
    const data = CODEX_DATA[itemId];
    if (!data) return;
    
    // 1. Resolve Semester and Module Meta
    let semName = "Roadmap Curriculum";
    let modName = "General Study";
    state.semesters.forEach(sem => {
        sem.modules.forEach(mod => {
            mod.items.forEach(it => {
                if (it.id === itemId) {
                    semName = sem.name.split(" — ")[0];
                    modName = mod.name.split(" — ")[0];
                }
            });
        });
    });
    
    // 2. Set Basic Texts
    document.getElementById("drawer-sem-name").innerText = semName;
    document.getElementById("drawer-mod-name").innerText = modName;
    document.getElementById("drawer-title").innerText = data.title;
    document.getElementById("drawer-concept-text").innerText = data.concept;
    document.getElementById("drawer-code-text").innerText = data.code;
    document.getElementById("drawer-trap-text").innerText = data.trap;
    
    // 3. Resolve and Fetch Workspace File
    const filePath = getWorkspaceFilePath(itemId);
    document.getElementById("drawer-file-path").innerText = `File: ${filePath || 'N/A'}`;
    const fileContentEl = document.getElementById("drawer-file-content");
    const warningBox = document.getElementById("drawer-file-warning");
    const warningText = document.getElementById("drawer-file-warning-text");
    
    fileContentEl.innerText = "Loading file from local workspace directory...";
    warningBox.classList.add("hidden");
    
    if (filePath) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                const text = await response.text();
                fileContentEl.innerText = text;
            } else {
                throw new Error("File not found or access denied.");
            }
        } catch (err) {
            fileContentEl.innerText = `// File not loaded: ${filePath}\n// Double click or open in your desktop editor to view/edit directly.`;
            warningText.innerHTML = `No workspace file detected at: <br><strong style="font-family:var(--font-mono);font-size:11px;">${filePath}</strong><br>To integrate, create this file inside your local project folder!`;
            warningBox.classList.remove("hidden");
        }
    } else {
        fileContentEl.innerText = "// No file mapped for this unit.";
    }
    
    // 4. Setup Micro Quiz State
    drawerQuizQuestions = data.quiz || [];
    drawerQuizScore = 0;
    drawerQuizIndex = 0;
    
    const quizContainer = document.getElementById("drawer-quiz-container");
    const quizFeedback = document.getElementById("drawer-quiz-feedback");
    const quizResult = document.getElementById("drawer-quiz-result");
    
    quizContainer.classList.remove("hidden");
    quizFeedback.classList.add("hidden");
    quizResult.classList.add("hidden");
    
    if (drawerQuizQuestions.length > 0) {
        loadDrawerQuizQuestion();
    } else {
        quizContainer.innerHTML = `<p class="empty-state">No self-test available for this unit. Use the mark button below to track progress.</p>`;
    }
    
    // 5. Update Footer Mastery Button
    updateDrawerFooterButton();
    
    // 6. Switch Tab to Learn & Slide open Drawer
    switchDrawerTab("learn");
    document.getElementById("study-drawer").classList.add("open");
    document.getElementById("drawer-overlay").classList.add("active");
    updateBreadcrumbs(localStorage.getItem("AIM_GAMEDEV_ACTIVE_TAB") || "curriculum", itemId);
};

window.closeStudyDrawer = function() {
    document.getElementById("study-drawer").classList.remove("open");
    document.getElementById("study-drawer").classList.remove("maximized");
    document.getElementById("drawer-overlay").classList.remove("active");
    activeDrawerItemId = null;
    updateBreadcrumbs(localStorage.getItem("AIM_GAMEDEV_ACTIVE_TAB") || "curriculum");
};

window.setupStudyDrawerHandlers = function() {
    // Tab switching
    const tabButtons = document.querySelectorAll(".drawer-tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-drawer-tab");
            switchDrawerTab(targetTab);
        });
    });
    
    // Footer button
    const footerBtn = document.getElementById("drawer-mastery-toggle-btn");
    if (footerBtn) {
        footerBtn.addEventListener("click", () => {
            if (activeDrawerItemId) {
                markItemMastery(activeDrawerItemId);
            }
        });
    }
    
    // Next quiz button
    const nextBtn = document.getElementById("drawer-quiz-next-btn");
    if (nextBtn) {
        nextBtn.addEventListener("click", nextDrawerQuizQuestion);
    }
    
    // Quiz final mark button
    const quizMarkBtn = document.getElementById("drawer-quiz-master-btn");
    if (quizMarkBtn) {
        quizMarkBtn.addEventListener("click", () => {
            if (activeDrawerItemId) {
                markItemMastery(activeDrawerItemId, true);
                closeStudyDrawer();
            }
        });
    }
};

function switchDrawerTab(tabName) {
    const tabButtons = document.querySelectorAll(".drawer-tab-btn");
    tabButtons.forEach(btn => {
        if (btn.getAttribute("data-drawer-tab") === tabName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    const panels = document.querySelectorAll(".drawer-tab-panel");
    panels.forEach(panel => {
        if (panel.id === `drawer-panel-${tabName}`) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    });
}

function loadDrawerQuizQuestion() {
    const qData = drawerQuizQuestions[drawerQuizIndex];
    const container = document.getElementById("drawer-quiz-container");
    const feedback = document.getElementById("drawer-quiz-feedback");
    
    feedback.classList.add("hidden");
    drawerSelectedOptionIdx = null;
    
    container.innerHTML = `
        <div class="drawer-quiz-question">${qData.q}</div>
        <div class="drawer-quiz-options">
            ${qData.options.map((opt, idx) => `
                <button class="drawer-quiz-option" onclick="submitDrawerQuizAnswer(${idx})">${escapeHTML(opt)}</button>
            `).join("")}
        </div>
    `;
}

window.submitDrawerQuizAnswer = function(optIdx) {
    if (drawerSelectedOptionIdx !== null) return;
    drawerSelectedOptionIdx = optIdx;
    
    const qData = drawerQuizQuestions[drawerQuizIndex];
    const optionsList = document.querySelectorAll(".drawer-quiz-option");
    const feedback = document.getElementById("drawer-quiz-feedback");
    const statusText = document.getElementById("drawer-quiz-status");
    const explanationText = document.getElementById("drawer-quiz-explanation");
    const nextBtn = document.getElementById("drawer-quiz-next-btn");
    
    optionsList.forEach(btn => btn.disabled = true);
    
    const isCorrect = (optIdx === qData.correct);
    if (isCorrect) {
        drawerQuizScore++;
        optionsList[optIdx].classList.add("correct");
        statusText.innerText = "✅ Correct!";
        statusText.className = "explanation-title correct";
    } else {
        optionsList[optIdx].classList.add("incorrect");
        optionsList[qData.correct].classList.add("correct");
        statusText.innerText = "❌ Incorrect";
        statusText.className = "explanation-title incorrect";
    }
    
    explanationText.innerText = qData.exp;
    feedback.classList.remove("hidden");
    
    if (drawerQuizIndex === drawerQuizQuestions.length - 1) {
        nextBtn.innerText = "Complete Self-Test";
    } else {
        nextBtn.innerText = "Next Question";
    }
};

function nextDrawerQuizQuestion() {
    if (drawerQuizIndex < drawerQuizQuestions.length - 1) {
        drawerQuizIndex++;
        loadDrawerQuizQuestion();
    } else {
        completeDrawerQuiz();
    }
}

function completeDrawerQuiz() {
    document.getElementById("drawer-quiz-container").classList.add("hidden");
    document.getElementById("drawer-quiz-feedback").classList.add("hidden");
    
    const result = document.getElementById("drawer-quiz-result");
    const scoreVal = document.getElementById("drawer-quiz-score");
    const totalVal = document.getElementById("drawer-quiz-total");
    const verdict = document.getElementById("drawer-quiz-verdict");
    const masterBtn = document.getElementById("drawer-quiz-master-btn");
    
    scoreVal.innerText = drawerQuizScore;
    totalVal.innerText = drawerQuizQuestions.length;
    result.classList.remove("hidden");
    
    if (drawerQuizScore === drawerQuizQuestions.length) {
        verdict.innerText = "👑 Perfect score! You have fully mastered these concepts.";
        masterBtn.classList.remove("hidden");
        playAudioBeep(); // Success chime
    } else {
        verdict.innerText = "⚠️ You missed some questions. Review the study guide and retry the self-test.";
        masterBtn.classList.add("hidden");
    }
}

window.markItemMastery = function(itemId, forceState) {
    let itemRef = null;
    let semRefId = "";
    state.semesters.forEach(sem => {
        sem.modules.forEach(mod => {
            mod.items.forEach(item => {
                if (item.id === itemId) {
                    itemRef = item;
                    semRefId = sem.id;
                }
            });
        });
    });
    
    if (itemRef) {
        const targetState = (forceState !== undefined) ? forceState : !itemRef.completed;
        if (targetState !== itemRef.completed) {
            itemRef.completed = targetState;
            if (itemRef.completed) {
                playAudioBeep();
            }
            saveState();
            renderCurriculum();
        }
    }
    
    updateDrawerFooterButton();
};

function updateDrawerFooterButton() {
    let itemRef = null;
    state.semesters.forEach(sem => {
        sem.modules.forEach(mod => {
            mod.items.forEach(item => {
                if (item.id === activeDrawerItemId) {
                    itemRef = item;
                }
            });
        });
    });
    
    const footerBtn = document.getElementById("drawer-mastery-toggle-btn");
    if (footerBtn && itemRef) {
        if (itemRef.completed) {
            footerBtn.innerText = "Mark as Incomplete";
            footerBtn.style.background = "var(--bg-panel)";
            footerBtn.style.borderColor = "var(--neon-magenta)";
            footerBtn.style.color = "var(--neon-magenta)";
        } else {
            footerBtn.innerText = "Mark Chapter as Mastered";
            footerBtn.style.background = "var(--neon-cyan)";
            footerBtn.style.borderColor = "var(--neon-cyan)";
            footerBtn.style.color = "var(--bg-dark)";
        }
    }
}

function getWorkspaceFilePath(itemId) {
    const parts = itemId.split('_');
    if (parts.length < 2) return '';
    
    const sem = parts[0]; 
    const type = parts[1]; 
    
    const semFolders = {
        sem0: "semester_0_foundation",
        sem1: "semester_1_cs",
        sem2: "semester_2_math",
        sem3: "semester_3_engineering",
        sem4: "semester_4_unreal_editor",
        sem5: "semester_5_unreal_cpp",
        sem6: "semester_6_advanced",
        sem7: "semester_7_graphics",
        sem8: "semester_8_production"
    };
    
    const folder = semFolders[sem];
    if (!folder) return '';
    
    if (sem === 'sem0') {
        if (type === 'm1') {
            const chapNum = parts[2].replace('c', '');
            const chapNames = {
                '1': "chapter_1_how_computers_work.md",
                '2': "chapter_2_operating_systems.md",
                '3': "chapter_3_developer_setup.md"
            };
            return `semesters/${folder}/module_1_fundamentals/${chapNames[chapNum] || ''}`;
        } else if (type === 'm2') {
            if (parts[2].startsWith('u')) {
                const unitNum = parts[2].replace('u', '').padStart(2, '0');
                const unitNames = {
                    '01': "unit_01_variables.cpp",
                    '08': "unit_08_pointers.cpp",
                    '10': "unit_10_classes.cpp",
                    '17': "unit_17_smart_pointers.cpp"
                };
                return `semesters/${folder}/module_2_modern_cpp/units/${unitNames[unitNum] || 'unit_' + unitNum + '.cpp'}`;
            }
        }
    }
    
    // Fallback paths for all other semesters and items:
    if (sem === 'sem1') {
        const num = type.replace('m', '');
        return `semesters/${folder}/dsa/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem2') {
        const num = type.replace('m', '');
        return `semesters/${folder}/math/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem3') {
        const num = type.replace('m', '');
        return `semesters/${folder}/design_patterns/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem4') {
        const num = type.replace('m', '');
        return `semesters/${folder}/blueprints/unit_${num.padStart(2, '0')}.txt`;
    }
    if (sem === 'sem5') {
        const num = type.replace('m', '');
        return `semesters/${folder}/unreal_cpp/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem6') {
        const num = type.replace('m', '');
        return `semesters/${folder}/multiplayer/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem7') {
        const num = type.replace('m', '');
        return `semesters/${folder}/graphics/unit_${num.padStart(2, '0')}.cpp`;
    }
    if (sem === 'sem8') {
        const num = type.replace('m', '');
        return `semesters/${folder}/career/unit_${num.padStart(2, '0')}.txt`;
    }
    
    return `semesters/${folder}/notes_${itemId}.txt`;
}

// ----------------------------------------------------
// VECTOR LABORATORY (MATH VISUALIZER)
// ----------------------------------------------------
let vectorState = {
    a: { x: 4, y: 3 },  // Vector A Cartesian endpoint
    b: { x: -3, y: 5 }, // Vector B Cartesian endpoint
    activeHandle: null  // \"a\" or \"b\" during drag
};
const GRID_SCALE = 20;

const initVectorLab = () => {
    const canvas = elements.vectorCanvas;
    if (!canvas) return;
    
    // Reset vectors handler
    if (elements.btnResetVectors) {
        elements.btnResetVectors.addEventListener("click", () => {
            vectorState.a = { x: 4, y: 3 };
            vectorState.b = { x: -3, y: 5 };
            drawVectorGrid();
        });
    }
    
    // Mouse and Touch listeners
    const getCanvasMousePos = (evt) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX = evt.clientX;
        let clientY = evt.clientY;
        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };
    
    const handleStart = (evt) => {
        const pos = getCanvasMousePos(evt);
        const originX = canvas.width / 2;
        const originY = canvas.height / 2;
        
        const aCanvas = { x: originX + vectorState.a.x * GRID_SCALE, y: originY - vectorState.a.y * GRID_SCALE };
        const bCanvas = { x: originX + vectorState.b.x * GRID_SCALE, y: originY - vectorState.b.y * GRID_SCALE };
        
        const distA = Math.hypot(pos.x - aCanvas.x, pos.y - aCanvas.y);
        const distB = Math.hypot(pos.x - bCanvas.x, pos.y - bCanvas.y);
        
        if (distA < 15) {
            vectorState.activeHandle = "a";
            evt.preventDefault();
        } else if (distB < 15) {
            vectorState.activeHandle = "b";
            evt.preventDefault();
        }
    };
    
    const handleMove = (evt) => {
        if (!vectorState.activeHandle) return;
        
        const pos = getCanvasMousePos(evt);
        const originX = canvas.width / 2;
        const originY = canvas.height / 2;
        
        let rawCartX = (pos.x - originX) / GRID_SCALE;
        let rawCartY = (originY - pos.y) / GRID_SCALE;
        
        let cartX = Math.max(-9.5, Math.min(9.5, Math.round(rawCartX * 2) / 2));
        let cartY = Math.max(-9.5, Math.min(9.5, Math.round(rawCartY * 2) / 2));
        
        if (vectorState.activeHandle === "a") {
            vectorState.a = { x: cartX, y: cartY };
        } else {
            vectorState.b = { x: cartX, y: cartY };
        }
        
        drawVectorGrid();
        evt.preventDefault();
    };
    
    const handleEnd = () => {
        vectorState.activeHandle = null;
    };
    
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleEnd);
    
    drawVectorGrid();
};

const drawVectorGrid = () => {
    const canvas = elements.vectorCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;
    
    // Draw background grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = GRID_SCALE; x < canvas.width; x += GRID_SCALE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = GRID_SCALE; y < canvas.height; y += GRID_SCALE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw Cartesian Axes
    ctx.strokeStyle = "rgba(102, 252, 241, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, originY);
    ctx.lineTo(canvas.width - 10, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 10);
    ctx.lineTo(originX, canvas.height - 10);
    ctx.stroke();
    
    // Axis arrows
    ctx.fillStyle = "rgba(102, 252, 241, 0.25)";
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, originY - 4);
    ctx.lineTo(canvas.width, originY);
    ctx.lineTo(canvas.width - 10, originY + 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(originX - 4, 10);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 4, 10);
    ctx.fill();
    
    // Vector pixel endpoints
    const aX = originX + vectorState.a.x * GRID_SCALE;
    const aY = originY - vectorState.a.y * GRID_SCALE;
    const bX = originX + vectorState.b.x * GRID_SCALE;
    const bY = originY - vectorState.b.y * GRID_SCALE;
    
    // Math calculations
    const dotVal = vectorState.a.x * vectorState.b.x + vectorState.a.y * vectorState.b.y;
    const crossVal = vectorState.a.x * vectorState.b.y - vectorState.a.y * vectorState.b.x;
    
    const magA = Math.hypot(vectorState.a.x, vectorState.a.y);
    const magB = Math.hypot(vectorState.b.x, vectorState.b.y);
    
    if (elements.outputVecA) elements.outputVecA.innerText = `(${vectorState.a.x.toFixed(1)}, ${vectorState.a.y.toFixed(1)})`;
    if (elements.outputVecB) elements.outputVecB.innerText = `(${vectorState.b.x.toFixed(1)}, ${vectorState.b.y.toFixed(1)})`;
    if (elements.outputDot) elements.outputDot.innerText = dotVal.toFixed(2);
    if (elements.outputCross) elements.outputCross.innerText = crossVal.toFixed(2);
    
    // Draw projection helper lines
    if (magB > 0.001) {
        const scaleProj = dotVal / (magB * magB);
        const projX = originX + (vectorState.b.x * scaleProj) * GRID_SCALE;
        const projY = originY - (vectorState.b.y * scaleProj) * GRID_SCALE;
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(projX, projY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(aX, aY);
        ctx.lineTo(projX, projY);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // Draw Vector A (Cyan Vector)
    ctx.strokeStyle = "var(--neon-cyan)";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "var(--neon-cyan)";
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(aX, aY);
    ctx.stroke();
    
    // Draw Vector B (Magenta Vector)
    ctx.strokeStyle = "var(--neon-magenta)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "var(--neon-magenta)";
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(bX, bY);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    const drawArrowhead = (fromX, fromY, toX, toY, color) => {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
        ctx.fill();
    };
    drawArrowhead(originX, originY, aX, aY, "var(--neon-cyan)");
    drawArrowhead(originX, originY, bX, bY, "var(--neon-magenta)");
    
    // Draw interactive handles
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "var(--neon-cyan)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(aX, aY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    ctx.strokeStyle = "var(--neon-magenta)";
    ctx.beginPath();
    ctx.arc(bX, bY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    
    updateMathExplanations(dotVal, crossVal, magA, magB);
};

const updateMathExplanations = (dot, cross, magA, magB) => {
    let title = "Orthogonal (Perpendicular)";
    let desc = "The angle between Vector A and Vector B is exactly 90 degrees. Their dot product is 0.";
    let app = "Dot product is 0. Surface normals are perpendicular. Perfect for checking collision bounds!";
    
    if (dot > 0.05) {
        title = "Acute Angle (Facing Same General Direction)";
        desc = `The angle is acute (< 90°). Their dot product is positive (${dot.toFixed(2)}).`;
        app = `In gameplay code, this means the enemy is in front of the player's facing vector. (If dot > 0.707, it falls inside your 90° field of view).`;
    } else if (dot < -0.05) {
        title = "Obtuse Angle (Facing Opposite Directions)";
        desc = `The angle is obtuse (> 90°). Their dot product is negative (${dot.toFixed(2)}).`;
        app = `In gameplay code, this signifies the enemy is behind the player (e.g. invalidates backstab check or stealth attack trigger).`;
    }
    
    const crossNormalized = Math.abs(cross) / (magA * magB || 1);
    if (crossNormalized < 0.05) {
        title = dot > 0 ? "Collinear / Parallel (Same direction)" : "Collinear / Anti-Parallel (Opposite direction)";
        desc = `Vectors are collinear. Their cross product is close to 0 (${cross.toFixed(2)}).`;
        app = `Parallel vectors check alignment: perfect for projectile trajectories aligning to target tracks.`;
    }
    
    if (elements.mathRelationTitle) elements.mathRelationTitle.innerText = `Vectors Relation: ${title}`;
    if (elements.mathExplanationText) elements.mathExplanationText.innerText = desc;
    if (elements.mathApplicationText) elements.mathApplicationText.innerText = app;
};

// ----------------------------------------------------
// THE CODE ARENA (SANDBOX SYSTEM)
// ----------------------------------------------------
const initCodeArena = () => {
    if (!elements.challengeSelector) return;
    
    elements.challengeSelector.addEventListener("change", (e) => {
        loadChallenge(e.target.value);
    });
    
    if (elements.btnRunCode) {
        elements.btnRunCode.addEventListener("click", () => {
            runChallengeTests();
        });
    }
    
    if (elements.btnResetCode) {
        elements.btnResetCode.addEventListener("click", () => {
            const currentChal = elements.challengeSelector.value;
            if (CODE_CHALLENGES[currentChal]) {
                elements.codeEditor.value = CODE_CHALLENGES[currentChal].template;
                elements.consoleOutput.innerText = "Editor reset to challenge template.";
                elements.consoleOutput.style.color = "#8da2c4";
            }
        });
    }
    
    loadChallenge("vec_normalize");
};

const loadChallenge = (challengeKey) => {
    const data = CODE_CHALLENGES[challengeKey];
    if (!data) return;
    
    if (elements.challengeTitle) elements.challengeTitle.innerText = data.title;
    if (elements.challengeDescription) elements.challengeDescription.innerText = data.desc;
    if (elements.codeEditor) elements.codeEditor.value = data.template;
    if (elements.consoleOutput) {
        elements.consoleOutput.innerText = "Write your solution above and click 'Run Test Suite'.";
        elements.consoleOutput.style.color = "#8da2c4";
    }
};

const runChallengeTests = () => {
    const currentChalKey = elements.challengeSelector.value;
    const challenge = CODE_CHALLENGES[currentChalKey];
    if (!challenge) return;
    
    const code = elements.codeEditor.value;
    elements.consoleOutput.innerText = "Compiling algorithm... Running test cases...\n";
    elements.consoleOutput.style.color = "#8da2c4";
    
    setTimeout(() => {
        try {
            const resultMsg = challenge.test(code);
            elements.consoleOutput.innerText += `\nSUCCESS:\n${resultMsg}`;
            elements.consoleOutput.style.color = "var(--color-success)";
            playAudioBeep();
        } catch (err) {
            elements.consoleOutput.innerText += `\nASSERTION FAILED / INTERPRETATION ERROR:\n${err.message}`;
            elements.consoleOutput.style.color = "var(--neon-magenta)";
        }
    }, 300);
};

// ----------------------------------------------------
// AAA MOCK BOARD INTERVIEW SIMULATOR
// ----------------------------------------------------
let interviewIndex = 0;
let interviewAnswers = [];
let interviewPassCount = 0;

window.startMockInterview = () => {
    elements.quizIntro.classList.add("hidden");
    elements.quizQuestionBox.classList.add("hidden");
    elements.quizResultBox.classList.add("hidden");
    
    const interviewBox = document.getElementById("interview-question-box");
    if (interviewBox) {
        interviewBox.classList.remove("hidden");
        interviewIndex = 0;
        interviewAnswers = [];
        interviewPassCount = 0;
        loadInterviewQuestion();
    }
};

window.closeMockInterview = () => {
    const interviewBox = document.getElementById("interview-question-box");
    if (interviewBox) {
        interviewBox.classList.add("hidden");
    }
    elements.quizIntro.classList.remove("hidden");
};

const loadInterviewQuestion = () => {
    const qData = MOCK_INTERVIEWS[interviewIndex];
    const progress = document.getElementById("interview-progress-text");
    const questionText = document.getElementById("interview-question-text");
    const answerInput = document.getElementById("interview-answer-input");
    const evalBox = document.getElementById("interview-evaluation-box");
    
    if (progress) progress.innerText = `AAA Mock Board Interview - Question ${interviewIndex + 1} of ${MOCK_INTERVIEWS.length}`;
    if (questionText) questionText.innerText = `Interviewer: ${qData.q}`;
    if (answerInput) {
        answerInput.value = "";
        answerInput.disabled = false;
    }
    if (evalBox) evalBox.classList.add("hidden");
    
    const submitBtn = document.getElementById("btn-submit-interview-ans");
    if (submitBtn) {
        submitBtn.style.display = "block";
        submitBtn.innerText = "Submit Answer & Self-Assess";
        submitBtn.onclick = submitInterviewAnswer;
    }
};

const submitInterviewAnswer = () => {
    const answerInput = document.getElementById("interview-answer-input");
    if (answerInput) answerInput.disabled = true;
    
    const evalBox = document.getElementById("interview-evaluation-box");
    const rubricText = document.getElementById("interview-rubric-text");
    const refCode = document.getElementById("interview-ref-code");
    const submitBtn = document.getElementById("btn-submit-interview-ans");
    
    if (submitBtn) submitBtn.style.display = "none";
    
    const qData = MOCK_INTERVIEWS[interviewIndex];
    // Replace escaped \n sequences with real newlines for readable display
    if (rubricText) rubricText.innerText = (qData.rubric || "").replace(/\\n/g, "\n");
    if (refCode) refCode.innerText = (qData.refCode || "").replace(/\\n/g, "\n");
    
    if (evalBox) evalBox.classList.remove("hidden");
};

window.gradeInterviewQuestion = (didPass) => {
    if (didPass) interviewPassCount++;
    
    if (interviewIndex < MOCK_INTERVIEWS.length - 1) {
        interviewIndex++;
        loadInterviewQuestion();
    } else {
        const interviewBox = document.getElementById("interview-question-box");
        if (interviewBox) interviewBox.classList.add("hidden");
        
        elements.quizResultBox.classList.remove("hidden");
        elements.quizScoreVal.innerText = interviewPassCount;
        elements.quizTotalVal.innerText = MOCK_INTERVIEWS.length;
        
        if (interviewPassCount === MOCK_INTERVIEWS.length) {
            elements.quizVerdict.innerText = "👑 Outstanding, Khaja! You hit every core rubric metric. This is AAA studio interview calibre.";
        } else if (interviewPassCount >= 2) {
            elements.quizVerdict.innerText = "👍 Solid effort, Khaja. You nailed some key architecture answers — keep deepening your math and engine internals.";
        } else {
            elements.quizVerdict.innerText = "⚠️ Keep grinding, Khaja. Drill memory layouts, cache misses, and Quaternions until they are second nature.";
        }
        playAudioBeep();
    }
};

// ----------------------------------------------------
// STATIC DATABASES (CHALLENGES, CODEX, INTERVIEWS)
// ----------------------------------------------------
const CODE_CHALLENGES = {
    vec_normalize: {
        title: "Vector Normalization (Linear Algebra)",
        desc: "Write a function \`normalize(v)\` that returns a new vector normalized to a magnitude of exactly 1.0. The input is an object \`{x, y}\` representing a 2D vector. If the input magnitude is 0, return \`{x: 0, y: 0}\`.",
        template: `function normalize(v) {
    // 1. Calculate vector magnitude (length) using Pythagorean theorem
    // 2. If magnitude is 0, return {x: 0, y: 0}
    // 3. Return a new object dividing x and y by the magnitude
    
}`,
        test: function(funcStr) {
            const normalize = new Function("return " + funcStr)();
            const v1 = normalize({x: 3, y: 4});
            if (!v1 || Math.abs(v1.x - 0.6) > 0.001 || Math.abs(v1.y - 0.8) > 0.001) {
                throw new Error("Failed test: normalize({x: 3, y: 4}) should return {x: 0.6, y: 0.8}, got " + JSON.stringify(v1));
            }
            const v2 = normalize({x: 0, y: 0});
            if (!v2 || v2.x !== 0 || v2.y !== 0) {
                throw new Error("Failed test: normalize({x: 0, y: 0}) should return {x: 0, y: 0}, got " + JSON.stringify(v2));
            }
            return "All tests passed successfully! Vector Normalized perfectly.";
        }
    },
    dot_product: {
        title: "Enemy Angle Check (Dot Product)",
        desc: "Write a function \`isEnemyInFOV(forwardX, forwardY, dirX, dirY)\` that determines if an enemy is within the player's 90-degree Field-of-View sector (i.e. angle <= 45 degrees, which corresponds to a dot product > 0.707). Both the player's forward vector and the direction vector to the enemy are already normalized. Return \`true\` or \`false\`.",
        template: `function isEnemyInFOV(forwardX, forwardY, dirX, dirY) {
    // 1. Compute dot product of two normalized vectors: (x1*x2 + y1*y2)
    // 2. Return true if the result is greater than 0.707, else false
    
}`,
        test: function(funcStr) {
            const isEnemyInFOV = new Function("return " + funcStr)();
            if (isEnemyInFOV(0, 1, 0, 1) !== true) {
                throw new Error("Failed test: Enemy straight ahead (0,1) and forward (0,1) should be in FOV.");
            }
            if (isEnemyInFOV(1, 0, 0, 1) !== false) {
                throw new Error("Failed test: Enemy perpendicular offset (90 deg) should not be in FOV.");
            }
            if (isEnemyInFOV(0.707, 0.707, 0.6, 0.8) !== true) {
                throw new Error("Failed test: Enemy inside 45-degree angle should return true.");
            }
            return "All tests passed successfully! Enemy vision calculation correct.";
        }
    },
    unique_ptr: {
        title: "Emulate C++ unique_ptr Lifecycle",
        desc: "Write a class 'UniquePointer' representing C++ unique_ptr behavior. It takes a 'resource' in the constructor. Implement a 'move(other)' method that transfers ownership of the resource from the 'other' UniquePointer instance to this instance, setting 'other.resource' to null.",
        template: `class UniquePointer {
    constructor(resource) {
        this.resource = resource;
    }
    move(other) {
        // Transfer resource ownership from 'other' to 'this'
        // Set 'other.resource' to null
        
    }
}`,
        test: function(funcStr) {
            // Wrap in parens so 'return (class ...)' is valid
            let UniquePointer;
            try {
                UniquePointer = new Function("return (" + funcStr + ")")();
            } catch(e) {
                throw new Error("Syntax Error — check your class definition: " + e.message);
            }
            const p1 = new UniquePointer("MonsterMesh");
            const p2 = new UniquePointer(null);
            p2.move(p1);
            if (p2.resource !== "MonsterMesh") {
                throw new Error("Failed test: Destination pointer did not receive ownership.");
            }
            if (p1.resource !== null) {
                throw new Error("Failed test: Source pointer was not set to null (memory leak).");
            }
            return "All tests passed successfully! unique_ptr C++ move lifecycle correctly emulated.";
        }
    },
    binary_search: {
        title: "Fast Inventory Search (Binary Search)",
        desc: "Implement a fast 'binarySearch(arr, targetId)' function that searches for targetId in a sorted integer array 'arr' and returns its index. Return -1 if not found. Time complexity must be O(log N).",
        template: `function binarySearch(arr, targetId) {
    let left = 0;
    let right = arr.length - 1;
    // Implement binary search loop...
    
    return -1;
}`,
        test: function(funcStr) {
            const binarySearch = new Function("return " + funcStr)();
            const inv = [102, 205, 301, 404, 508, 612];
            if (binarySearch(inv, 404) !== 3) {
                throw new Error("Failed test: binarySearch(inv, 404) should return 3.");
            }
            if (binarySearch(inv, 102) !== 0) {
                throw new Error("Failed test: binarySearch(inv, 102) should return 0.");
            }
            if (binarySearch(inv, 999) !== -1) {
                throw new Error("Failed test: binarySearch(inv, 999) should return -1.");
            }
            return "All tests passed successfully! Binary search executing in O(log N) complexity.";
        }
    }
};

const CODEX_DATA = EXHAUSTIVE_CODEX_DATA;

const MOCK_INTERVIEWS = [
    {
        q: "What is Gimbal Lock, and how do Quaternions avoid it?",
        rubric: "1. Defined Gimbal Lock: The loss of a degree of freedom when two of the three rotation axes align.\\n2. Explained why Quaternions avoid it: Quaternions represent rotations as a point on a 4D unit hyper-sphere rather than individual pitch/yaw/roll rotations, avoiding alignment locks.\\n3. Mentioned SLERP: Quaternions support smooth spherical linear interpolation.",
        refCode: "// Euler rotations accumulate alignment locks\\nFRotator EulerRot = MyActor->GetActorRotation();\\n\\n// Quaternions use 4D complex coordinates\\nFQuat ActorQuat = MyActor->GetActorQuat();\\nFQuat SlerpedQuat = FQuat::Slerp(StartQuat, EndQuat, Alpha);"
    },
    {
        q: "Design an Object Pool class concept in C++ to prevent memory fragmentation when constantly spawning and deleting bullets.",
        rubric: "1. Pre-allocation: Allocate a continuous buffer (std::vector or array) of bullets during engine initialization.\\n2. Reusability: Active bullets are updated in the game loop; inactive bullets are returned to the pool (marked inactive) without freeing memory.\\n3. Cache contiguity: Contiguous pre-allocated bullets prevent memory fragmentation and cache misses.",
        refCode: "class BulletPool {\\n    std::vector<Bullet> m_pool;\\npublic:\\n    BulletPool(size_t count) : m_pool(count) {}\\n    Bullet* Acquire() {\\n        for(auto& b : m_pool) {\\n            if(!b.active) { b.active = true; return &b; }\\n        }\\n        return nullptr; // Pool exhausted\\n    }\\n};"
    },
    {
        q: "Explain VTABLE lookup in C++. What is its performance impact on gameplay code?",
        rubric: "1. Vptr: Each object of a class containing virtual functions has a virtual table pointer (vptr) hidden at the start of its memory.\\n2. Double Dereference: The CPU must look up the object, fetch the vptr, access the VTABLE array, and read the function pointer.\\n3. Cache Miss: Since the VTABLE resides elsewhere in memory, dereferencing it often triggers CPU cache stalls and prevents compiler inlining.",
        refCode: "class Base { virtual void Update(); }; // Has VTABLE\\nclass Derived : public Base { void Update() override; };\\n\\nBase* ptr = new Derived();\\nptr->Update(); // Dynamic dispatch VTABLE lookup!"
    }
];

// ==========================================================================
// INFORMATION ARCHITECTURE & NAVIGATION LOGIC ENGINE (PRD 1)
// ==========================================================================

// Global state variables
let activeSearchFilter = 'all';

// Academy Swapper Engine
window.switchAcademy = function(academySlug) {
    if (academySlug !== "game-development") {
        alert("The selected academy is currently locked. Complete Game Development University first!");
        return;
    }
    
    state.activeAcademy = academySlug;
    saveState();
    
    // Sync dropdown triggers & classes
    syncAcademyDropdownUI(academySlug);
    
    // Sync active academy label inside Academies tab
    const activeAcademyLbl = document.getElementById("active-academy-lbl");
    if (activeAcademyLbl) {
        activeAcademyLbl.innerText = "Game Development University";
    }
    
    // Update progress numbers inside Academies card
    updateAcademyPortalProgress();
    
    // Auto-navigate to dashboard or refresh views
    switchTab("dashboard");
    renderCurriculum();
    
    console.log("Switched to Academy: " + academySlug);
};

// Premium Custom Academy Dropdown Toggle
window.toggleAcademyDropdown = function(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("academy-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("active");
    }
};

// Sync triggers, icons, logo suffixes, and active menu classes
window.syncAcademyDropdownUI = function(academySlug) {
    const activeName = document.getElementById("active-academy-name");
    const activeIcon = document.getElementById("active-academy-icon");
    const logoSuffix = document.getElementById("logo-academy-suffix");
    
    if (academySlug === "game-development") {
        if (activeName) activeName.innerText = "Game Dev University";
        if (activeIcon) activeIcon.innerText = "🎮";
        if (logoSuffix) logoSuffix.innerText = "GAME DEV";
    }
    
    // Reset and assign active class to selection item
    const items = document.querySelectorAll(".academy-dropdown-item");
    items.forEach(item => {
        if (item.id === `dropdown-item-${academySlug}`) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

// Close academy dropdown if clicked outside the panel boundaries
document.addEventListener("click", () => {
    const dropdown = document.getElementById("academy-dropdown");
    if (dropdown) {
        dropdown.classList.remove("active");
    }
});


// Calculates and sets progress bar values on the Academies Selection tab
function updateAcademyPortalProgress() {
    let totalItems = 0;
    let completedItems = 0;
    
    state.semesters.forEach(sem => {
        sem.modules.forEach(mod => {
            if (mod.items) {
                mod.items.forEach(item => {
                    totalItems++;
                    if (item.completed) completedItems++;
                });
            }
        });
    });
    
    const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    const gameDevPct = document.getElementById("game-dev-progress-pct");
    const gameDevFill = document.getElementById("game-dev-progress-fill");
    
    if (gameDevPct) gameDevPct.innerText = `${pct}%`;
    if (gameDevFill) gameDevFill.style.width = `${pct}%`;
}

// Intercept data seeds to update initial portal percentages
const originalUpdateTopProgressBar = updateTopProgressBar;
updateTopProgressBar = function() {
    originalUpdateTopProgressBar();
    updateAcademyPortalProgress();
};

// Global Search Overlay Handlers
window.toggleGlobalSearch = function() {
    const modal = elements.searchModal;
    if (!modal) return;
    
    modal.classList.toggle("active");
    if (modal.classList.contains("active")) {
        setTimeout(() => elements.searchInput.focus(), 50);
        filterSearchResults();
    } else {
        elements.searchInput.value = "";
    }
};

window.closeGlobalSearch = function(event) {
    if (event.target === elements.searchModal) {
        toggleGlobalSearch();
    }
};

window.setSearchFilter = function(filter) {
    activeSearchFilter = filter;
    
    // Toggle active styles on search filter chips
    const chips = document.querySelectorAll(".filter-chip");
    chips.forEach(chip => {
        if (chip.id === `chip-${filter === 'bookmark' ? 'bookmarks' : filter === 'lesson' ? 'lessons' : filter === 'quiz' ? 'quizzes' : filter === 'project' ? 'projects' : filter === 'interview' ? 'interviews' : 'all'}`) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });
    
    filterSearchResults();
};

window.filterSearchResults = function() {
    const query = elements.searchInput.value.toLowerCase().trim();
    const resultsContainer = elements.searchResultsList;
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = "";
    let matches = [];
    
    // 1. Scan Codex Lessons
    for (const [itemId, itemData] of Object.entries(CODEX_DATA)) {
        if (activeSearchFilter !== 'all' && activeSearchFilter !== 'lesson' && activeSearchFilter !== 'bookmark') continue;
        
        // Match Bookmarks filter only if item is marked bookmarked in state
        if (activeSearchFilter === 'bookmark') {
            const isBookmarked = state.readingList && state.readingList.some(b => b.id === itemId && b.status === "Read"); // Or checks list
            // Let's fallback: verify if it matches bookmarks in reading list or custom notes
            // Since bookmark status resides in a general list, let's match codex items
        }
        
        const titleMatch = itemData.title.toLowerCase().includes(query);
        const conceptMatch = itemData.concept.toLowerCase().includes(query);
        const codeMatch = itemData.code && itemData.code.toLowerCase().includes(query);
        
        if (titleMatch || conceptMatch || codeMatch) {
            matches.push({
                type: 'lesson',
                title: itemData.title,
                meta: 'Chapter Unit • ' + itemData.concept.slice(0, 75) + '...',
                action: `openStudyDrawer('${itemId}'); toggleGlobalSearch();`
            });
        }
    }
    
    // 2. Scan Quizzes in Codex
    for (const [itemId, itemData] of Object.entries(CODEX_DATA)) {
        if (activeSearchFilter !== 'all' && activeSearchFilter !== 'quiz') continue;
        
        if (itemData.quiz) {
            itemData.quiz.forEach((qItem, qIdx) => {
                if (qItem.q.toLowerCase().includes(query) || qItem.exp.toLowerCase().includes(query)) {
                    matches.push({
                        type: 'quiz',
                        title: `Quiz: ${qItem.q.slice(0, 50)}...`,
                        meta: `Self-Test Quiz inside unit: ${itemData.title}`,
                        action: `openStudyDrawer('${itemId}'); switchDrawerTab('quiz'); toggleGlobalSearch();`
                    });
                }
            });
        }
    }
    
    // 3. Scan Portfolio Projects
    if (state.portfolio && (activeSearchFilter === 'all' || activeSearchFilter === 'project')) {
        state.portfolio.forEach(proj => {
            if (proj.name.toLowerCase().includes(query) || proj.semester.toLowerCase().includes(query)) {
                matches.push({
                    type: 'project',
                    title: proj.name,
                    meta: `Portfolio Milestone Project • ${proj.semester} (${proj.status})`,
                    action: `switchTab('portfolio'); toggleGlobalSearch();`
                });
            }
        });
    }
    
    // 4. Scan Interview Prep Questions
    if (state.interviewTracker && (activeSearchFilter === 'all' || activeSearchFilter === 'interview')) {
        for (const [cat, qList] of Object.entries(state.interviewTracker)) {
            qList.forEach(qItem => {
                if (qItem.q.toLowerCase().includes(query)) {
                    matches.push({
                        type: 'interview',
                        title: qItem.q,
                        meta: `AAA Interview Prep • Category: ${cat.toUpperCase()} (${qItem.status})`,
                        action: `switchTab('portfolio'); renderInterviewCategory('${cat}'); toggleGlobalSearch();`
                    });
                }
            });
        }
    }
    
    // Limit matches length to 20 for performance
    const limitedMatches = matches.slice(0, 20);
    
    if (limitedMatches.length === 0) {
        resultsContainer.innerHTML = `<div class="search-empty">No results match your search parameters. Try adjusting filters or terms.</div>`;
        return;
    }
    
    resultsContainer.innerHTML = limitedMatches.map(m => `
        <div class="search-result-item" onclick="${m.action}">
            <div>
                <div class="result-title">${escapeHTML(m.title)}</div>
                <div class="result-meta">${escapeHTML(m.meta)}</div>
            </div>
            <span class="result-tag ${m.type}">${m.type}</span>
        </div>
    `).join("");
};

// Command Palette Overlay Handlers
window.toggleCommandPalette = function() {
    const palette = elements.commandPalette;
    if (!palette) return;
    palette.classList.toggle("active");
};

window.closeCommandPalette = function(event) {
    if (event.target === elements.commandPalette) {
        toggleCommandPalette();
    }
};

window.triggerPaletteCommand = function(cmd) {
    toggleCommandPalette();
    
    switch (cmd) {
        case 'timer_start':
            if (elements.btnStartTimer) elements.btnStartTimer.click();
            break;
        case 'timer_mode':
            if (elements.btnToggleTimerMode) elements.btnToggleTimerMode.click();
            break;
        case 'backup_export':
            if (elements.btnExportData) elements.btnExportData.click();
            break;
        case 'backup_import':
            if (elements.btnImportTrigger) elements.btnImportTrigger.click();
            break;
        case 'vector_reset':
            if (elements.btnResetVectors) elements.btnResetVectors.click();
            break;
        case 'sound_toggle':
            if (elements.soundFxToggle) {
                elements.soundFxToggle.checked = !elements.soundFxToggle.checked;
                elements.soundFxToggle.dispatchEvent(new Event('change'));
                alert("Audio Chimes are now " + (elements.soundFxToggle.checked ? "Enabled" : "Disabled"));
            }
            break;
        default:
            console.warn("Unknown command palette trigger: " + cmd);
    }
};

// Dynamic Keyboard Shortcut Routing
document.addEventListener("keydown", (e) => {
    // 1. Ctrl + K / Cmd + K -> Search modal toggle
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleGlobalSearch();
    }
    
    // 2. Shift + A -> Command palette toggle
    if (e.shiftKey && e.key.toLowerCase() === 'a') {
        // Prevent typing A in text boxes
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            toggleCommandPalette();
        }
    }
    
    // 3. Escape -> Close modals and overlay drawers
    if (e.key === 'Escape') {
        if (elements.searchModal && elements.searchModal.classList.contains("active")) {
            toggleGlobalSearch();
        }
        if (elements.commandPalette && elements.commandPalette.classList.contains("active")) {
            toggleCommandPalette();
        }
        if (document.getElementById("study-drawer").classList.contains("open")) {
            closeStudyDrawer();
        }
    }
    
    // 4. Alt + 1-6 -> Tab Swapping
    if (e.altKey && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        const tabsList = ['dashboard', 'curriculum', 'portfolio', 'quiz', 'lab', 'settings', 'academies'];
        // Alt+1 = dashboard, Alt+2 = academies, Alt+3 = curriculum, Alt+4 = portfolio, Alt+5 = quiz, Alt+6 = settings
        const tabKeyMapping = {
            '1': 'dashboard',
            '2': 'academies',
            '3': 'curriculum',
            '4': 'portfolio',
            '5': 'quiz',
            '6': 'settings'
        };
        const targetTab = tabKeyMapping[e.key];
        if (targetTab) {
            switchTab(targetTab);
        }
    }
    
    // 5. Alt + L -> Toggle maximize/expand study drawer
    if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const drawer = document.getElementById("study-drawer");
        if (drawer && drawer.classList.contains("open")) {
            drawer.classList.toggle("maximized");
        }
    }
    
    // 6. Ctrl + ArrowRight / ArrowLeft -> Sequential tab switches
    if (e.ctrlKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const tabs = ['dashboard', 'academies', 'curriculum', 'portfolio', 'quiz', 'lab', 'settings'];
        const currentActive = localStorage.getItem("AIM_GAMEDEV_ACTIVE_TAB") || "dashboard";
        let currentIndex = tabs.indexOf(currentActive);
        if (currentIndex !== -1) {
            e.preventDefault();
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % tabs.length;
            } else {
                currentIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }
            switchTab(tabs[currentIndex]);
        }
    }
    
    // 7. Local Modal Shortcuts (only triggered when command palette is closed and not typing in input fields)
    if (e.altKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        switch (e.key.toLowerCase()) {
            case 't':
                e.preventDefault();
                if (elements.btnStartTimer) elements.btnStartTimer.click();
                break;
            case 'm':
                e.preventDefault();
                if (elements.btnToggleTimerMode) elements.btnToggleTimerMode.click();
                break;
            case 'e':
                e.preventDefault();
                if (elements.btnExportData) elements.btnExportData.click();
                break;
            case 'i':
                e.preventDefault();
                if (elements.btnImportTrigger) elements.btnImportTrigger.click();
                break;
            case 'r':
                e.preventDefault();
                if (elements.btnResetVectors) elements.btnResetVectors.click();
                break;
            case 's':
                e.preventDefault();
                if (elements.soundFxToggle) {
                    elements.soundFxToggle.checked = !elements.soundFxToggle.checked;
                    elements.soundFxToggle.dispatchEvent(new Event('change'));
                }
                break;
        }
    }
});
