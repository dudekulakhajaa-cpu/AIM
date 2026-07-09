// Exhaustive Game Dev Codex Database
// Aiming for world-class Gameplay Programmer standard (AAA Studio readiness)

const EXHAUSTIVE_CODEX_DATA = {
  // ==========================================
  // SEMESTER 0: PROGRAMMING FOUNDATION
  // ==========================================
  "sem0_m1_c1": {
    title: "How Computers Work",
    concept: "CPU registers operate in < 1 cycle. Caches (L1/L2/L3) store adjacent memory (spatial locality) to prevent CPU stalls (RAM fetches take 200+ cycles). Contiguous memory layout (arrays, std::vector) ensures cache line prefetching. Linked structures scatter memory, causing cache misses.",
    code: `// Contiguous vector iteration - Cache Friendly
std::vector<int> data(1000000);
int sum = 0;
for(int x : data) {
    sum += x; // Cache line prefetching loads adjacent values
}

// Non-contiguous layout (Linked List) - Cache Killer
struct Node { int val; Node* next; };`,
    trap: "Interviewer asks: 'Why is std::vector faster than std::list for linear searches if both are O(N)?' Do NOT say 'because index access is O(1)'—linear search visits every item sequentially. The correct answer is cache locality: vector elements are contiguous in RAM, while list nodes are scattered, causing constant CPU cache misses.",
    quiz: [
      {
        q: "What is the typical access latency of CPU L1 cache compared to main system RAM?",
        options: ["~1 cycle vs ~200+ cycles", "~50 cycles vs ~100 cycles", "Equal speed", "L1 is slower than RAM"],
        correct: 0,
        exp: "L1 cache runs at the core clock speed, taking around 1 cycle, while fetching data from RAM requires a bus transition, stalling the CPU for 200+ cycles."
      },
      {
        q: "Which layout guarantees spatial locality in memory?",
        options: ["std::list", "std::vector", "std::unordered_map", "std::set"],
        correct: 1,
        exp: "std::vector guarantees that all elements are allocated in a single contiguous block of heap memory, ensuring L1/L2 prefetchers pull adjacent elements on access."
      }
    ]
  },
  "sem0_m1_c2": {
    title: "Operating Systems & Threading",
    concept: "Processes run in isolated virtual memory address spaces. Threads share the process's memory space but have independent execution stacks. Race conditions occur when multiple threads access and mutate shared memory concurrently. We use atomic operations or synchronization primitives to protect shared data.",
    code: `#include <atomic>
#include <thread>

// Thread-safe atomic increment (atomic instructions mapped to CPU lock prefix)
std::atomic<int> g_spawnedEnemies{0};

void SpawnEnemy() {
    g_spawnedEnemies.fetch_add(1, std::memory_order_relaxed);
}`,
    trap: "Interviewer asks: 'What is the runtime overhead of a mutex lock?' Mutexes involve syscalls and CPU context switches if locked (kernel mode transition), which takes thousands of cycles. In game loops, use lock-free programming, task graphs, or atomics (`std::atomic`) instead of mutexes whenever possible.",
    quiz: [
      {
        q: "What memory resource is unique to each thread within a single process?",
        options: ["Heap space", "Global variables", "Stack space", "Virtual file descriptors"],
        correct: 2,
        exp: "Each thread has its own execution stack to store local variables and function return addresses. Heap and global memory are shared."
      },
      {
        q: "Why are raw mutexes avoided in performance-critical rendering loops?",
        options: ["They do not work in C++", "They block execution and trigger expensive OS kernel-mode context switches", "They increase memory size by 2GB", "They render incorrect colors"],
        correct: 1,
        exp: "If a thread fails to acquire a mutex, it yields its timeslice to the OS scheduler. This context switch is too slow for 60/120fps engine loops."
      }
    ]
  },
  "sem0_m1_c3": {
    title: "Developer Setup & Toolchain",
    concept: "C++ development requires a compiler (MSVC/Clang), build system (CMake/MSBuild), debugger, and version control (Git). Compiler optimizations (O2/O3) inline functions, unroll loops, and vectorize instructions. Debugging relies on debug symbols (PDBs) which map compiled assembly back to C++ source lines.",
    code: `# Compiler switches (MSVC: /O2 release, /Od debug /Zi symbols)
# Example CMake build configuration
project(GameEngine CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_FLAGS_RELEASE "\${CMAKE_CXX_FLAGS_RELEASE} /O2 /Oi") # Max speed, intrinsic functions`,
    trap: "Interviewer asks: 'Why did my debug build show a pointer as valid, but the release build crashed with Access Violation?' Debug builds initialize variables to default patterns (like 0xCDCDCDCD) and add stack guards. Release builds optimize these away, exposing uninitialized pointers or memory corruption.",
    quiz: [
      {
        q: "What is the purpose of PDB files on Windows?",
        options: ["To store texture maps", "To store debug symbols that map machine code back to source lines", "To run Git commands", "To optimize compilation speed"],
        correct: 1,
        exp: "PDB (Program Database) files hold debugging symbols, mapping assembly instructions and memory offsets to class, variable, and line names in your IDE."
      },
      {
        q: "Which flag represents compiler optimization for speed in MSVC?",
        options: ["/Od", "/Zi", "/O2", "/RTC1"],
        correct: 2,
        exp: "/O2 compiles with maximum speed optimizations, while /Od disables optimizations for easier step-by-step debugging."
      }
    ]
  },
  "sem0_m2_u1": {
    title: "C++ Variables & Memory Allocation",
    concept: "Variables map symbols to physical memory coordinates. Stack variables are scoped, super-fast to allocate (pointer increment), and automatically cleaned. Heap variables (`new`/`malloc`) are allocated dynamically, slower to construct, and must be freed manually, risking memory leaks.",
    code: `void StackVSHeap() {
    int stackVar = 5; // Stack: automatically cleaned at scope exit
    int* heapVar = new int(10); // Heap: allocated dynamically
    
    delete heapVar; // Clean heap allocation to prevent leaks
}`,
    trap: "Interviewer asks: 'What happens if you return a reference to a local stack variable?' The stack frame is popped when the function returns, making the reference point to junk memory (dangling reference), causing undefined behavior or crashes.",
    quiz: [
      {
        q: "Where is a variable declared with 'new' allocated?",
        options: ["CPU cache", "The Stack", "The Heap", "Read-only data segment"],
        correct: 2,
        exp: "'new' allocates memory dynamically on the heap. You must manually delete it to prevent memory leaks."
      },
      {
        q: "What is the consequence of returning a reference to a local variable?",
        options: ["Compile error", "It runs faster", "Undefined behavior, as the stack address is invalidated upon return", "The memory size is doubled"],
        correct: 2,
        exp: "Returning a reference to a local variable results in a dangling reference because the variable goes out of scope and its stack memory is reclaimed."
      }
    ]
  },
  "sem0_m2_u2": {
    title: "C++ Data Types & Memory Sizes",
    concept: "Modern C++ has specific size primitives. Integral types differ in size: `char` (1 byte), `short` (2 bytes), `int` (4 bytes), `long long` (8 bytes). Floating types: `float` (4 bytes, single precision), `double` (8 bytes). Explicitly sized types (`uint32_t`, `int16_t`) in `<cstdint>` are crucial for cross-platform network packet serialization.",
    code: `#include <cstdint>

struct NetworkPacket {
    uint32_t sequence;  // Exactly 4 bytes
    uint8_t packetType; // Exactly 1 byte
    float positionX;    // 4 bytes single-precision float
};`,
    trap: "Interviewer asks: 'How many bytes is an int?' Never say 'always 4 bytes'. The C++ standard only guarantees minimum sizes. It depends on compiler architecture (usually 4 bytes on modern 64-bit systems). Say: 'To guarantee exact sizes, I use types from <cstdint> like int32_t.'",
    quiz: [
      {
        q: "Which type header guarantees cross-platform memory widths?",
        options: ["<iostream>", "<cstdint>", "<memory>", "<vector>"],
        correct: 1,
        exp: "<cstdint> provides exact-width integer definitions like int32_t, uint64_t, and uint8_t."
      },
      {
        q: "What is the precision difference between float and double in memory?",
        options: ["float is 4 bytes (24-bit mantissa), double is 8 bytes (53-bit mantissa)", "float is 8 bytes, double is 4 bytes", "They are identical", "float is integer, double is decimal"],
        correct: 0,
        exp: "Floats use 4 bytes of memory, offering ~7 decimal digits of precision. Doubles use 8 bytes, offering ~15-17 digits, essential for planetary-scale game coordinate systems."
      }
    ]
  },
  "sem0_m2_u3": {
    title: "C++ Operators & Bitwise Tricks",
    concept: "Operators process data. Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) manipulate binary data directly. Gameplay systems use bit fields for compact flags (saving network bandwidth) and bit masks to categorize physics collision filters (e.g., player, bullet, floor).",
    code: `const uint32_t LAYER_PLAYER = 1 << 0; // 0001
const uint32_t LAYER_ENEMY  = 1 << 1; // 0010
const uint32_t LAYER_BULLET = 1 << 2; // 0100

// Combine filters
uint32_t collisionMask = LAYER_PLAYER | LAYER_BULLET; // 0101

// Check flags
bool canCollide = (collisionMask & LAYER_PLAYER) != 0;`,
    trap: "Interviewer asks: 'How do you check if an integer is a power of two using a single line?' Use the bitwise check: `bool isPowerOfTwo = (x > 0) && ((x & (x - 1)) == 0);`. This avoids expensive floating-point functions like `std::log2` or loop divisions.",
    quiz: [
      {
        q: "What is the result of '5 << 1'?",
        options: ["2.5", "10", "4", "6"],
        correct: 1,
        exp: "Bitwise left shifting a number by 1 bit multiplies it by 2. 5 (0101) shifted left becomes 10 (1010)."
      },
      {
        q: "How are physics layers checked for overlap?",
        options: ["String comparison", "Bitwise AND operation (&) between layers and collision masks", "Double divisions", "Vector cross product"],
        correct: 1,
        exp: "Bitwise AND checks if any bits match. If (LayerA & MaskB) is non-zero, a collision response is triggered, executing in 1 CPU cycle."
      }
    ]
  },
  "sem0_m2_u4": {
    title: "C++ Control Flow & CPU Branch Prediction",
    concept: "Conditions check execution paths. The CPU pipeline uses branch prediction to speculate next instructions. Random branches stall the CPU pipeline if mispredicted, costing 15-20 cycles. Sorting search data makes branches predictable, boosting performance.",
    code: `// Branchless coding tricks for gameplay loops
int maxVal(int a, int b) {
    // Avoids branch instructions completely
    return a - ((a - b) & ((a - b) >> 31)); 
}`,
    trap: "Interviewer asks: 'Why is sorting a massive array before running a threshold check faster than checking unsorted data?' Sorted data allows the hardware branch predictor to predict the outcome of condition checks correctly, avoiding pipeline stalls.",
    quiz: [
      {
        q: "What happens when a CPU mispredicts a conditional branch?",
        options: ["Computer restarts", "The instruction pipeline is flushed, stalling execution for many cycles", "It compiles code again", "It switches to GPU mode"],
        correct: 1,
        exp: "A branch misprediction forces the CPU to discard speculative instructions in the execution pipeline, causing a pipeline stall that degrades performance."
      },
      {
        q: "What is a core benefit of writing 'branchless' code?",
        options: ["Saves code characters", "Avoids CPU branch prediction failures", "Ensures dynamic memory cleanup", "Compiles code directly to assembly"],
        correct: 1,
        exp: "Branchless code uses arithmetic calculations instead of conditional jumps, ensuring constant execution time and no branch prediction penalties."
      }
    ]
  },
  "sem0_m2_u5": {
    title: "C++ Loops & Optimization",
    concept: "Loops execute code blocks repeatedly. Nested loops must traverse memory sequentially matching the array storage layout. C++ arrays are row-major; traversing row-by-row utilizes cache line layout, while column-by-column traversal causes cache misses.",
    code: `const int SIZE = 1000;
int matrix[SIZE][SIZE];

// Good: Row-major traversal (sequential memory read)
for(int i = 0; i < SIZE; ++i) {
    for(int j = 0; j < SIZE; ++j) {
        matrix[i][j] = 0; // Contiguous hits
    }
}`,
    trap: "Interviewer asks: 'What is Loop Unrolling?' It is an optimization technique where the loop body is duplicated to reduce loop counter increments and condition jump checks. Modern compilers do this automatically, but doing it manually in hot rendering loops can sometimes be beneficial.",
    quiz: [
      {
        q: "Why is row-by-row traversal of 2D arrays faster in C++?",
        options: ["C++ stores 2D arrays in row-major order (contiguous rows in memory)", "Rows take less space than columns", "Rows run on the stack", "C++ compiles columns slower"],
        correct: 0,
        exp: "Since C++ memory is laid out row-by-row, accessing elements along the row reads adjacent addresses, matching the cache prefetcher patterns."
      },
      {
        q: "What is the primary risk of excessive loop unrolling?",
        options: ["Memory leaks", "Increased binary size (code bloat) which can cause instruction cache (I-cache) misses", "Stack overflow", "Floating-point errors"],
        correct: 1,
        exp: "Loop unrolling increases instruction sizes. If the binary code of the loop exceeds the CPU instruction cache (I-Cache) size, it degrades instruction load performance."
      }
    ]
  },
  "sem0_m2_u6": {
    title: "C++ Functions & Inline Overhead",
    concept: "Functions wrap reuse. Calling a function adds call stack overhead (passing parameters, saving return pointers, jumping). The `inline` keyword requests the compiler to copy the function body to call sites, removing stack jump overhead, which is useful for small setters/getters.",
    code: `class Player {
    int m_health = 100;
public:
    // Inlined getter: zero call overhead
    inline int GetHealth() const { return m_health; }
};`,
    trap: "Interviewer asks: 'Will marking a 1000-line function inline make the game faster?' No. The `inline` keyword is a suggestion; compilers ignore it for complex or recursive functions. Inline bloats binary size if the function is large, causing L1 instruction cache misses.",
    quiz: [
      {
        q: "What does the 'inline' keyword suggest to the compiler?",
        options: ["Run the function on a worker thread", "Replace function calls with the actual function body code during compilation", "Allocate parameters on the heap", "Delete the function after execution"],
        correct: 1,
        exp: "Inlining copies the function code directly into the calling location, eliminating function call frame overhead (stack pushes, jumps)."
      },
      {
        q: "Why should large functions not be marked inline?",
        options: ["They crash the compiler", "They block stack allocation", "They cause code bloat, increasing instruction cache misses", "They can only return void"],
        correct: 2,
        exp: "Large inlined functions increase binary size. If the CPU cannot fit instructions in L1 instruction cache (I-cache), performance drops significantly."
      }
    ]
  },
  "sem0_m2_u7": {
    title: "C++ Arrays & Stack Allocation",
    concept: "Arrays allocate uniform elements contiguously. Stack arrays (`int arr[10];`) are fixed at compile-time and fast. Dynamic arrays (`std::vector`) allocate on the heap to support resizing, but resizing triggers a new allocation, copying old elements, and deleting old space.",
    code: `void ArrayAllocation() {
    int stackArr[5] = {1, 2, 3, 4, 5}; // Stack: fast, static size
    
    std::vector<int> dynamicArr; 
    dynamicArr.reserve(100); // Optimization: pre-allocates memory to avoid resizes
}`,
    trap: "Interviewer asks: 'What is the performance penalty of using push_back on a vector without reserving memory?' If capacity is exceeded, the vector allocates a new, larger array (usually 1.5x or 2x size), moves/copies all existing elements to the new block, and deletes the old block. This causes massive memory spikes.",
    quiz: [
      {
        q: "How can you prevent a std::vector from triggering multiple memory reallocations during inserts?",
        options: ["Call clear()", "Use the reserve() method to pre-allocate capacity", "Use a const vector", "Use double pointers"],
        correct: 1,
        exp: "Calling reserve() allocates heap memory in advance, allowing push_back to append elements without memory moves until the reserved capacity is exceeded."
      },
      {
        q: "What is a stack overflow risk when declaring arrays?",
        options: ["Resizing dynamically", "Declaring extremely large arrays on the stack, exceeding typical stack space (~1MB)", "Passing arrays to functions", "Using const arrays"],
        correct: 1,
        exp: "Since the stack is small (~1-2MB depending on OS), allocating large buffers (e.g. char buffer[5000000]) will exceed stack limits and trigger a crash."
      }
    ]
  },
  "sem0_m2_u8": {
    title: "C++ Pointers & Memory Addresses",
    concept: "Pointers store raw 64-bit virtual memory addresses. Dereferencing a pointer (`*ptr`) retrieves the value at that address. In AAA game engines, pointers are used for low-level performance, custom memory allocators, and hardware interaction.",
    code: `int health = 100;
int* pHealth = &health; // Pointer holds address of health
*pHealth = 80;          // Dereferencing updates original value

// Check for nullptr before dereferencing!
if (pHealth != nullptr) {
    std::cout << *pHealth;
}`,
    trap: "Never dereference a nullptr or wildcard uninitialized pointer! It triggers an OS Access Violation crash. Always initialize pointers to nullptr.",
    quiz: [
      {
        q: "What size is a pointer variable on a modern 64-bit OS?",
        options: ["4 bytes", "8 bytes", "16 bytes", "Variable depending on the data type it points to"],
        correct: 1,
        exp: "On a 64-bit system, all virtual memory addresses are 64-bit (8 bytes). Thus, any pointer (int*, char*, Enemy*) is exactly 8 bytes."
      },
      {
        q: "What is a dangling pointer?",
        options: ["A pointer that is set to nullptr", "A pointer that points to memory that has already been deallocated", "A pointer initialized on the stack", "A pointer running on a separate CPU thread"],
        correct: 1,
        exp: "A dangling pointer pointing to deleted memory can cause random data corruptions or crashes if dereferenced, as that address can be overwritten."
      }
    ]
  },
  "sem0_m2_u9": {
    title: "C++ References & Aliases",
    concept: "References are syntax aliases for existing variables. Under the hood, compilers implement references as const pointers, but syntax-wise, they cannot be null or reassigned, making function signatures safer for passing large objects.",
    code: `struct MassiveMesh { float vertices[1000000]; };

// Pass by reference-to-const to avoid copying 4MB mesh
void RenderMesh(const MassiveMesh& mesh) {
    // Read mesh safely without duplication overhead
}`,
    trap: "Interviewer asks: 'Can a reference be null?' Technically, standard C++ says references cannot be null. However, dereferencing a null pointer to construct a reference (e.g. `T& ref = *ptr;` where `ptr` is null) is undefined behavior. Say: 'Always ensure backing pointers are valid before dereferencing to create references.'",
    quiz: [
      {
        q: "What is a key difference between a reference and a pointer?",
        options: ["Pointers cannot be null", "References can be reassigned to represent other memory locations", "References cannot be null and must be initialized at declaration", "References take double the memory size of pointers"],
        correct: 2,
        exp: "References must be initialized immediately at declaration and cannot point to null, protecting your APIs from dereferencing errors."
      },
      {
        q: "Why do we pass large structures by reference-to-const?",
        options: ["To prevent compilation speed drops", "To avoid copy constructor calls and memory duplication while preventing the function from modifying the original object", "To allocate the structure on the stack", "To force inline expansion"],
        correct: 1,
        exp: "Using `const T&` passes the object's memory address without calling copy constructors, saving CPU cycles, while `const` enforces read-only access."
      }
    ]
  },
  "sem0_m2_u10": {
    title: "C++ Classes & Object Layout",
    concept: "Classes encapsulate member fields and methods. Structs and Classes are identical in C++ except for default visibility (private in class, public in struct). Compiler alignments padding (padding bytes) align fields to word boundaries (usually 4 or 8 bytes) for efficient CPU reads.",
    code: `// Size check & Alignment Padding
struct BadPadding {   // Size: 12 bytes
    char a;  // 1 byte (+ 3 bytes padding)
    int b;   // 4 bytes
    char c;  // 1 byte (+ 3 bytes padding)
};

struct OptimizedPadding { // Size: 8 bytes
    int b;   // 4 bytes
    char a;  // 1 byte
    char c;  // 1 byte (+ 2 bytes padding)
};`,
    trap: "Interviewer asks: 'What is the size of an empty class?' The size is exactly 1 byte. C++ requires unique memory addresses for separate object instances, so the compiler inserts 1 dummy byte.",
    quiz: [
      {
        q: "What is the size of an empty class or struct in C++?",
        options: ["0 bytes", "1 byte", "4 bytes", "8 bytes"],
        correct: 1,
        exp: "C++ guarantees that two distinct objects of the same class always have different addresses, so empty classes have a minimum size of 1 byte."
      },
      {
        q: "How does sorting class member variables by size (largest to smallest) affect memory usage?",
        options: ["Increases execution speed on GPU", "Minimizes structural compiler padding bytes, reducing the cache footprint of class instances", "Triggers memory leaks", "Allows runtime inline upgrades"],
        correct: 1,
        exp: "Ordering members from largest to smallest allows them to align naturally with CPU word boundaries, reducing padding bytes inserted by the compiler."
      }
    ]
  },
  "sem0_m2_u11": {
    title: "C++ Objects & Lifecycles",
    concept: "Object lifecycles comprise allocation, construction, mutation, destruction, and deallocation. Object placement on the stack guarantees predictable scope destruction. Heap-allocated objects require manual lifecycle triggers.",
    code: `class Particle {
public:
    Particle() { std::cout << "Born\\n"; }
    ~Particle() { std::cout << "Dead\\n"; }
};

void LifecycleScope() {
    Particle p; // Born here
} // Dead here (automatic stack cleanup)`,
    trap: "Interviewer asks: 'What is Placement New?' It is a special syntax of the `new` operator (`new (address) T()`) that constructs an object on a pre-allocated raw memory buffer. This is used in custom game memory pools to avoid expensive OS allocations during gameplay.",
    quiz: [
      {
        q: "What is Placement New used for in high-performance engines?",
        options: ["Constructing an object at a specific pre-allocated memory address", "Allocating memory directly in the GPU VRAM", "Speeding up network connections", "Converting pointers to variables"],
        correct: 0,
        exp: "Placement new allows gameplay programmers to initialize objects on custom memory pages, bypassing the heap allocator's runtime overhead."
      },
      {
        q: "When is the destructor of a stack-allocated object called?",
        options: ["When delete is called on its address", "When the containing function completes compile", "When the object goes out of scope", "Never"],
        correct: 2,
        exp: "Stack objects have automatic lifecycles. Their destructors run instantly when execution leaves their declaring code scope block."
      }
    ]
  },
  "sem0_m2_u12": {
    title: "C++ Constructors & Member Initializers",
    concept: "Constructors initialize objects. Using Member Initializer Lists (`Constructor() : m_val(5) {}`) is faster than standard assignment inside the constructor body because assignments trigger default constructors followed by assignment operators instead of direct construction.",
    code: `class Weapon {
    std::string m_name;
public:
    // Good: Member initializer list prevents default string construction + reassignment
    Weapon(std::string name) : m_name(name) {} 
    
    // Bad: Triggers empty construction first, then assigns
    // Weapon(std::string name) { m_name = name; }
};`,
    trap: "Interviewer asks: 'In what order are class member variables initialized?' Member variables are initialized in the exact order they are declared in the class definition, NOT the order they appear in the initializer list. Keep them in matching orders to prevent uninitialized member dependencies.",
    quiz: [
      {
        q: "What is a key benefit of using constructor initializer lists?",
        options: ["Allocates the class on the GPU", "Constructs variables directly, avoiding empty default constructions and assignments", "Speeds up compile time", "Automatically deletes pointers"],
        correct: 1,
        exp: "Initializer lists call copy/move constructors directly, avoiding the waste of initializing default states and overwriting them inside the constructor body."
      },
      {
        q: "If class members are declared in the order A, then B. What happens if B is initialized before A in the constructor list?",
        options: ["A is initialized first anyway", "B is initialized first", "Compile error", "Memory is corrupted"],
        correct: 0,
        exp: "Initialization order is strictly dictated by the class declaration order (A, then B). List ordering is ignored, which can lead to bugs if A depends on B."
      }
    ]
  },
  "sem0_m2_u13": {
    title: "C++ Inheritance & Object Offsets",
    concept: "Inheritance creates parent-child code reuse. Memory-wise, a derived class object contains the base class fields first, followed by the derived class fields. Multiple inheritance adds offsets to pointers, requiring static casts to resolve base addresses.",
    code: `struct Base { int x; };
struct Derived : public Base { int y; };

void PrintOffset() {
    Derived d;
    // &d.x is at offset 0, &d.y is at offset 4
}`,
    trap: "Interviewer asks: 'What is the Diamond Problem?' It occurs during multiple inheritance when a class inherits from two classes that both share a common base. This creates duplicate copies of the base class. We resolve this using `virtual inheritance` (`class Parent : virtual public Grandparent`).",
    quiz: [
      {
        q: "What C++ keyword prevents duplicate base components in diamond multiple inheritance?",
        options: ["override", "virtual", "final", "explicit"],
        correct: 1,
        exp: "Virtual inheritance (`virtual public`) ensures only a single instance of the common grandparent class exists in the final derived layout."
      },
      {
        q: "Where in a derived class's memory layout do the base class fields reside?",
        options: ["At the end of the derived class memory block", "At the very start (offset 0)", "On a separate heap page", "Inside the CPU instruction register"],
        correct: 1,
        exp: "To allow cast compatibility, base class fields are placed at the beginning of the memory footprint of a derived class object."
      }
    ]
  },
  "sem0_m2_u14": {
    title: "C++ Polymorphism & Dynamic Dispatch",
    concept: "Polymorphism resolves methods dynamically using virtual functions. A class with `virtual` methods contains a hidden virtual pointer (`vptr`) pointing to the class's Virtual Table (`vtable`). Dynamic dispatch calls resolve at runtime through this table.",
    code: `class Actor {
public:
    virtual void Tick() { /* Base */ }
    virtual ~Actor() = default; // Essential virtual destructor
};

class Monster : public Actor {
public:
    void Tick() override { /* Monster */ }
};`,
    trap: "Interviewer asks: 'Why is it critical for base classes with virtual methods to have a virtual destructor?' If the base destructor is not virtual, deleting a derived class through a base pointer causes undefined behavior, leaking the derived portion's memory.",
    quiz: [
      {
        q: "What is the consequence of omitting a virtual destructor in a polymorphically inherited base class?",
        options: ["Compile error on delete", "Memory leaks or undefined behavior when deleting a derived instance via a base pointer", "The class size becomes 0 bytes", "It runs faster on GPU"],
        correct: 1,
        exp: "Without a virtual destructor, only the base class destructor runs when deleting through a base pointer, leaving the derived data components intact and leaking resources."
      },
      {
        q: "What is the runtime mechanism used to dispatch virtual functions?",
        options: ["Compiler inline logic", "VTABLE pointer lookup (vptr dereference)", "Stack pops", "Binary search"],
        correct: 1,
        exp: "Calling a virtual method queries the object's vptr to load the class VTABLE, then invokes the function pointer at the index matching that virtual method."
      }
    ]
  },
  "sem0_m2_u15": {
    title: "C++ Templates & Metaprogramming",
    concept: "Templates enable type-independent code. The compiler generates concrete implementations (instantiations) for each unique type argument at compile time. This ensures type safety and high performance (inlinable, zero runtime overhead) but can cause binary size expansion.",
    code: `// Template vector dot product
template <typename T>
T GetDotProduct(T x1, T y1, T x2, T y2) {
    return (x1 * x2) + (y1 * y2);
}

// Instantiated as double or float during compile
float val = GetDotProduct<float>(1.f, 2.f, 3.f, 4.f);`,
    trap: "Interviewer asks: 'Why are template definitions usually placed in headers rather than cpp source files?' The compiler needs the complete template implementation source visible to generate code for each unique type parameter at compile-time compilation units.",
    quiz: [
      {
        q: "What is the runtime performance cost of C++ templates?",
        options: ["High overhead due to virtual tables", "Zero runtime overhead (instantiated during compile time)", "Heavy context switches", "Requires RAM reallocation"],
        correct: 1,
        exp: "Templates are a compile-time code generation tool. The compiler outputs specific type versions directly, enabling complete compiler optimizations."
      },
      {
        q: "What is the risk of utilizing templates extensively across codebases?",
        options: ["Heap fragmentation", "Compiler warnings only", "Code bloat, which can increase binary size and build times", "Runtime type errors"],
        correct: 2,
        exp: "Instantiating templates with many type variations causes the compiler to generate duplicate assembly code, increasing final binary footprints."
      }
    ]
  },
  "sem0_m2_u16": {
    title: "C++ STL & Game Dev Alternatives",
    concept: "The C++ STL provides standard containers (`std::vector`, `std::unordered_map`). While versatile, STL implementations (like `std::unordered_map`) use node-based allocations which degrade cache performance. AAA engines use custom alternatives (like EA's EASTL, Epic's TArray, or TMap) optimized for game loops.",
    code: `#include <vector>
#include <unordered_map>

// Optimized vector reserve
void PopulateGrid() {
    std::vector<int> grid;
    grid.reserve(2048); // Pre-allocates raw memory block
}`,
    trap: "Interviewer asks: 'Why does EA use EASTL instead of standard C++ STL?' Standard STL prioritizes absolute safety and standard conformance over memory footprints, allocating memory implicitly. EASTL allows custom memory allocators to prevent heap fragmentation in consoles.",
    quiz: [
      {
        q: "Why is std::unordered_map sometimes avoided in performance-critical game loops?",
        options: ["It does not support strings", "It is node-based, leading to memory scattering, heap allocations on insertion, and cache misses", "It is limited to 10 elements", "It is thread-safe"],
        correct: 1,
        exp: "unordered_map buckets use linked lists (chaining) to handle collisions. This scatters memory nodes across the heap, triggering CPU cache stalls during search traversals."
      },
      {
        q: "What is the primary advantage of Unreal Engine's TArray over std::vector?",
        options: ["Does not use heap memory", "Integrates natively with Unreal's reflection, garbage collection, and custom memory allocators", "Runs on GPU", "No index overhead"],
        correct: 1,
        exp: "TArray is optimized for UE workflows, managing serialization, garbage collection tracking (with UPROPERTY), and custom allocator pooling hooks."
      }
    ]
  },
  "sem0_m2_u17": {
    title: "C++ Smart Pointers",
    concept: "Smart pointers manage heap object lifetimes. `std::unique_ptr` has single exclusive ownership and deletes resources when out of scope. `std::shared_ptr` uses reference counts. `std::weak_ptr` holds non-owning refs to prevent circular cycles.",
    code: `#include <memory>
// Exclusive ownership
std::unique_ptr<Enemy> enemy = std::make_unique<Enemy>();

// Reference counted ownership
std::shared_ptr<Texture> tex = std::make_shared<Texture>();
std::weak_ptr<Texture> weakTex = tex; // Breaks loops`,
    trap: "Never use std::shared_ptr everywhere! It adds runtime overhead due to thread-safe atomic reference count increments. Prefer std::unique_ptr by default, or pass raw pointers/references for temporary access.",
    quiz: [
      {
        q: "Which smart pointer does NOT increase reference counts?",
        options: ["std::shared_ptr", "std::weak_ptr", "std::unique_ptr", "std::auto_ptr"],
        correct: 1,
        exp: "std::weak_ptr references shared_ptr memory without incrementing its strong reference counter. It helps inspect validity and prevents cyclic memory lockups."
      },
      {
        q: "What is the performance overhead of std::shared_ptr copy operations?",
        options: ["GPU synchronization", "Atomic reference count increment/decrement, which requires CPU cache synchronization instructions", "Stack overflow", "Disk writes"],
        correct: 1,
        exp: "To be thread-safe, shared_ptr increments reference counters using atomic operations. These trigger cache line synchronization stalls across CPU cores, which is slow."
      }
    ]
  },
  "sem0_m2_u18": {
    title: "C++ Move Semantics & Rvalues",
    concept: "Move semantics allow transferring resources (like dynamic buffers) from temporary objects (rvalues) without deep copying. `std::move` casts an object to an rvalue reference (`T&&`), enabling move constructors to steal pointers.",
    code: `// Move constructor example
class Buffer {
    int* m_data;
public:
    // Move constructor
    Buffer(Buffer&& other) noexcept {
        m_data = other.m_data;    // Steal pointer
        other.m_data = nullptr;   // Clean source
    }
};`,
    trap: "Adding std::move to a return value (e.g. return std::move(myLocalVar);) can be a trap. It disables NRVO (Named Return Value Optimization / Copy Elision), making the code slower! Let the compiler handle standard local returns.",
    quiz: [
      {
        q: "What does std::move actually do at runtime?",
        options: ["Moves bytes in RAM", "Performs a static cast to an rvalue reference (T&&)", "Allocates heap space", "Compresses file data"],
        correct: 1,
        exp: "std::move generates no machine code. It simply casts the type to an rvalue reference, allowing the compiler to match move constructors instead of copy constructors."
      },
      {
        q: "Why is a move constructor marked 'noexcept'?",
        options: ["To prevent compilation", "To allow STL containers (like vector resizes) to safely use move constructor instead of copy constructor", "To speed up link processes", "To disable exceptions globally"],
        correct: 1,
        exp: "If a move constructor might throw, vectors will fall back to using copies during expansion to preserve safety. Mark move operations 'noexcept' to ensure vector performance."
      }
    ]
  },

  // ==========================================
  // SEMESTER 1: COMPUTER SCIENCE / DSA
  // ==========================================
  "sem1_m1": {
    title: "Data Structures Basics",
    concept: "Data structures organize values in memory. Fixed arrays (`stack`), dynamic arrays (`vector`), and linked lists represent different layouts. A gameplay programmer must choose the right layout based on search, insertion, and memory overhead patterns.",
    code: `// Sequential access vs Node access
int stackArray[100]; // Sequential, fast, static size

struct ListNode {
    int value;
    ListNode* next; // Dynamic but non-contiguous
};`,
    trap: "Interviewer asks: 'When would you use a linked list in a game?' Linked lists are generally avoided in game loops due to cache misses. However, they are useful for intrusive list patterns in low-level memory pools where nodes are pre-allocated inside contiguous pages, ensuring no allocations.",
    quiz: [
      {
        q: "Which data structure has O(1) random access lookup time?",
        options: ["Linked list", "Array", "Binary Search Tree", "Graph"],
        correct: 1,
        exp: "Arrays reside contiguously in memory. Finding index N is a simple math offset calculation (`base + N * element_size`), executing in O(1) time."
      },
      {
        q: "What is the primary drawback of a linked list in AAA games?",
        options: ["It cannot store floats", "Nodes are non-contiguous, causing constant CPU cache misses on traversal", "It is limited to 256 items", "Cannot be sorted"],
        correct: 1,
        exp: "Linked list nodes are scattered across the heap. Traversing the list requires following pointers to random addresses, stalling the CPU on RAM fetches."
      }
    ]
  },
  "sem1_m2": {
    title: "Algorithms & Complexity (Big O)",
    concept: "Big O notation measures algorithm scalability as input grows. Time complexity counts operations; space complexity measures memory consumption. We optimize hot loops to O(1) or O(log N) through hash tables, grids, or sorted arrays.",
    code: `// O(1) Lookup: Hash table
std::unordered_map<int, Player*> g_playerIDMap;
Player* p = g_playerIDMap[102];

// O(N) Lookup: Linear scan
for (auto p : g_players) {
    if (p->GetID() == 102) return p;
}`,
    trap: "Interviewer asks: 'Is an O(N log N) algorithm always faster than an O(N^2) algorithm?' Never say 'always'. For small input sizes (like N < 32 elements), constant overhead dominates, and simple O(N^2) loops (like insertion sort) are often faster than O(N log N) merge sorts.",
    quiz: [
      {
        q: "What is the time complexity of searching a sorted array using binary search?",
        options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"],
        correct: 2,
        exp: "Binary search cuts the search space in half at each step, yielding a logarithmic time complexity of O(log N)."
      },
      {
        q: "Why is Big O complexity analysis alone insufficient for game optimization?",
        options: ["Games do not use math", "Big O ignores hardware factors like CPU caches, memory layout, and processor pipeline latency", "Big O only works in Python", "Games only use O(1) algorithms"],
        correct: 1,
        exp: "An O(N) cache-friendly sequential array loop is often faster than an O(1) unordered_map search for medium-sized collections because cache misses dominate cycles."
      }
    ]
  },
  "sem1_m3": {
    title: "Recursion & Backtracking",
    concept: "Recursion solves problems by calling functions within themselves. Each recursive call adds a stack frame. Games avoid deep recursion in main loops because stack space is restricted. Backtracking explores state spaces (like puzzle paths) and rolls back on failure.",
    code: `// Tail recursion: compile optimization if optimized
int Factorial(int n, int accum = 1) {
    if (n <= 1) return accum;
    return Factorial(n - 1, n * accum); // Tail call recursion
}`,
    trap: "Interviewer asks: 'How do you prevent stack overflow in recursive pathfinders?' Convert recursion to an iterative loop using an explicit stack container (`std::vector`) allocated on the heap, ensuring stack limits are never breached.",
    quiz: [
      {
        q: "What is the danger of infinite recursion in C++?",
        options: ["Memory leaks", "Stack Overflow crash, as physical stack space is exhausted", "Infinite loop without crash", "The CPU clock drops to 0"],
        correct: 1,
        exp: "Every recursive call allocates a new stack frame. If space runs out, the OS halts the process with a Stack Overflow exception."
      },
      {
        q: "What does tail-call optimization (TCO) accomplish?",
        options: ["Puts the function on GPU", "Compiles recursion into an iterative loop, preventing stack frame growth", "Automatically deletes pointers", "Replaces recursion with hashing"],
        correct: 1,
        exp: "If the recursive call is the final operation in a function, compliant compilers rewrite it to reuse the active stack frame, avoiding stack overflows."
      }
    ]
  },
  "sem1_m4": {
    title: "Linked Lists (Single, Double, Circular)",
    concept: "Linked lists link nodes via pointers. Doubly linked lists contain previous and next pointers, allowing O(1) deletions if the node pointer is known. Circular lists link the tail back to the head, useful for round-robin scheduling or rotating selection menus.",
    code: `struct DoubleNode {
    int data;
    DoubleNode* prev;
    DoubleNode* next;
};

// Intrusive list node representation
struct IntrusiveNode {
    IntrusiveNode* next;
};`,
    trap: "Interviewer asks: 'What is an Intrusive Linked List?' Unlike standard lists that allocate a node wrapping user data, intrusive lists embed the pointer links directly *inside* the data class. This avoids separate allocation overhead for the node wrappers, which is crucial for custom game allocators.",
    quiz: [
      {
        q: "What is a key structural difference between std::list and an intrusive linked list?",
        options: ["Intrusive lists require no heap allocations because pointers are embedded within the data structure itself", "std::list is faster to compile", "Intrusive lists are limited to strings", "They are identical"],
        correct: 0,
        exp: "By embedding the list nodes directly inside the player or bullet structures, we avoid allocating a wrapper block, saving allocations."
      },
      {
        q: "What is the time complexity of deleting a node in a doubly linked list if you already have its pointer?",
        options: ["O(N)", "O(log N)", "O(1)", "O(N^2)"],
        correct: 2,
        exp: "Since the node contains links to both its neighbors, we can update them directly to bypass the target node, resolving in O(1) time."
      }
    ]
  },
  "sem1_m5": {
    title: "Trees (BST, AVL, Red-Black)",
    concept: "Trees organize data hierarchically. Binary Search Trees (BST) maintain sorted order: left child is smaller, right is larger. Unbalanced trees degrade to O(N) lists. Self-balancing trees (AVL, Red-Black) guarantee O(log N) operations by rotating nodes during inserts.",
    code: `struct AVLNode {
    int data;
    AVLNode* left;
    AVLNode* right;
    int height; // Balance factor check
};`,
    trap: "Interviewer asks: 'Which tree structure does std::map use?' `std::map` and `std::set` are almost universally implemented as Red-Black Trees. These guarantee O(log N) lookups, but be ready to mention that node lookup overhead makes them slower than sorted vectors for static dataset searches.",
    quiz: [
      {
        q: "What is the worst-case lookup time complexity of an unbalanced Binary Search Tree?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correct: 2,
        exp: "If keys are inserted in sorted order, an unbalanced tree forms a degenerate straight line (essentially a linked list), degrading lookup speed to O(N)."
      },
      {
        q: "Why are self-balancing trees preferred in standard libraries?",
        options: ["They allocate memory on stack", "They prevent depth imbalances, guaranteeing O(log N) lookup/insertion speeds", "They require no pointers", "They run on the GPU"],
        correct: 1,
        exp: "Self-balancing trees execute node rotations during modifications to maintain balanced leaf depths, preserving efficiency."
      }
    ]
  },
  "sem1_m6": {
    title: "Graphs (DFS, BFS, Dijkstra, A*)",
    concept: "Graphs model connected nodes. Pathfinding algorithms traverse graphs: DFS (stack) traverses deep, BFS (queue) traverses wide (finding shortest path on unweighted graphs). Dijkstra handles weighted graphs, and A* optimizes Dijkstra by using a heuristic (distance to target) to direct the search.",
    code: `struct GraphNode {
    int id;
    std::vector<std::pair<GraphNode*, float>> neighbors; // Neighbor + edge weight
};

// A* Heuristic: Manhattan Distance
float ManhattanHeuristic(float x1, float y1, float x2, float y2) {
    return std::abs(x1 - x2) + std::abs(y1 - y2);
}`,
    trap: "Interviewer asks: 'How does A* differ from Dijkstra?' Dijkstra explores nodes in all directions equally. A* uses a heuristic function (estimating remaining distance to target) to prioritize nodes closer to the destination, pruning irrelevant paths.",
    quiz: [
      {
        q: "Which algorithm finds the shortest path on a weighted graph with a heuristic function?",
        options: ["DFS", "BFS", "Dijkstra", "A*"],
        correct: 3,
        exp: "A* uses both the cost-to-reach (g) and a heuristic estimate (h) to guide pathfinding efficiently toward the destination."
      },
      {
        q: "What data structure is used to retrieve the lowest-cost node in Dijkstra and A*?",
        options: ["Stack", "Queue", "Priority Queue (Min-Heap)", "Linked List"],
        correct: 2,
        exp: "A min-heap priority queue returns the node with the smallest cumulative cost in O(1) time, adjusting internally in O(log N) time."
      }
    ]
  },
  "sem1_m7": {
    title: "Hash Tables & Collisions",
    concept: "Hash tables resolve key-value mappings by applying a hash function to index values. Collisions occur when different keys hash to the same bucket. Collisions are handled via Chaining (linked lists in bucket, node-based cache killer) or Open Addressing (finding adjacent empty slots, contiguous array format).",
    code: `// Open Addressing: Linear Probing index lookup
int FindHashKey(int key, int* table, int capacity) {
    int index = HashFunction(key) % capacity;
    while(table[index] != -1 && table[index] != key) {
        index = (index + 1) % capacity; // Linear probing
    }
    return index;
}`,
    trap: "Interviewer asks: 'What is Cache-Friendly collision resolution?' Answer: 'Open Addressing with Linear Probing'. Because all data is stored inside a single flat array, searching for collisions reads contiguous memory indices, maximizing L1 cache hits.",
    quiz: [
      {
        q: "What is a main performance drawback of hash table collision chaining?",
        options: ["No float key support", "Node allocation and memory fragmentation, causing cache misses when traversing buckets", "Double hashes are required", "Limits table sizes"],
        correct: 1,
        exp: "Chaining attaches a linked list to each bucket slot. Traversing these lists requires chasing heap pointers, which is slow due to cache misses."
      },
      {
        q: "What is open addressing?",
        options: ["Resolving collisions by storing elements directly within the table's array, scanning adjacent slots on conflicts", "Using memory pointers exclusively", "Using string hashing only", "Allowing any variable name"],
        correct: 0,
        exp: "Open addressing keeps all data inside the main table array, checking subsequent indices on collisions, which is highly cache-friendly."
      }
    ]
  },
  "sem1_m8": {
    title: "Dynamic Programming (DP)",
    concept: "Dynamic Programming solves complex problems by breaking them into overlapping subproblems, storing results in lookup tables to prevent duplicate calculations. Storing solutions can be Memoization (top-down, recursive) or Tabulation (bottom-up, iterative).",
    code: `// Tabulation (Bottom-Up) Fibonacci: O(N) time, O(1) space
int Fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1, current = 0;
    for (int i = 2; i <= n; ++i) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}`,
    trap: "Interviewer asks: 'How does DP compare to divide-and-conquer?' Divide-and-conquer (like merge sort) splits problems into independent subproblems. DP is used when subproblems overlap (e.g. recalculating the same states), requiring caching to maintain efficiency.",
    quiz: [
      {
        q: "What is the technique of storing recursive function outcomes to avoid recalculations?",
        options: ["Tabulation", "Memoization", "Backtracking", "Dynamic casting"],
        correct: 1,
        exp: "Memoization caches the results of recursive operations (usually in a hash map) to return them instantly if the same parameters are queried again."
      },
      {
        q: "What is the space complexity advantage of bottom-up tabulation over top-down memoization?",
        options: ["Runs on GPU", "Eliminates recursive function call stack frame memory overhead", "Uses zero variables", "Always O(1) space"],
        correct: 1,
        exp: "Tabulation uses iterative loops to populate data tables, completely avoiding recursive call stack frame allocations."
      }
    ]
  },
  "sem1_m9": {
    title: "Multithreading & Concurrency Basics",
    concept: "Concurrency executes multiple instructions overlapping in time. Multi-core processors run threads in parallel. Synchronization tools like atomic variables, condition variables, and read-write locks coordinate threads. AAA game loops divide work via concurrent task queues (Job Systems).",
    code: `#include <thread>
#include <mutex>

std::mutex g_logMutex;
void LogMessage(const std::string& msg) {
    std::lock_guard<std::mutex> lock(g_logMutex);
    std::cout << msg << std::endl; // Safe print
}`,
    trap: "Interviewer asks: 'What is a Deadlock and how do we avoid it?' A deadlock occurs when Thread 1 holds Resource A and waits for Resource B, while Thread 2 holds Resource B and waits for Resource A. We prevent it by always acquiring locks in a strict, consistent order or using `std::lock`.",
    quiz: [
      {
        q: "What is a deadlock?",
        options: ["A process crash", "A state where threads wait indefinitely for locks held by each other", "A memory leak", "GPU buffer overflow"],
        correct: 1,
        exp: "Deadlocks lock execution because threads form a circular dependency waiting for resources, halting progress."
      },
      {
        q: "Which C++ standard class provides safe, scoped lock management?",
        options: ["std::mutex", "std::lock_guard", "std::atomic", "std::thread"],
        correct: 1,
        exp: "std::lock_guard binds a mutex lifetime to its scope block, unlocking automatically on destruction to prevent lock leaks."
      }
    ]
  },

  // ==========================================
  // SEMESTER 2: MATHEMATICS
  // ==========================================
  "sem2_m1": {
    title: "Algebra & Equation Solving",
    concept: "Algebra forms the foundation of game calculations. Solving linear equations allows intersecting trajectories. Quadratic equations ($ax^2 + bx + c = 0$) solve physics calculations, such as predicting projectile collision times.",
    code: `// Solve quadratic equation: returns true if roots exist
bool SolveQuadratic(float a, float b, float c, float& root1, float& root2) {
    float discriminant = b*b - 4*a*c;
    if (discriminant < 0.f) return false; // No real intersection
    
    float sq = std::sqrt(discriminant);
    root1 = (-b + sq) / (2.f * a);
    root2 = (-b - sq) / (2.f * a);
    return true;
}`,
    trap: "Interviewer asks: 'How do you handle floating point checks for zero?' Never compare float variables directly using `== 0.0f` due to precision limits. Always check with an epsilon range: `if (std::abs(val) < 0.0001f)`.",
    quiz: [
      {
        q: "What does a negative discriminant (b^2 - 4ac < 0) mean in physics collision predictions?",
        options: ["Perfect collision", "No intersection (the projectile will miss the target)", "Infinitely many collisions", "Negative gravity"],
        correct: 1,
        exp: "A negative discriminant means the equation has no real solutions, indicating that the trajectories do not cross."
      },
      {
        q: "Why is direct float comparison with '==' dangerous in game math?",
        options: ["It fails to compile", "Floating-point precision inaccuracies can cause checks to fail even if values are mathematically equal", "It runs slower", "Floats cannot represent 0"],
        correct: 1,
        exp: "CPU floating-point round-offs introduce minor variations (e.g. 0.0000001). Check within an epsilon offset range instead of exact checks."
      }
    ]
  },
  "sem2_m2": {
    title: "Trigonometry & Unit Circle",
    concept: "Trigonometry tracks angles, distances, and rotations. Sine and Cosine calculate directions from polar coordinates. In gameplay, `std::atan2(y, x)` is a critical function because it calculates the absolute angle to an enemy across all four quadrants without division-by-zero crashes.",
    code: `// Get forward vector direction from angle (in radians)
void AngleToVector(float radians, float& x, float& y) {
    x = std::cos(radians);
    y = std::sin(radians);
}

// Get look-at angle from vector
float VectorToAngle(float x, float y) {
    return std::atan2(y, x); // Handles all quadrant checks
}`,
    trap: "Interviewer asks: 'What is the performance cost of std::atan2 compared to dot products?' `std::atan2` uses transcendental operations, which are expensive (taking 50-80 cycles). For directional checks (e.g., checking if an enemy is in front of the player), use a fast dot product check instead of calculating the exact angle.",
    quiz: [
      {
        q: "Which C++ math function calculates look-at angles across all quadrants?",
        options: ["std::sin", "std::tan", "std::atan", "std::atan2"],
        correct: 3,
        exp: "std::atan2 takes both Y and X coordinates, automatically resolving quadrant signs and avoiding divide-by-zero issues."
      },
      {
        q: "What is the radian equivalent of a 90-degree angle?",
        options: ["pi", "pi / 2", "2 * pi", "0"],
        correct: 1,
        exp: "A full circle (360 degrees) is 2*pi radians. Therefore, 90 degrees is pi/2 radians (~1.5708)."
      }
    ]
  },
  "sem2_m3": {
    title: "Geometry & Bounding Shapes",
    concept: "Geometry manages object boundaries and spatial collision testing. Simple geometric shapes—Bounding Spheres, Axis-Aligned Bounding Boxes (AABB), and Oriented Bounding Boxes (OBB)—optimize collision loops by filtering out complex meshes.",
    code: `struct AABB { float minX, minY, maxX, maxY; };

// Fast AABB intersection check
bool CheckAABBOverlap(const AABB& a, const AABB& b) {
    return (a.minX <= b.maxX && a.maxX >= b.minX) &&
           (a.minY <= b.maxY && a.maxY >= b.minY);
}`,
    trap: "Interviewer asks: 'How do you check if a point is inside a sphere?' Use the squared distance comparison: `float distSq = dx*dx + dy*dy + dz*dz; bool hit = distSq <= r*r;`. This avoids calling the expensive square root function (`std::sqrt`), which is a common performance pitfall in hot collision loops.",
    quiz: [
      {
        q: "What is a main advantage of Axis-Aligned Bounding Boxes (AABB) over Oriented Bounding Boxes (OBB)?",
        options: ["AABBs rotate automatically", "AABBs require much simpler and faster intersection calculations (simple inequalities)", "AABBs are more precise", "AABBs run on the GPU"],
        correct: 1,
        exp: "AABB overlaps check simple coordinate inequalities, running in 2-3 cycles, whereas OBB tests require Separating Axis Theorem (SAT) projection math."
      },
      {
        q: "Why is using squared distance checks preferred in game engines?",
        options: ["Saves float variables", "Bypasses the CPU-intensive square root operation", "It is required for circles", "It works only on integer grids"],
        correct: 1,
        exp: "Calculating exact distance requires a square root. Comparing squared values directly against squared radius yields the same logical outcome, bypasses root math, and is much faster."
      }
    ]
  },
  "sem2_m4": {
    title: "Linear Algebra Foundations",
    concept: "Linear Algebra models game spaces, transformations, and view coordinates. Vectors represent points, velocities, and directions. Matrices combine rotation, scaling, and translation into coordinate spaces.",
    code: `// 3D Vector Representation
struct Vector3D {
    float x, y, z;
    
    // Scale vector
    Vector3D operator*(float scalar) const {
        return { x * scalar, y * scalar, z * scalar };
    }
};`,
    trap: "Interviewer asks: 'What is the physical meaning of a coordinate transformation?' A transformation is a change of basis vectors. Multiplying a local position vector by an object's World Matrix maps it from its local system to the shared world coordinate system.",
    quiz: [
      {
        q: "What does multiplying a vector by a scalar accomplish?",
        options: ["Rotates the vector", "Changes its length (magnitude) without changing its direction", "Calculates a normal", "Resets coordinates to zero"],
        correct: 1,
        exp: "Scalar multiplication multiplies each vector coordinate by a single float value, scaling its length while preserving the direction vector axis."
      },
      {
        q: "Which branch of mathematics forms the basis of 3D spatial calculations in game engines?",
        options: ["Calculus", "Linear Algebra", "Graph Theory", "Boolean Logic"],
        correct: 1,
        exp: "Linear algebra handles vector spaces, matrices, and coordinate transformations, forming the backbone of 3D game engines."
      }
    ]
  },
  "sem2_m5": {
    title: "Vectors: Dot & Cross Products",
    concept: "Vector math is central to game programming. Normalization sets a vector's length to 1, turning it into a direction vector. The Dot Product measures vector alignment: positive if facing the same direction, 0 if perpendicular, negative if facing away. The Cross Product generates a vector perpendicular to both inputs, useful for finding surface normals.",
    code: `struct Vector3 {
    float x, y, z;
    
    float Dot(const Vector3& o) const {
        return x*o.x + y*o.y + z*o.z;
    }
    
    Vector3 Cross(const Vector3& o) const {
        return { y*o.z - z*o.y, z*o.x - x*o.z, x*o.y - y*o.x };
    }
};`,
    trap: "Interviewer asks: 'How do you check if an actor is behind a wall facing away?' Get the vector from wall to actor and take its dot product with the wall's forward vector. If the dot product is negative, the actor is behind the wall.",
    quiz: [
      {
        q: "What is the dot product of two perpendicular vectors?",
        options: ["1.0", "0.0", "-1.0", "2.0"],
        correct: 1,
        exp: "The dot product of perpendicular vectors is exactly 0 because cos(90°) = 0, indicating zero alignment."
      },
      {
        q: "What direction is the cross product of Vector A (0, 0, 1) and Vector B (1, 0, 0)?",
        options: ["Forward (0, 0, 1)", "Up (0, 1, 0)", "Right (1, 0, 0)", "Down (0, -1, 0)"],
        correct: 1,
        exp: "Using the right-hand rule, curling your fingers from Z (A) to X (B) leaves your thumb pointing straight up along the Y axis."
      }
    ]
  },
  "sem2_m6": {
    title: "Matrices & Coordinate Spaces",
    concept: "Matrices perform affine transformations (scaling, rotation, translation). 3D game engines use 4x4 matrices with homogeneous coordinates (W coordinate) because translation is a non-linear transformation that cannot be represented in a 3x3 matrix. Homogeneous coordinates allow combining translation, rotation, and scaling into a single matrix multiplication.",
    code: `// Combining transformations: Scale * Rotation * Translation
// In matrix multiplication order (DirectX is Row-Major, OpenGL is Column-Major)
// WorldMatrix = ScaleMatrix * RotationMatrix * TranslationMatrix;
struct Matrix4x4 {
    float m[4][4];
};`,
    trap: "Interviewer asks: 'Why does order matter when multiplying transformation matrices?' Matrix multiplication is non-commutative. Multiplying Translation * Rotation moves the object first, then rotates it around the world origin, orbiting it, whereas multiplying Rotation * Translation rotates the object first around its own axis, then moves it to its destination.",
    quiz: [
      {
        q: "Why are 4x4 matrices used in 3D engines instead of 3x3 matrices?",
        options: ["They compile faster", "3x3 matrices cannot represent translation, while 4x4 matrices use homogeneous coordinates to unify translation, rotation, and scaling", "They use less memory", "Required by monitors"],
        correct: 1,
        exp: "Translation requires a 4th column/row vector to apply offsets. Homogeneous coordinates (adding a W coordinate) allow combining translation, rotation, and scaling into a single matrix multiplication."
      },
      {
        q: "If an object is scaled by 2, rotated, and translated. What is the standard matrix multiplication order to rotate the object locally?",
        options: ["Translation * Rotation * Scale", "Scale * Rotation * Translation", "Rotation * Scale * Translation", "Translation * Scale * Rotation"],
        correct: 1,
        exp: "First scale the local vertices, then apply rotation around the local origin, and finally translate the object to its world coordinates."
      }
    ]
  },
  "sem2_m7": {
    title: "Quaternions & Gimbal Lock",
    concept: "Representing rotations using Euler angles (pitch, yaw, roll) can lead to Gimbal Lock, where rotating an object by 90 degrees aligns two axes, causing the system to lose a degree of freedom. Quaternions represent rotations as points on a 4D unit sphere ($w + xi + yj + zk$), avoiding gimbal lock and enabling smooth spherical linear interpolation (SLERP).",
    code: `#include <cmath>

struct Quaternion {
    float w, x, y, z;
    
    // SLERP interpolation: Interpolates between two quaternions along a 4D sphere
    static Quaternion Slerp(const Quaternion& q1, const Quaternion& q2, float t) {
        // Core slerp calculations (implemented in Unreal as FQuat::Slerp)
        return q1; // simplified stub
    }
};`,
    trap: "Interviewer asks: 'Why not use Quaternions for every single math calculation?' Quaternions are difficult to read and modify directly. Euler angles are much more intuitive for designers. Engines use Euler angles in editors, but convert them to Quaternions under the hood for calculations.",
    quiz: [
      {
        q: "What is Gimbal Lock?",
        options: ["A hardware failure on controllers", "The loss of a degree of freedom when two rotation axes align", "A graphics rendering bug", "Collision boundary lock"],
        correct: 1,
        exp: "Gimbal lock occurs in Euler angle rotations when two rotation axes align, locking rotations to a 2D plane and losing the third rotation axis."
      },
      {
        q: "Which interpolation method provides smooth rotation transitions using quaternions?",
        options: ["LERP", "SLERP (Spherical Linear Alignment)", "Nlerp", "Hermite Spline"],
        correct: 1,
        exp: "SLERP interpolates rotations along the surface of a 4D unit sphere, ensuring constant rotation speed and smooth transitions."
      }
    ]
  },
  "sem2_m8": {
    title: "Physics Basics & Collision Dynamics",
    concept: "Physics simulation integrates kinematics over time. Newton's laws update velocity: $v_{new} = v_{old} + a \\cdot dt$, and position: $p_{new} = p_{old} + v \\cdot dt$. Collision detection resolves overlaps and calculates elastic impulse forces to apply rebound velocities.",
    code: `struct RigidBody {
    float mass;
    Vector3 position;
    Vector3 velocity;
    Vector3 force;
    
    // Euler Integration
    void Integrate(float dt) {
        if (mass <= 0.f) return;
        Vector3 acceleration = force * (1.f / mass);
        velocity = velocity + acceleration * dt;
        position = position + velocity * dt;
        force = {0,0,0}; // Reset forces
    }
};`,
    trap: "Interviewer asks: 'Why is basic Euler integration bad for physics, and what is the alternative?' Euler integration assumes constant velocity over time steps, which introduces energy drift (e.g. orbits spiraling out of control). The alternative is Verlet integration or semi-implicit Euler.",
    quiz: [
      {
        q: "What is a main issue with basic Euler integration in physics loops?",
        options: ["Does not support gravity", "It accumulates numerical error, adding artificial energy to the system (drift)", "Runs too slow on CPU", "Only works in 2D"],
        correct: 1,
        exp: "Euler integration approximates curves with straight steps. Over time, this error accumulates, causing rigid bodies to gain energy and bounce higher and higher."
      },
      {
        q: "How does Verlet integration calculate positions without explicit velocity variables?",
        options: ["Uses GPU compute shaders", "Uses the current position, the previous position, and acceleration", "Uses random coordinates", "Uses trigonometry exclusively"],
        correct: 1,
        exp: "Verlet integration tracks current and previous positions, calculating velocity implicitly from their difference, which is highly stable for string and cloth physics."
      }
    ]
  },

  // ==========================================
  // SEMESTER 3: SOFTWARE ENGINEERING
  // ==========================================
  "sem3_m1": {
    title: "Clean Code Principles",
    concept: "Clean code prioritizes readability, modularity, and maintainability. Functions should perform a single action. Variables should have descriptive, context-appropriate names, and code should avoid magic numbers. Maintain clean interfaces to avoid tightly coupling systems.",
    code: `// Bad: Magic numbers and unclear variables
void PUpdate(float dt) {
    p.x += p.v * 3.6f * dt;
}

// Good: Descriptive constants and explicit variables
const float METERS_PER_SEC_MULTIPLIER = 3.6f;
void UpdatePlayerPosition(float deltaTime) {
    PlayerPosition.x += PlayerVelocity * METERS_PER_SEC_MULTIPLIER * deltaTime;
}`,
    trap: "Interviewer asks: 'Should you write comments for every line of code?' No. Comments should explain 'why' code exists, not 'what' it does. Clean, self-documenting code with descriptive function and variable names reduces the need for redundant comments.",
    quiz: [
      {
        q: "What is a core goal of writing 'clean code'?",
        options: ["Optimizing build speed", "Maximizing code readability and ease of maintenance", "Reducing file size to 1KB", "Removing all header files"],
        correct: 1,
        exp: "Clean code simplifies maintenance, allowing team developers to read, debug, and expand systems without decyphering complex or obfuscated logic."
      },
      {
        q: "What is a 'magic number' in coding?",
        options: ["A prime number", "Hardcoded numeric values with unexplained meaning in source code", "Floating-point coordinates", "Index pointers"],
        correct: 1,
        exp: "Magic numbers are unexplained literals (e.g. \`if (x < 18.42f)\`). Replace them with named constants (e.g. \`const float DESIRED_SPEED = 18.42f\`)."
      }
    ]
  },
  "sem3_m2": {
    title: "SOLID Principles",
    concept: "SOLID design principles ensure robust software design: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Applied to games, they prevent spaghetti dependencies where modifying one system breaks unrelated systems.",
    code: `// Dependency Inversion Principle
class IAudioDevice {
public:
    virtual void PlaySound(const std::string& assetName) = 0;
    virtual ~IAudioDevice() = default;
};

// Gameplay system depends on abstraction, not concrete audio devices
class GameEngine {
    IAudioDevice& m_audio;
public:
    GameEngine(IAudioDevice& audio) : m_audio(audio) {}
};`,
    trap: "Interviewer asks: 'How does Liskov Substitution apply to game actors?' Liskov states derived classes must be substitutable for base classes without breaking behavior. If a derived actor overrides a base method and throws an exception or disables expected base operations, it violates Liskov and can break system loops.",
    quiz: [
      {
        q: "What does the 'Open-Closed Principle' declare?",
        options: ["Code must be open to edits, closed to extensions", "Classes should be open for extension, but closed for modification", "Functions must only run in user mode", "Classes cannot contain private variables"],
        correct: 1,
        exp: "Open-Closed states you should add new features by writing new classes/extensions, not by modifying existing base code, protecting verified code."
      },
      {
        q: "Which SOLID principle is violated if a function takes a base pointer but crashes if passed a specific child class?",
        options: ["Single Responsibility", "Liskov Substitution Principle", "Interface Segregation", "Dependency Inversion"],
        correct: 1,
        exp: "Liskov Substitution states child instances must behave properly when treated as base class instances, without breaking system invariants."
      }
    ]
  },
  "sem3_m3": {
    title: "Creational, Structural & Behavioral Patterns",
    concept: "Design patterns provide verified solutions to common engineering problems. Creational patterns (Factory, Singleton), Structural patterns (Adapter, Flyweight), and Behavioral patterns (Observer, Strategy) decouple systems.",
    code: `#include <vector>

// Observer Interface
class IPlayerListener {
public:
    virtual void OnPlayerDied() = 0;
};

// Publisher
class PlayerCharacter {
    std::vector<IPlayerListener*> m_listeners;
public:
    void RegisterListener(IPlayerListener* l) { m_listeners.push_back(l); }
    void Die() {
        for(auto l : m_listeners) l->OnPlayerDied();
    }
};`,
    trap: "Interviewer asks: 'Why is the Singleton pattern controversial in game engines?' Singletons act as global variables, introducing hidden dependencies between systems. They restrict scaling (e.g. extending from singleplayer to split-screen/multiplayer) and complicate unit testing.",
    quiz: [
      {
        q: "Which design pattern is used to notify multiple decoupled systems of a gameplay event?",
        options: ["Factory", "Flyweight", "Observer", "Adapter"],
        correct: 2,
        exp: "The Observer pattern allows observers to register for event callbacks, keeping the sender decoupled from receiver implementations."
      },
      {
        q: "What structural pattern uses a shared pool of objects to minimize memory footprints?",
        options: ["Singleton", "Flyweight", "Facade", "Builder"],
        correct: 1,
        exp: "The Flyweight pattern shares common, immutable data structures across multiple instances (e.g., sharing a single Mesh geometry across 1000 foliage actors)."
      }
    ]
  },
  "sem3_m4": {
    title: "Game Programming Patterns",
    concept: "Game loops manage input, game state updates, and rendering. Common patterns include the **Game Loop** (decoupling progress from hardware speeds), **Update Method** (simulating objects frame-by-frame), and **State Pattern** (managing player states like idle, run, jump).",
    code: `class PlayerState {
public:
    virtual void HandleInput(PlayerCharacter& p) = 0;
    virtual void Update(PlayerCharacter& p, float dt) = 0;
};

class JumpState : public PlayerState {
public:
    void HandleInput(PlayerCharacter& p) override { /* ... */ }
    void Update(PlayerCharacter& p, float dt) override {
        // Apply gravity offsets
    }
};`,
    trap: "Interviewer asks: 'How does a fixed update loop differ from a variable frame step loop?' Variable frame steps pass delta time (\`dt\`) directly to updates. This can cause physics glitches if frame rate dips. Fixed updates split updates into constant sub-intervals (e.g. exactly 1/60s steps), ensuring stable physics simulations.",
    quiz: [
      {
        q: "Why do game physics engines use a fixed update step instead of variable dt?",
        options: ["Uses less RAM", "Variable delta steps make physics calculations non-deterministic and unstable (collision tunneling)", "GPU does not support dt", "Required by networks"],
        correct: 1,
        exp: "Fixed update intervals ensure numerical integration values remain consistent, preventing fast-moving objects from passing through collisions."
      },
      {
        q: "What state pattern benefit simplifies complex player input handling?",
        options: ["Allocates players on stack", "Encapsulates behavior for each state inside isolated classes, avoiding massive nested if/else flags in update loops", "Requires no pointers", "Speeds up GPU rendering"],
        correct: 1,
        exp: "The State pattern replaces complex nested conditions (e.g. \`if (isJumping && !isCrouching)\`) with dedicated classes, simplifying states."
      }
    ]
  },
  "sem3_m5": {
    title: "Entity Component System (ECS)",
    concept: "Object-oriented designs (deep class hierarchies like `Character -> Pawn -> Actor`) can lead to bloated, coupled code. Entity Component System (ECS) is a data-oriented design pattern that splits game objects into Entities (IDs), Components (flat structs of raw data), and Systems (logic loops). This groups components contiguously in memory, maximizing CPU cache performance.",
    code: `// ECS Concept: Contiguous data arrays
struct PositionComponent { float x, y, z; };
struct PhysicsComponent  { float vx, vy, vz; };

class PhysicsSystem {
public:
    void Update(std::vector<PositionComponent>& positions, 
                const std::vector<PhysicsComponent>& physics, float dt) {
        // Sequentially iterates contiguous arrays - cache friendly!
        for(size_t i = 0; i < positions.size(); ++i) {
            positions[i].x += physics[i].vx * dt;
        }
    }
};`,
    trap: "Interviewer asks: 'What is the primary benefit of ECS?' Do NOT say 'it makes code cleaner'. Say: 'It transitions code from Object-Oriented to Data-Oriented design. By storing components contiguously in memory and processing them sequentially, we eliminate pointer-chasing cache misses and leverage CPU vectorization.'",
    quiz: [
      {
        q: "What are the three pillars of the ECS design pattern?",
        options: ["Encapsulation, Polymorphism, Inheritance", "Entities (IDs), Components (pure data structs), and Systems (logic)", "Inputs, Calculations, GPU draws", "Mutexes, Stack, Heap"],
        correct: 1,
        exp: "ECS separates identity (Entity), state (Component), and logic (System), grouping raw component structures in contiguous arrays for high cache efficiency."
      },
      {
        q: "Why is data-oriented design (like ECS) faster than deep object inheritance hierarchies?",
        options: ["It bypasses compilation", "It groups data contiguously, reducing CPU cache misses, and avoids the runtime overhead of virtual function calls", "It runs on the sound card", "It uses string lookups"],
        correct: 1,
        exp: "Data-oriented layouts optimize memory patterns. Iterating contiguous data blocks sequentially avoids pointer-chasing and vtable dispatch overhead."
      }
    ]
  },
  "sem3_m6": {
    title: "Unit Testing & TDD",
    concept: "Unit tests validate individual code units in isolation. Test-Driven Development (TDD) writes tests first, then implements the code to pass the tests, and refactors it. Automated tests protect gameplay math, inventory logic, and save files from regression bugs.",
    code: `// Simple test case check
#include <cassert>

void TestVectorNormalize() {
    Vector3 v{3.f, 0.f, 0.f};
    v.Normalize();
    assert(v.x == 1.f); // Verify normalized length is 1
    assert(v.y == 0.f);
}`,
    trap: "Interviewer asks: 'Why is unit testing gameplay code (like character combat) difficult?' Gameplay code often has tight dependencies on physics engines, graphics systems, and engine states. To test these, you must isolate systems or use mock engines, which is why unit tests are usually reserved for isolated systems like math, serialization, and savegames.",
    quiz: [
      {
        q: "What is a main goal of Test-Driven Development (TDD)?",
        options: ["Deploying games to Steam automatically", "Writing test cases first to clarify design and ensure code meets requirements, preventing regressions", "Removing compilers", "Eliminating arrays"],
        correct: 1,
        exp: "TDD writes tests before implementation, enforcing minimal, focused API design and providing an immediate validation suite."
      },
      {
        q: "Why are unit tests particularly useful for game math libraries?",
        options: ["Math does not compile otherwise", "Math functions are deterministic and isolated, making them easy to validate for edge cases (like zero division)", "Math only works on stack", "Bypasses CPU calculations"],
        correct: 1,
        exp: "Math libraries (quaternions, vectors) have clear inputs/outputs. Writing tests prevents changes from introducing regression bugs into physics calculations."
      }
    ]
  },
  "sem3_m7": {
    title: "Debugging Strategies",
    concept: "Debugging involves identifying and resolving errors in compiled binaries. Programmers use breakpoints, inspect memory dumps, analyze call stacks, and check debug patterns to trace memory leaks, stack overflows, and undefined behavior.",
    code: `// Visual Studio debug helper macros
#ifdef _DEBUG
    #define ENGINE_LOG(msg) std::cout << "[DEBUG]: " << msg << "\\n"
#else
    #define ENGINE_LOG(msg) // Optimized out of final game build
#endif`,
    trap: "Interviewer asks: 'How do you debug a crash that only happens in the Release build on consumer machines?' Answer: 'Generate and analyze crash minidumps. By compiling the Release build with debug symbols enabled (separated into PDB files) and analyzing the dump in a debugger, we can resolve the call stack and inspect variable states at the time of crash.'",
    quiz: [
      {
        q: "What information does a program's Call Stack provide during a crash?",
        options: ["Heap size metrics", "The active sequence of nested function calls leading up to the crash point", "VTABLE offset tables", "The code compilation time"],
        correct: 1,
        exp: "The call stack traces the execution path (active stack frames), showing which function called what leading up to the crash."
      },
      {
        q: "How does a Release build crash dump map to source lines without shipping symbols to players?",
        options: ["Shipping PDB files to users", "By matching the crash address offset against private, archived developer PDB (debug symbol) files", "Recompiling the game on the player's computer", "Through print statement diagnostics"],
        correct: 1,
        exp: "Keep your release build PDB files archived. When a client crash report returns an address, loading the dump and matching PDB resolves lines privately."
      }
    ]
  },
  "sem3_m8": {
    title: "Profiling & Optimization Tools",
    concept: "Profiling measures how much CPU/GPU time and memory systems consume. Profilers (Pix on Xbox/Windows, RenderDoc, Unreal Insights, Telemetry) find performance bottlenecks. Gameplay optimization focuses on resolving CPU thread stalls, memory allocations, and expensive draw calls.",
    code: `#include "Stats/Stats.h"

void ProcessEnemyAI() {
    // Defines a profiling scope visible inside Unreal Insights
    DECLARE_SCOPE_CYCLE_COUNTER(TEXT("AI_ProcessTick"), STAT_AI_ProcessTick, STATGROUP_Engine);
    
    // Complex logic runs here
}`,
    trap: "Interviewer asks: 'When should you optimize your game code?' Answer: 'Always write clean, cache-friendly code. However, micro-optimization should be guided by profiling data. Never guess where performance bottlenecks are; compile profiling telemetry and optimize systems that actively stall the frame budget.'",
    quiz: [
      {
        q: "What is the primary function of a profiler like Unreal Insights?",
        options: ["Editing code classes", "Providing timeline charts of CPU/GPU execution scopes to identify spikes and stalls", "Running unit tests", "Compiling shaders"],
        correct: 1,
        exp: "Profilers track real-time execution, showing where frames take longer than the 16.6ms budget (for 60fps), highlighting slow code blocks."
      },
      {
        q: "What is a 'draw call' bottleneck in graphics optimization?",
        options: ["Too many textures", "The CPU spending too much time preparing commands and sending render requests to the GPU", "Slow RAM speed", "High monitor refreshes"],
        correct: 1,
        exp: "Each draw call requires CPU driver overhead to prepare states. Sending too many small draw calls stalls the CPU, leaving the GPU underutilized."
      }
    ]
  },

  // ==========================================
  // SEMESTER 4: UNREAL ENGINE
  // ==========================================
  "sem4_m1": {
    title: "Unreal Editor Interface",
    concept: "Unreal Engine 5 (UE5) manages assets through the Content Browser and organizes scenes via the World Outliner. The Engine uses a coordinate system (X: Forward/Red, Y: Right/Green, Z: Up/Blue) and handles packaging, level division, and asset streaming.",
    code: `// Coordinate reference in Unreal C++
FVector ForwardDirection = FVector::ForwardVector; // (1, 0, 0)
FVector RightDirection   = FVector::RightVector;   // (0, 1, 0)
FVector UpDirection      = FVector::UpVector;      // (0, 0, 1)`,
    trap: "Interviewer asks: 'In Unreal coordinate space, which vector points forward?' Do not say Z (common in Unity/OpenGL) or Y (common in Blender/Maya). Unreal Engine is a Left-Handed coordinate system where positive X is Forward, positive Y is Right, and positive Z is Up.",
    quiz: [
      {
        q: "What is the default forward direction axis in Unreal Engine?",
        options: ["Z Axis (Blue)", "X Axis (Red)", "Y Axis (Green)", "W Axis"],
        correct: 1,
        exp: "Unreal Engine uses a left-handed coordinate system where X represents the forward axis, Y represents right, and Z represents up."
      },
      {
        q: "What panel in the Unreal Editor is used to search and manage game asset files?",
        options: ["World Outliner", "Details Panel", "Content Browser", "Modes Panel"],
        correct: 2,
        exp: "The Content Browser is the primary panel for importing, organizing, and managing asset packages, Blueprints, and levels."
      }
    ]
  },
  "sem4_m2": {
    title: "Unreal Gameplay Framework",
    concept: "The Unreal Gameplay Framework defines game rules and actors. `AGameModeBase` defines rules, spawn parameters, and player controller associations. Actors populate the scene: `AController` represents mind (handling player input or AI logic), `APawn` represents physical body, and `ACharacter` adds movement logic.",
    code: `#include "GameFramework/Character.h"
#include "MyPlayerCharacter.generated.h"

UCLASS()
class AMyPlayerCharacter : public ACharacter {
    GENERATED_BODY()
public:
    AMyPlayerCharacter() {
        // Setup movement component settings
    }
};`,
    trap: "Interviewer asks: 'Where should you handle player input: inside the Character class or PlayerController?' Answer: 'Input configurations should be handled in the PlayerController. This keeps input logic separate from character state, allowing you to easily swap characters (e.g., entering a vehicle or switching heroes) without rewriting input handlers.'",
    quiz: [
      {
        q: "Which class acts as the 'brain' that possesses and controls a Pawn in Unreal?",
        options: ["AHud", "AGameModeBase", "AController", "AActor"],
        correct: 2,
        exp: "PlayerControllers and AIControllers possess pawns, handling raw input translation and AI state machines to direct pawn actions."
      },
      {
        q: "Where are the primary rules of a multiplayer match (like win/loss logic) executed?",
        options: ["APlayerController", "AGameModeBase", "AHud", "AGameStateBase"],
        correct: 1,
        exp: "The GameMode exists solely on the server, enforcing rules, managing score conditions, and handling player login flows."
      }
    ]
  },
  "sem4_m3": {
    title: "Blueprints Visual Scripting",
    concept: "Blueprints are visual script classes compiled into bytecode and run by a VM. They enable visual state design, variable bindings, and event handling. While useful for rapid prototyping, Blueprint VM execution is slower than C++.",
    code: `// Exposing a C++ function to Blueprints
UFUNCTION(BlueprintCallable, Category = "Combat")
void ApplyDamageToEnemy(float DamageAmount);

// Exposing a C++ variable to Blueprints
UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
float PlayerHealth = 100.f;`,
    trap: "Interviewer asks: 'What is the performance cost of Blueprints?' Blueprint code runs inside an interpreter Virtual Machine, which makes it 10x-100x slower than compiled native C++. Avoid running complex loops, math, or pathfinders in Blueprints; implement them in C++ and expose them to Blueprints.",
    quiz: [
      {
        q: "What macro exposes C++ variables to Blueprint detail panels?",
        options: ["UFUNCTION", "UPROPERTY", "UCLASS", "USTRUCT"],
        correct: 1,
        exp: "UPROPERTY with specifiers like `EditAnywhere` or `BlueprintReadWrite` exposes member variables to the editor interface."
      },
      {
        q: "What is a main reason to avoid implementing complex math logic in Blueprints?",
        options: ["Blueprints do not support float variables", "Execution in the Blueprint VM is slower than native C++ code", "It prevents packaging", "It deletes actor references"],
        correct: 1,
        exp: "The VM execution overhead makes Blueprints slower than compiled C++ code. Perform performance-critical math in C++."
      }
    ]
  },
  "sem4_m4": {
    title: "Materials & Shaders in Unreal",
    concept: "Materials define surface appearances. In Unreal, materials are built using a visual node graph that compiles down to HLSL shaders. Shaders map to material coordinates: Base Color, Metallic, Specular, Roughness, and Normal maps.",
    code: `// Material Shader Concept: Normal Map calculation
// Vertex Normal is modified by Normal Map texture
// float3 worldNormal = TransformTangentToWorld(tangentNormal, input.worldTangentBasis);`,
    trap: "Interviewer asks: 'What is a Material Instance?' It is a dynamic variation of a parent material. Material instances use parameters instead of compiling new shaders, allowing you to modify visual properties (like changing colors or roughness) at runtime without compilation pauses.",
    quiz: [
      {
        q: "Why are Material Instances preferred over duplicating full Materials?",
        options: ["Instances consume less VRAM", "Instances change visual parameters without compiling new shaders, preventing runtime hitches", "Instances run on CPU", "Instances have no properties"],
        correct: 1,
        exp: "Material instances inherit compiled shader code from parent materials, updating parameters instantly without triggering compilation freezes."
      },
      {
        q: "What material parameter defines how shiny or reflective a surface is?",
        options: ["Base Color", "Roughness", "Opacity", "Ambient Occlusion"],
        correct: 1,
        exp: "Roughness controls micro-surface details. A value of 0 yields mirror-like reflections, while 1 scatters light, yielding a matte surface."
      }
    ]
  },
  "sem4_m5": {
    title: "Animation Blueprints & State Machines",
    concept: "Animation Blueprints evaluate character models and play bone animations. They feature two primary graphs: the Event Graph (fetching velocity and orientation variables) and the Anim Graph (evaluating final bone structures via State Machines and blend nodes).",
    code: `// Anim Instance reference in C++
#include "Animation/AnimInstance.h"
#include "MyAnimInstance.generated.h"

UCLASS()
class UMyAnimInstance : public UAnimInstance {
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Movement")
    float Speed;
};`,
    trap: "Interviewer asks: 'What is the performance risk of Animation Blueprints?' Evaluating bone blend weights on the CPU can become a bottleneck when many characters are active. To optimize, use Animation Budgets, run evaluations on worker threads, or use caching.",
    quiz: [
      {
        q: "Which graph in an Animation Blueprint evaluates bone transformations?",
        options: ["Event Graph", "Anim Graph", "Construction Script", "Macro Graph"],
        correct: 1,
        exp: "The Anim Graph evaluates animations, blends states, and calculates bone transforms to output the final pose."
      },
      {
        q: "What is the purpose of the Animation State Machine?",
        options: ["To translate coordinates", "To manage transitions between animation states (like Idle, Run, and Jump) based on variables", "To control player input", "To compile audio tracks"],
        correct: 1,
        exp: "Animation State Machines handle pose transitions (e.g. blending from idle to running as speed increases) based on state variables."
      }
    ]
  },
  "sem4_m6": {
    title: "Unreal Physics & Collisions",
    concept: "Unreal Engine uses Chaos Physics to compute rigid body kinematics and collisions. Objects use collision filters: **Trace Channels** (checking visibility or ray weapon hits) and **Object Channels** (handling physical pushes, bounding overlaps, and block dynamics).",
    code: `#include "Engine/World.h"

// Raycast Trace checking
void AMyCharacter::PerformRaycast() {
    FHitResult HitResult;
    FVector Start = GetActorLocation();
    FVector End = Start + (GetActorForwardVector() * 1000.f);
    
    FCollisionQueryParams Params;
    Params.AddIgnoredActor(this);
    
    // Line trace by Channel (ECC_Visibility)
    bool bHit = GetWorld()->LineTraceSingleByChannel(
        HitResult, Start, End, ECC_Visibility, Params
    );
}`,
    trap: "Interviewer asks: 'What is the performance difference between Collision Overlap events and Collision Block?' Block calculations resolve contacts mathematically, stopping movement, while Overlap checks act as simple triggers. Excessive overlap components on fast-moving objects can cause performance issues because they query large overlap arrays every frame.",
    quiz: [
      {
        q: "Which collision query is used to execute a weapon raycast hit scan?",
        options: ["Overlap Query", "Line Trace (Raycast) by Channel or Object", "Rigid Body Sweep", "Chaos Collision Event"],
        correct: 1,
        exp: "Line traces project a ray through the physics scene, returning hit details (actor, location, surface normal) for the first intersection."
      },
      {
        q: "What collision response stops an Actor from passing through a wall?",
        options: ["Ignore", "Overlap", "Block", "Destroy"],
        correct: 2,
        exp: "The Block response resolves collisions physically, stopping intersecting objects from passing through each other."
      }
    ]
  },
  "sem4_m7": {
    title: "UI Creation with UMG",
    concept: "Unreal Motion Graphics (UMG) builds 2D user interfaces. Interfaces are constructed by nesting visual widgets inside a hierarchy tree, and variable states are updated dynamically through property bindings or event delegates.",
    code: `// Widget Blueprint exposure in C++
#include "Blueprint/UserWidget.h"
#include "MyUserWidget.generated.h"

UCLASS()
class UMyUserWidget : public UUserWidget {
    GENERATED_BODY()
public:
    UPROPERTY(meta = (BindWidget))
    class UTextBlock* HealthText; // Automatically binds to Widget UI element
};`,
    trap: "Interviewer asks: 'Why are UI property bindings bad for optimization?' Placing property bindings on widget variables causes the UI to evaluate the bound function every frame. Instead, use an Event-Driven UI model: update text values only when the player's health actually changes.",
    quiz: [
      {
        q: "Why are direct Tick-based property bindings avoided in UMG?",
        options: ["They do not support integers", "They evaluate every frame, creating unnecessary overhead", "They crash the UI editor", "They do not compile"],
        correct: 1,
        exp: "Direct property bindings execute getter functions every tick. Use event-driven updates (e.g. updating the health bar only when damage is taken) instead."
      },
      {
        q: "What metadata specifier binds a C++ widget pointer to an editor widget item?",
        options: ["BlueprintCallable", "BindWidget", "EditAnywhere", "Category"],
        correct: 1,
        exp: "\`meta = (BindWidget)\` maps a C++ pointer to an editor widget of the same class and name, allowing C++ to update the UI directly."
      }
    ]
  },
  "sem4_m8": {
    title: "Audio Engine: Sound Cues & MetaSounds",
    concept: "Audio engines synthesize and play sounds. Unreal uses Sound Cues for mixing, and MetaSounds for procedural audio. Sounds are spawned at locations in 3D space, applying attenuation (volume drop-off over distance) and spatialization.",
    code: `#include "Kismet/GameplayStatics.h"
#include "Sound/SoundBase.h"

void PlayExplosionSound(USoundBase* sound, FVector location) {
    // Spawns 3D spatialized sound in world space
    UGameplayStatics::PlaySoundAtLocation(GetWorld(), sound, location);
}`,
    trap: "Interviewer asks: 'What is audio concurrency?' Audio concurrency restricts the maximum number of sound instances that can play simultaneously. If a particle system spawns 100 explosions, concurrency limits prevent voice channel exhaustion and CPU audio overhead by culling excess play requests.",
    quiz: [
      {
        q: "What is the primary advantage of MetaSounds in UE5 over Sound Cues?",
        options: ["Uses less disk space", "Provides fully procedural, node-based sound generation with sample-accurate execution control", "Runs on GPU", "Supports only stereo format"],
        correct: 1,
        exp: "MetaSounds act as a high-performance procedural synthesizer within the engine, allowing dynamic pitch and parameter modulation."
      },
      {
        q: "How does audio attenuation affect spatialized sound?",
        options: ["Changes sound pitch", "Reduces volume as the listener moves further away from the source location", "Speeds up sound execution", "Renders audio waves on screen"],
        correct: 1,
        exp: "Attenuation maps distance to volume curves, simulating physical sound drop-off over distance in 3D environments."
      }
    ]
  },

  // ==========================================
  // SEMESTER 5: UNREAL C++
  // ==========================================
  "sem5_m1": {
    title: "UObject Lifecycle & Garbage Collection",
    concept: "Unreal objects derive from `UObject`. Garbage Collection (GC) is automatic but runs on a separate thread, inspecting reference trees. If a `UObject` has no references starting from root objects, it is culled and deleted. `UPROPERTY()` flags are essential to register object pointers in the GC reference tree.",
    code: `UCLASS()
class AMyGameActor : public AActor {
    GENERATED_BODY()
    
    // GC can cull this if not registered!
    UPROPERTY()
    UTexture2D* PrimaryTexture; 
};`,
    trap: "Interviewer asks: 'What happens if a raw C++ pointer points to a UObject that gets garbage collected?' The UObject memory is reclaimed, leaving the raw pointer pointing to invalid memory (dangling pointer), causing a crash if dereferenced. Always use `UPROPERTY()` or `TWeakObjectPtr` for UObject pointers.",
    quiz: [
      {
        q: "How does Unreal's Garbage Collector identify active objects?",
        options: ["Simple reference counting", "By tracing a reference tree starting from Root objects, verifying objects are referenced by UPROPERTY() pointers", "Scanning system RAM", "Checking file structures"],
        correct: 1,
        exp: "Unreal uses a mark-and-sweep reference collector. Only objects reachable from root sets (like GameInstance) via UPROPERTY pointers are kept."
      },
      {
        q: "What wrapper class holds safe pointers to UObjects without preventing Garbage Collection?",
        options: ["std::shared_ptr", "TWeakObjectPtr", "UPROPERTY", "TSharedPtr"],
        correct: 1,
        exp: "\`TWeakObjectPtr\` references objects without preventing garbage collection. If the target is collected, the weak pointer resolves to nullptr."
      }
    ]
  },
  "sem5_m2": {
    title: "AActor & Component Architecture",
    concept: "Actors populate game scenes. Rather than containing logic in monolithic classes, actors delegate tasks to **Actor Components** (representing behavior like movement or inventory) and **Scene Components** (which have spatial transforms and attachment hierarchies).",
    code: `#include "Components/StaticMeshComponent.h"

UCLASS()
class AMyObject : public AActor {
    GENERATED_BODY()
    
    UPROPERTY(VisibleAnywhere, Category = "Visual")
    UStaticMeshComponent* MeshComponent;
public:
    AMyObject() {
        // Create Scene Component and set root
        MeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("MyMesh"));
        RootComponent = MeshComponent;
    }
};`,
    trap: "Interviewer asks: 'What is the difference between Actor Components and Scene Components?' Actor Components handle pure data or logic (no position). Scene Components inherit transform math, allowing them to be attached to other components and positioned in 3D space.",
    quiz: [
      {
        q: "Which component type can have a spatial transform and attachment links?",
        options: ["UActorComponent", "USceneComponent", "UObject", "FVector"],
        correct: 1,
        exp: "Scene Components inherit from Actor Components and add coordinate transforms (Position, Rotation, Scale) for 3D placement."
      },
      {
        q: "What C++ function is used inside constructors to instantiate components?",
        options: ["NewObject", "CreateDefaultSubobject", "SpawnActor", "make_shared"],
        correct: 1,
        exp: "\`CreateDefaultSubobject\` initializes component structures during actor construction, mapping assets in the editor."
      }
    ]
  },
  "sem5_m3": {
    title: "Unreal Delegates",
    concept: "Delegates implement observer patterns in Unreal Engine. They allow calling bound methods safely: **Single-cast** delegates bind to a single method, **Multi-cast** delegates call multiple bound methods, and **Dynamic** delegates can be bound and serialized inside Blueprints.",
    code: `// Define a Multicast Delegate signature
DECLARE_MULTICAST_DELEGATE_OneParam(FOnHealthChangedSignature, float /* NewHealth */);

class APlayerCharacter : public ACharacter {
public:
    // Delegate instance
    FOnHealthChangedSignature OnHealthChanged;
    
    void TakeDamage(float Amount) {
        Health -= Amount;
        OnHealthChanged.Broadcast(Health); // Triggers callbacks
    }
};`,
    trap: "Interviewer asks: 'Why use Dynamic Multicast Delegates over standard delegates?' Dynamic delegates compile with reflection data, allowing them to be bound inside Blueprint graphs. However, they are slower to execute due to dynamic name lookups.",
    quiz: [
      {
        q: "Which delegate type can be bound in Blueprint graphs?",
        options: ["DECLARE_DELEGATE", "DECLARE_MULTICAST_DELEGATE", "DECLARE_DYNAMIC_MULTICAST_DELEGATE", "DECLARE_EVENT"],
        correct: 2,
        exp: "Dynamic multicast delegates are reflected in the engine's serialization systems, exposing them as events in Blueprint graphs."
      },
      {
        q: "What function triggers callbacks on all registered delegate observers?",
        options: ["BindUObject", "Broadcast", "Execute", "Call"],
        correct: 1,
        exp: "Calling \`Broadcast()\` iterates and executes all registered callbacks, passing defined parameter arguments."
      }
    ]
  },
  "sem5_m4": {
    title: "Unreal Reflection System",
    concept: "Unreal C++ uses a custom pre-processor (Unreal Header Tool, UHT) to generate reflection metadata before compilation. Reflection metadata allows the engine to inspect class structures, automate garbage collection, serialize assets, and bind C++ methods to Blueprints.",
    code: `#include "GameFramework/Actor.h"
#include "MyTargetActor.generated.h" // Generated reflection data header

UCLASS(Blueprintable)
class AMyTargetActor : public AActor {
    GENERATED_BODY() // Injects UHT macros
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Stats")
    int32 ScoreVal;
};`,
    trap: "Interviewer asks: 'What is the purpose of the *.generated.h file?' This file is generated by the Unreal Header Tool (UHT). It contains boilerplate code that registers class reflection properties, vtable overrides, and serialization wrappers. It must be included as the last header in your header file.",
    quiz: [
      {
        q: "What program scans headers to generate C++ reflection data in Unreal?",
        options: ["MSBuild", "Unreal Header Tool (UHT)", "Clang", "DirectX compiler"],
        correct: 1,
        exp: "The Unreal Header Tool (UHT) parses headers containing UCLASS, UPROPERTY, and UFUNCTION macros, outputting boilerplate registration files."
      },
      {
        q: "Where must the generated reflection header (#include '*.generated.h') be placed in your header file?",
        options: ["At the very top", "As the last include directive in the header", "In the .cpp file instead", "Inside class constructors"],
        correct: 1,
        exp: "The generated header must be the last include in the header file, ensuring all class symbols are fully defined before registration macros."
      }
    ]
  },
  "sem5_m5": {
    title: "AI Systems: Behavior Trees & Blackboards",
    concept: "Unreal AI uses **Blackboards** to store shared variable states (e.g. target location, combat mode) and **Behavior Trees** to execute decision-making. Behavior trees are structured with Composites (Selectors check paths, Sequences step through actions) and Tasks (actions like pathing or attacking).",
    code: `// Accessing Blackboard parameters in C++ task node
#include "BehaviorTree/BlackboardComponent.h"

void UMyTask::ExecuteTask(UBehaviorTreeComponent& OwnerComp) {
    UBlackboardComponent* BB = OwnerComp.GetBlackboardComponent();
    AActor* Enemy = Cast<AActor>(BB->GetValueAsObject(TEXT("TargetEnemy")));
    // Act on enemy target
}`,
    trap: "Interviewer asks: 'What is the difference between Behavior Tree Selectors and Sequences?' A Selector evaluates child nodes from left to right and succeeds as soon as one child succeeds. A Sequence evaluates child nodes and fails as soon as one child fails, requiring all children to succeed to complete.",
    quiz: [
      {
        q: "Which Behavior Tree composite node executes children in sequence and fails if any child fails?",
        options: ["Selector", "Sequence", "Decorator", "Task"],
        correct: 1,
        exp: "Sequence nodes act as AND gates: they step through children sequentially and fail if any step fails."
      },
      {
        q: "Where are AI variables (like targets or positions) stored in Unreal's AI framework?",
        options: ["Anim Instance", "Blackboard Component", "Behavior Tree Task", "GameMode"],
        correct: 1,
        exp: "Blackboards act as local data storage for AI controllers, enabling behavior trees to read and modify shared states."
      }
    ]
  },
  "sem5_m6": {
    title: "Inventory Systems in C++",
    concept: "Inventory systems store items and manage slot allocations. To avoid memory overhead, inventory lists are represented as arrays of lightweight structures containing structural info (item ID, slot count) referencing static asset databases.",
    code: `#include "Engine/DataAsset.h"
#include "Inventory.generated.h"

UCLASS()
class UItemDataAsset : public UPrimaryDataAsset {
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, Category = "Details")
    FText ItemName;
};

USTRUCT(BlueprintType)
struct FInventorySlot {
    GENERATED_BODY()
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    UItemDataAsset* ItemData; // References static data asset
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 StackCount;
};`,
    trap: "Interviewer asks: 'How do you optimize inventory references in a multiplayer game?' Use a replication system that replicates lightweight struct updates (like item IDs and counts) rather than duplicating full data assets, reducing network bandwidth usage.",
    quiz: [
      {
        q: "Why are inventory items referencing static Data Assets instead of duplicating classes?",
        options: ["Data assets are read-only and shared in memory, minimizing duplication overhead", "Classes cannot be stored in arrays", "Saves compilation time", "Data assets run on GPU"],
        correct: 0,
        exp: "Data Assets store shared data once in memory. Inventory slots contain pointers to these shared assets, avoiding duplicate allocations."
      },
      {
        q: "What Unreal class is ideal for defining static database items (like weapon stats)?",
        options: ["UPrimaryDataAsset", "UActorComponent", "ALevelScriptActor", "APlayerState"],
        correct: 0,
        exp: "Primary Data Assets hold static configurations that can be loaded on-demand, making them perfect for item databases."
      }
    ]
  },
  "sem5_m7": {
    title: "Save Games & Serialization",
    concept: "Saving state requires serializing dynamic memory structures to disk. Unreal uses `USaveGame` to package variables. Properties marked `SaveGame` inside actors are serializable, writing to binary slots (`.sav` files).",
    code: `#include "GameFramework/SaveGame.h"
#include "MySaveGame.generated.h"

UCLASS()
class UMySaveGame : public USaveGame {
    GENERATED_BODY()
public:
    UPROPERTY(VisibleAnywhere, Category = "Basic")
    float PlayerHealth;
    
    UPROPERTY(VisibleAnywhere, Category = "Basic")
    FVector PlayerLocation;
};`,
    trap: "Interviewer asks: 'How do you serialize custom structs in USaveGame?' Ensure the struct has the `USTRUCT()` macro and its member variables are marked `UPROPERTY()`. This generates the necessary reflection metadata, allowing the serialization engine to read and write properties automatically.",
    quiz: [
      {
        q: "Which base class is used to define serializeable save state packages in Unreal?",
        options: ["USaveGame", "UObject", "AGameStateBase", "APlayerController"],
        correct: 0,
        exp: "USaveGame provides serialization wrappers, letting you save properties to disk slots via `UGameplayStatics::SaveGameToSlot`."
      },
      {
        q: "What macro parameter exposes class variables to the engine's serialization system?",
        options: ["BlueprintCallable", "UPROPERTY()", "USTRUCT", "DECLARE_DYNAMIC"],
        correct: 1,
        exp: "Marking variables with `UPROPERTY()` registers them with reflection, enabling the serialization engine to read their values."
      }
    ]
  },

  // ==========================================
  // SEMESTER 6: ADVANCED GAME PROGRAMMING
  // ==========================================
  "sem6_m1": {
    title: "Multiplayer Server-Client Model",
    concept: "AAA multiplayer games use an authoritative server model. The server runs game physics and logic, while client machines act as dummy terminals, sending inputs (commands) and receiving state updates, preventing client-side cheating.",
    code: `// Autoritative check in Actor tick
void AMyWeapon::FireWeapon() {
    // Only spawn damage calculations on server
    if (HasAuthority()) {
        DealDamage();
    } else {
        Server_RequestFire(); // Client requests fire RPC
    }
}`,
    trap: "Interviewer asks: 'How do you hide latency in client actions?' Use client-side prediction. When a client performs an action (like moving or shooting), they simulate the results locally immediately. If the server's authoritative state updates differ, the client reconciles their state.",
    quiz: [
      {
        q: "Why do competitive multiplayer games use authoritative servers?",
        options: ["To speed up GPU draws", "To prevent cheating by validating all game actions on a secure machine", "To save server memory", "To support split-screen"],
        correct: 1,
        exp: "Authoritative servers process all simulation logic, validating client inputs to prevent cheating like speed hacks or damage modifications."
      },
      {
        q: "What is client-side prediction?",
        options: ["Guessing server IP addresses", "Simulating gameplay actions locally immediately to hide network roundtrip latency", "Predicting player frame rates", "A shader compiler step"],
        correct: 1,
        exp: "Client-side prediction simulates movement and inputs locally instantly, hiding latency before the server's validation arrives."
      }
    ]
  },
  "sem6_m2": {
    title: "Networking: TCP vs. UDP",
    concept: "TCP and UDP are transport layer protocols. TCP guarantees ordered packet delivery via handshake confirmation, but is slower. UDP sends packets without validation, which is faster and essential for real-time games where resolving lag is prioritized over ordering.",
    code: `// UDP socket creation concept
// int socket_fd = socket(AF_INET, SOCK_DGRAM, 0); // SOCK_DGRAM specifies UDP
// TCP specifies SOCK_STREAM for reliable sessions`,
    trap: "Interviewer asks: 'Why is TCP avoided in real-time shooter games?' TCP uses a slide window confirmation. If a packet is lost, TCP stalls subsequent packet delivery until the lost packet is re-transmitted (head-of-line blocking), causing significant latency spikes.",
    quiz: [
      {
        q: "What is the primary drawback of using TCP in real-time games?",
        options: ["Small packet size limit", "Head-of-line blocking (lost packets stall subsequently received data)", "Lack of security", "Does not support IP addresses"],
        correct: 1,
        exp: "TCP guarantees order. If a packet drops, subsequent packets are held in buffer queue waiting for retransmission, causing major lag stutters."
      },
      {
        q: "Why is UDP preferred in competitive fast-paced action titles?",
        options: ["Simplifies socket creation", "UDP sends packets instantly without validation delays, avoiding head-of-line blocking", "Has automated data compression", "Restricts hackers"],
        correct: 1,
        exp: "UDP sends packets directly. If a packet is lost, the engine simply skips it and processes subsequent update packets, preserving low latency."
      }
    ]
  },
  "sem6_m3": {
    title: "Replication & RPCs in Unreal",
    concept: "Replication synchronizes actor states across the network. **Variable Replication** synchronizes variables from server to client, and **Remote Procedure Calls (RPCs)** invoke methods across machines: `Server` (run on server, called by client), `Client` (run on client, called by server), and `NetMulticast` (run on all clients, called by server).",
    code: `#include "Net/UnrealNetwork.h"

UCLASS()
class AMyPlayer : public ACharacter {
    GENERATED_BODY()
    
    // Replicated variable
    UPROPERTY(ReplicatedUsing = OnRep_Health)
    float Health;
    
    UFUNCTION()
    void OnRep_Health(); // Triggered on client on change
    
    // Server RPC
    UFUNCTION(Server, Reliable, WithValidation)
    void Server_NotifyDamage(float Damage);
};`,
    trap: "Interviewer asks: 'What is the validation check inside a Server RPC?' Server RPCs require validation methods: \`bool Server_NotifyDamage_Validate(float Damage) { return Damage <= MAX_DAMAGE; }\`. If validation returns false, the server detects client manipulation and disconnects the client.",
    quiz: [
      {
        q: "Which RPC type is called by a client but executes on the server?",
        options: ["Client RPC", "Server RPC", "NetMulticast RPC", "Dynamic RPC"],
        correct: 1,
        exp: "Server RPCs invoke methods on the authoritative server, allowing clients to request actions like firing weapons or picking up items."
      },
      {
        q: "What does the 'ReplicatedUsing' specifier accomplish in UPROPERTY?",
        options: ["Saves variable to disk", "Enables RepNotify, triggering a callback function on client machines whenever the variable replicates", "Runs on GPU", "Deletes variables"],
        correct: 1,
        exp: "RepNotify binding (\`ReplicatedUsing = FunctionName\`) calls a local method on clients when they receive a variable update from the server, useful for triggering UI updates."
      }
    ]
  },
  "sem6_m4": {
    title: "Rendering Optimization & GPU Profiling",
    concept: "Rendering optimization manages rendering budgets. Programmers use GPU profilers (Pix, RenderDoc) to analyze render pipelines, resolve draw call overhead through batching (Instancing), and optimize shaders by reducing instruction counts.",
    code: `// HLSL Optimization Tip: avoid division inside pixel shaders
// Bad: color = baseColor / scaleFactor;
// Good: float scaleInv = 1.0 / scaleFactor; color = baseColor * scaleInv; // Multiplies are faster than divides`,
    trap: "Interviewer asks: 'How do you identify if a game is CPU-bound or GPU-bound?' Run profile markers in the engine. If the CPU frame time matches the final frame time and the GPU is idle waiting for the next buffer, the game is CPU-bound (often due to game logic, physics, or draw calls). If the GPU is at 100% utilization and the CPU thread is sleeping, it is GPU-bound.",
    quiz: [
      {
        q: "What optimization is used to render 10,000 identical grass meshes in a single draw call?",
        options: ["Multi-threading", "Instanced Rendering (GPU Instancing)", "Vtable overrides", "LOD dynamic morphing"],
        correct: 1,
        exp: "Instancing sends geometry data once, then passes transform lists, allowing the GPU to render all instances in one draw call."
      },
      {
        q: "If a game is GPU-bound due to pixel fill rate, what optimization is most effective?",
        options: ["Optimizing CPU AI behaviors", "Reducing screen resolution or simplifying expensive pixel shader instructions", "Adding more polygons to meshes", "Using more mutex locks"],
        correct: 1,
        exp: "Fill rate bottlenecks occur when writing to too many pixels. Reducing resolution or optimizing pixel shader instructions solves this."
      }
    ]
  },
  "sem6_m5": {
    title: "Custom Memory Allocators & Pools",
    concept: "Default heap allocators (\`malloc\`/\`new\`) use search algorithms that trigger thread locks, causing runtime latency and memory fragmentation. In AAA games, we use custom allocators (like Stack, Arena, and Pool allocators) to pre-allocate memory blocks, executing allocations in O(1) time without thread locks.",
    code: `class PoolAllocator {
    struct Node { Node* next; };
    Node* m_freeList = nullptr;
    char* m_rawBuffer = nullptr;
public:
    PoolAllocator(size_t objectSize, size_t count) {
        m_rawBuffer = new char[objectSize * count];
        // Link all nodes into a free-list
        m_freeList = reinterpret_cast<Node*>(m_rawBuffer);
        // ... loop and link pointers ...
    }
    void* Allocate() {
        if (!m_freeList) return nullptr; // Exhausted
        void* addr = m_freeList;
        m_freeList = m_freeList->next;
        return addr;
    }
};`,
    trap: "Interviewer asks: 'Why does memory fragmentation happen, and how do custom allocators resolve it?' Memory fragmentation occurs when varying allocation sizes leave small, scattered free spaces in RAM that cannot fit subsequent larger allocations. Pool allocators allocate fixed-size blocks contiguously, completely preventing fragmentation.",
    quiz: [
      {
        q: "What is a main benefit of a Pool Allocator over standard malloc?",
        options: ["Supports different variable types", "Provides O(1) allocation speed and prevents memory fragmentation by allocating fixed-size blocks", "Reduces binary size", "Runs on GPU"],
        correct: 1,
        exp: "Pool allocators use pre-allocated buffers. Allocating an object is a simple free-list pointer shift, executing instantly without fragmentation."
      },
      {
        q: "What is an Arena (Stack) Allocator best used for?",
        options: ["Allocating persistent objects", "Temporary per-frame allocations that can be cleared all at once at the end of the frame by resetting the offset pointer to 0", "Network communication", "Audio synthesis"],
        correct: 1,
        exp: "Arenas are ideal for temporary allocations. We allocate elements sequentially and wipe the entire block at frame end, resetting the allocation pointer to 0."
      }
    ]
  },
  "sem6_m6": {
    title: "Advanced AI: EQS & Utility AI",
    concept: "Advanced AI uses **Environment Query System (EQS)** to analyze spatial surroundings (e.g. searching for cover locations) and **Utility AI** to evaluate decision-making by scoring potential actions based on curves.",
    code: `// EQS Query structure concept
// 1. Generate grid points around AI actor
// 2. Run distance test from enemy (score: invert distance, further points score higher)
// 3. Run trace test to verify point has cover collision block
// 4. Return highest scoring point coordinate`,
    trap: "Interviewer asks: 'What is the performance cost of EQS queries, and how do we optimize them?' EQS queries run spatial tests and trace calculations, which can become expensive. We optimize them by running queries asynchronously over multiple frames rather than executing them instantly in a single frame.",
    quiz: [
      {
        q: "What is the primary function of Environment Query System (EQS) in Unreal?",
        options: ["Compiling behavior trees", "Gathering and scoring spatial data about the environment to make spatial decisions (like finding cover)", "Syncing AI over networks", "Creating path graphs"],
        correct: 1,
        exp: "EQS generates points in space, runs tests (visibility, distance, pathfinding), and scores them to find optimal positions."
      },
      {
        q: "How does Utility AI differ from standard Behavior Trees?",
        options: ["Utility AI uses state machines only", "Utility AI evaluates decisions by scoring potential actions dynamically using mathematical curves, selecting the highest-scoring action", "Utility AI runs on the GPU", "Utility AI uses no blackboard variables"],
        correct: 1,
        exp: "Utility AI evaluates multiple parameters (health, ammo, enemy distance) to score actions, selecting the most appropriate action dynamically."
      }
    ]
  },

  // ==========================================
  // SEMESTER 7: GRAPHICS & ENGINE
  // ==========================================
  "sem7_m1": {
    title: "Graphics Pipeline: Rasterization vs. Ray Tracing",
    concept: "The Graphics Pipeline maps 3D vector coordinates to 2D screen pixels. Rasterization projects geometry onto screen planes, checking overlaps using depth buffers (Z-buffering). Ray Tracing shoots light rays from the camera into the scene, computing physical intersections, reflections, and refractions.",
    code: `// Graphics pipeline stages
// 1. Vertex Shader (projects 3D coords to clip space)
// 2. Rasterization (converts geometry to fragment pixels)
// 3. Pixel/Fragment Shader (calculates light colors)
// 4. Output Merger (depth buffer/blend checks)`,
    trap: "Interviewer asks: 'Why is ray tracing computationally expensive compared to rasterization?' Rasterization projects geometry onto the screen in a linear pass. Ray tracing queries complex spatial acceleration structures (BVH - Bounding Volume Hierarchy) to trace millions of rays, requiring massive ray-triangle intersection math.",
    quiz: [
      {
        q: "Which pipeline stage projects 3D vertices into screen clip space?",
        options: ["Pixel Shader", "Vertex Shader", "Rasterizer", "Output Merger"],
        correct: 1,
        exp: "Vertex shaders transform vertex inputs (local coordinates) through world, view, and projection matrices into homogeneous clip coordinates."
      },
      {
        q: "What acceleration structure is queried to speed up ray-triangle intersections in ray tracing?",
        options: ["Hash Table", "Bounding Volume Hierarchy (BVH)", "Vtable", "Graph Tree"],
        correct: 1,
        exp: "BVH wraps scene geometry in hierarchy boxes. Ray tracing queries this tree structure to prune empty areas, avoiding intersecting every polygon."
      }
    ]
  },
  "sem7_m2": {
    title: "OpenGL Architecture & Contexts",
    concept: "OpenGL is a cross-platform graphics API. It operates as a state machine. OpenGL state parameters (active buffers, texture binds, shader programs) are bound to an active context. Developers use VAOs (Vertex Array Objects) and VBOs (Vertex Buffer Objects) to pass vertex data to the GPU.",
    code: `// OpenGL Vertex Buffer configuration
GLuint VAO, VBO;
glGenVertexArrays(1, &VAO);
glGenBuffers(1, &VBO);

glBindVertexArray(VAO);
glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

// Define vertex position attribute layout
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);`,
    trap: "Interviewer asks: 'What is the performance drawback of OpenGL state changes?' Bind operations (like changing shaders or textures) require CPU driver overhead. To optimize, minimize state changes by grouping similar objects and using texture atlases.",
    quiz: [
      {
        q: "Which object stores vertex attribute layouts and pointers in OpenGL?",
        options: ["VBO (Vertex Buffer Object)", "VAO (Vertex Array Object)", "FBO (Frame Buffer Object)", "Texture Object"],
        correct: 1,
        exp: "VAO stores configurations of vertex attributes (offsets, sizes) and references VBOs containing raw vertex buffer arrays."
      },
      {
        q: "What is a main bottleneck when calling glDrawArrays or glDrawElements in a loop?",
        options: ["Memory leaks", "CPU driver overhead to synchronize and process GPU states", "Shader compilation delays", "L1 cache size exceed"],
        correct: 1,
        exp: "Each draw call requires CPU drivers to validate states. Minimize draw call loops by batching geometry to prevent stalling the CPU."
      }
    ]
  },
  "sem7_m3": {
    title: "DirectX Command Buffers",
    concept: "DirectX 12 is a low-overhead graphics API. Unlike OpenGL's global state, DX12 uses **Command Queues** and **Command Lists** to record rendering tasks in parallel across CPU threads. Command lists are submitted to Command Queues for execution by the GPU, resolving CPU rendering bottlenecks.",
    code: `// DX12 Command List Submission concept
// ID3D12GraphicsCommandList* commandList;
// ID3D12CommandQueue* commandQueue;
// commandList->Close(); // Close recording
// ID3D12CommandList* ppCommandLists[] = { commandList };
// commandQueue->ExecuteCommandLists(1, ppCommandLists); // Submit to GPU`,
    trap: "Interviewer asks: 'Why did DX12 introduce Pipeline State Objects (PSO)?' In older APIs, compilers compiled shaders and resolved blend states at draw-time, causing hitches. PSOs pre-compile all pipeline states (shaders, blend states, depth checks) into a single object during loading, preventing runtime hitches.",
    quiz: [
      {
        q: "What is a key optimization of DirectX 12 over older graphics APIs?",
        options: ["Simplifies shader creation", "Enables parallel command recording across multiple CPU threads using Command Lists", "Provides automated garbage collection", "Eliminates matrices"],
        correct: 1,
        exp: "DX12 allows separate threads to record render commands into distinct lists, submitting them all at once to keep the GPU fully utilized."
      },
      {
        q: "What does a Pipeline State Object (PSO) encapsulate?",
        options: ["Textures only", "The complete pipeline state (compiled vertex/pixel shaders, depth stencil, rasterizer state, blend states)", "The camera position", "System audio tracks"],
        correct: 1,
        exp: "PSO compiles the complete rendering configuration down to GPU machine code, eliminating validation hitches on draw calls."
      }
    ]
  },
  "sem7_m4": {
    title: "Shader Programming (HLSL / GLSL)",
    concept: "Shaders compile to run directly on the GPU. Vertex Shaders project vertex locations into clip space. Pixel (Fragment) Shaders run for each rasterized pixel fragment, outputting the final color.",
    code: `// HLSL Vertex Shader example
cbuffer ConstantBuffer : register(b0) {
    matrix WorldViewProjection;
};

struct VS_INPUT {
    float4 Position : POSITION;
    float2 TexCoord : TEXCOORD0;
};

struct VS_OUTPUT {
    float4 Position : SV_POSITION;
    float2 TexCoord : TEXCOORD0;
};

VS_OUTPUT main(VS_INPUT input) {
    VS_OUTPUT output;
    output.Position = mul(input.Position, WorldViewProjection);
    output.TexCoord = input.TexCoord;
    return output;
}`,
    trap: "Interviewer asks: 'What is a dependent texture read in a pixel shader?' It occurs when pixel shaders sample a texture using coordinates calculated inside the pixel shader rather than using unmodified vertex UVs. This prevents the GPU from pre-fetching texture data, causing cache stalls.",
    quiz: [
      {
        q: "Which shader type is responsible for calculating individual pixel colors?",
        options: ["Vertex Shader", "Pixel (Fragment) Shader", "Geometry Shader", "Compute Shader"],
        correct: 1,
        exp: "Pixel shaders run on fragment pixels, computing lighting, textures, and blending to yield the final RGBA outputs."
      },
      {
        q: "What is the performance impact of dynamic branch instructions (if/else checks) inside shaders?",
        options: ["No impact", "GPU execution threads execute both branch paths (branch divergence) if neighboring pixels check different conditions, degrading performance", "Causes memory leaks", "Shader crashes"],
        correct: 1,
        exp: "GPUs run threads in lockstep (warps). If pixels check different paths, the warp runs both paths sequentially, neutralizing parallel processing."
      }
    ]
  },
  "sem7_m5": {
    title: "Lighting Models: Phong vs. PBR",
    concept: "Lighting models approximate how light interacts with surfaces. The **Phong** model is an empirical approximation: Ambient + Diffuse + Specular. **Physically Based Rendering (PBR)** uses physics-based formulas (Cook-Torrance BRDF) to calculate reflections based on roughness, metallic, and energy conservation, rendering realistic surfaces under any lighting environment.",
    code: `// Phong reflection specular math: Specular = (R · V)^Shininess
// R = reflect(-LightDir, Normal);
// float specularInt = pow(max(dot(R, ViewDir), 0.0), Shininess);`,
    trap: "Interviewer asks: 'What does energy conservation mean in PBR?' A surface cannot reflect more light than it receives. If a PBR shader calculates high specular reflections, it must reduce diffuse reflection accordingly, preventing glowing materials.",
    quiz: [
      {
        q: "What concept in PBR prevents materials from reflecting more light than they receive?",
        options: ["Ambient Occlusion", "Energy Conservation", "Subsurface Scattering", "Z-buffering"],
        correct: 1,
        exp: "Energy conservation ensures that diffuse and specular light reflections do not sum to exceed the incoming light energy."
      },
      {
        q: "What is the specular component in the Phong lighting model representing?",
        options: ["The flat base color", "The bright highlight reflection (reflection of light source on shiny surface)", "Self-shadowed areas", "Refracted light"],
        correct: 1,
        exp: "Specular highlights approximate specular reflection of light sources, scaling in sharpness based on material shininess."
      }
    ]
  },
  "sem7_m6": {
    title: "Post Processing Shaders",
    concept: "Post Processing shaders apply visual effects to screen-space render targets (textures) after rendering the scene. Common post-processing effects include bloom (light bleeding), color grading, and tone mapping (mapping high-dynamic-range HDR colors back to standard SDR monitor colors).",
    code: `// HLSL Tonemapping Pixel Shader concept
// float3 TonemapReinhard(float3 hdrColor) {
//     return hdrColor / (hdrColor + float3(1.0, 1.0, 1.0));
// }`,
    trap: "Interviewer asks: 'What is tone mapping and why is it necessary?' Rendering engines use high-dynamic-range (HDR) floats (values > 1.0) for physics-based lighting computations. Tone mapping maps these HDR floats back to standard 0.0–1.0 ranges for SDR monitors, preserving highlights and shadow detail.",
    quiz: [
      {
        q: "What is the purpose of tone mapping post-process shaders?",
        options: ["Compiling vector graphics", "Mapping High Dynamic Range (HDR) colors back to standard SDR monitor color limits (0.0 to 1.0)", "Resolving draw call spikes", "Generating shadows"],
        correct: 1,
        exp: "Tone mapping maps bright HDR lighting calculations into displayable ranges, protecting details from washing out into flat whites."
      },
      {
        q: "How are post-processing shaders executed?",
        options: ["By drawing a full-screen quad (a single rectangle) and processing the screen texture inside a pixel shader", "By running vertex animations", "By deleting depth buffers", "By loading sound cues"],
        correct: 0,
        exp: "Post-processing draws a single screen-space rectangle, reading the frame buffer texture to apply filters in the pixel shader."
      }
    ]
  },
  "sem7_m7": {
    title: "GPU Debugging with RenderDoc & Pix",
    concept: "GPU debuggers (RenderDoc, Pix) capture graphics frames, allowing programmers to inspect pipeline states. They trace draw call execution, review bound buffers, verify texture bindings, and identify draw-time glitches.",
    code: `// RenderDoc capture marker integrations
// #include "renderdoc_app.h"
// RENDERDOC_API_1_1_2* rdoc_api = nullptr;
// if(rdoc_api) rdoc_api->StartFrameCapture(NULL, NULL);
// // Draw commands...
// if(rdoc_api) rdoc_api->EndFrameCapture(NULL, NULL);`,
    trap: "Interviewer asks: 'How do you debug an actor mesh that is invisible on screen?' Capture a frame in RenderDoc, find the corresponding draw call, and check: 1) Vertex shader transformations (are coordinates projected behind the camera?), 2) Backface culling settings (are triangles inside out?), and 3) Depth test settings (is the mesh blocked by invalid depth data?).",
    quiz: [
      {
        q: "What is a frame capture in RenderDoc used for?",
        options: ["Logging CPU thread counts", "Inspecting rendering states, textures, bound buffers, and shaders step-by-step for a single frame", "Measuring build compilation times", "Generating assets"],
        correct: 1,
        exp: "Frame captures record all graphics API commands for a frame, allowing developers to inspect pipeline states at any draw call."
      },
      {
        q: "If a mesh is invisible because it fails the depth test, what will RenderDoc show?",
        options: ["Mesh triangles are drawn but discarded in the output merger stage due to depth comparison failure", "A compiler error", "Texture size of 0 bytes", "Shader compilation stall"],
        correct: 0,
        exp: "RenderDoc reveals if geometry is rasterized but discarded during depth checks because it is positioned behind existing pixels."
      }
    ]
  },

  // ==========================================
  // SEMESTER 8: PRODUCTION & CAREER
  // ==========================================
  "sem8_m1": {
    title: "Steam & Console Publishing",
    concept: "Publishing releases compiled binaries to stores. Steam requires managing depots, configuring achievements, and integrating the Steamworks SDK. Consoles (PlayStation, Xbox, Switch) require devkit authorization, memory usage compliance, and passing TCR/TRC (Technical Requirement Checklist) certifications.",
    code: `// Steamworks API integration check
#include "steam/steam_api.h"

void InitializeGameSystem() {
    if (SteamAPI_Init()) {
        // Steam systems active, unlocks achievements / cloud saves
        SteamUserStats()->RequestCurrentStats();
    }
}`,
    trap: "Interviewer asks: 'What is a TRC/TCR check?' It is a strict checklist enforced by console makers (Sony, Microsoft, Nintendo). If a game crashes during user profile sign-in, freezes on controller disconnects, or displays incorrect console icons, it fails TRC certification, delaying release.",
    quiz: [
      {
        q: "What are TRC/TCR checklists in console publishing?",
        options: ["Shader optimization templates", "Technical requirements checklists (handling user logins, profile swaps, controller disconnects) enforced by console platforms", "A network protocol", "A Git branch structure"],
        correct: 1,
        exp: "TRC (Technical Requirement Checklist) tests ensure games behave correctly under system events, protecting player experiences."
      },
      {
        q: "What is the role of Steam Depots?",
        options: ["To play sound assets", "To store and deliver localized game binaries, textures, and executable files to players", "To compile shaders", "To run multiplayer lobbies"],
        correct: 1,
        exp: "Depots act as storage partitions on Steam servers, delivering correct files (like language or OS-specific assets) to clients."
      }
    ]
  },
  "sem8_m2": {
    title: "Source Control in AAA: Perforce vs. Git",
    concept: "Source control tracks modifications to project files. While Git is popular for code repositories, AAA studios use Perforce (Helix Core) or Git LFS. Perforce handles large binary files (textures, audio, meshes) efficiently, supports file locking to prevent merge conflicts on binary assets, and runs on a centralized server.",
    code: `# Example .gitattributes configuration for Git LFS
# ...
*.uasset filter=lfs diff=lfs merge=lfs -text
*.umap filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text`,
    trap: "Interviewer asks: 'Why is standard Git bad for artists?' Git stores a complete history of every file version locally. If an artist updates a 500MB mesh 10 times, Git clones will download all 10 versions, inflating repository size. Perforce downloads only the requested revision by default, saving space.",
    quiz: [
      {
        q: "Why do AAA studios prefer Perforce over standard Git?",
        options: ["Perforce has no command line", "Perforce handles massive binary assets (Giga-scale maps) efficiently and supports file locking to prevent merge conflicts", "Perforce compiles C++ code", "Perforce has zero servers"],
        correct: 1,
        exp: "Perforce handles large binaries and locks files to prevent multiple designers from editing the same map simultaneously."
      },
      {
        q: "What Git extension is required to store large binary assets without inflating the main repository database?",
        options: ["Git Bash", "Git LFS (Large File Storage)", "Git Submodules", "GitHub Copilot"],
        correct: 1,
        exp: "Git LFS replaces large assets in the repository with small text pointers, storing the actual binaries on a separate storage server."
      }
    ]
  },
  "sem8_m3": {
    title: "Team Workflows & Production Methodologies",
    concept: "Game development requires coordination across departments (design, art, engineering, QA). Teams use agile methodologies (Scrum, Kanban) to track progress, resolve feature backlogs, and run sprint reviews to monitor milestones.",
    code: `// Agile workflow example:
// Sprint Planning ➔ Active Daily Standups ➔ Sprint Review (Milestone validation)`,
    trap: "Interviewer asks: 'What is Feature Creep?' It is the insertion of unplanned features during development. This extends schedules, increases testing scope, and dilutes development focus, risking release dates or causing team burnout.",
    quiz: [
      {
        q: "What agile methodology uses visual boards to track task status (To Do, In Progress, Done)?",
        options: ["Scrum", "Kanban", "Waterfalls", "Refactoring"],
        correct: 1,
        exp: "Kanban boards visualize tasks as columns, helping teams manage work-in-progress limits and identify bottlenecks."
      },
      {
        q: "What is feature creep?",
        options: ["A graphics shader bug", "The uncontrolled expansion of project scope without adjustments to time, budget, and resources", "A multithreading race condition", "A sound attenuation glitch"],
        correct: 1,
        exp: "Feature creep introduces scope drift. Manage it by defining clear requirements and reviewing new requests against release budgets."
      }
    ]
  },
  "sem8_m4": {
    title: "Build Systems & CI/CD for Unreal",
    concept: "Continuous Integration & Continuous Deployment (CI/CD) automates build processes. AAA build systems run automated pipelines: when code is pushed to Perforce/Git, the build server triggers compile processes (UAT - Unreal Automation Tool), compiles shaders, runs unit tests, and packages release candidates.",
    code: `# Example Jenkins/GitHub Actions command block to package Unreal project
# Run Unreal Automation Tool (UAT) build script
RunUAT.bat BuildCookRun -project="MyGame.uproject" -platform=Win64 -clientconfig=Development -cook -stage -archive -archivedirectory="C:/Builds"`,
    trap: "Interviewer asks: 'What is Shader Cooking?' Cooking converts platform-agnostic assets (textures, shaders) into platform-specific optimized binary assets (e.g. converting textures to DXT format for DirectX, or compiling shaders for PlayStation's GPU). This is critical for packages to run on console platforms.",
    quiz: [
      {
        q: "What is compile cooking in Unreal Engine packaging?",
        options: ["Cleaning source files", "Converting platform-agnostic assets (textures, shaders) into optimized binary formats specific to target hardware", "Testing sound cues", "Applying post-processing"],
        correct: 1,
        exp: "Cooking compiles shaders and transforms assets into hardware-optimized formats (e.g., textures into DXT/PVRTC formats)."
      },
      {
        q: "What CI/CD benefit is most critical for game development?",
        options: ["Writing code automatically", "Automated packaging and nightly testing to catch compile breaks and regression bugs early", "Removing code variables", "Speeds up GPU calculations"],
        correct: 1,
        exp: "Nightly automated builds and tests identify compile errors and regression bugs early, preventing code breaks from stalling development."
      }
    ]
  },
  "sem8_m5": {
    title: "Interview Prep & DSA Strategy",
    concept: "AAA Gameplay programming interviews test technical depth: standard DSA algorithms (arrays, sorting, trees, graphs), C++ specifics (VTABLE lookup, smart pointer counters, alignment), game math (dot/cross products, SLERP), and engine architecture.",
    code: `// Typical whiteboard problem: fast bullet intersection
// Given player pos P, enemy pos E, check if bullet hit sphere radius R
// bool RaySphereIntersect(Vector3 P, Vector3 dir, Vector3 E, float R) { ... }`,
    trap: "Interviewer asks: 'How do you check if two bounding spheres collide?' Do not use a square root. Compare the squared distance between their centers against the squared sum of their radii: \`float d2 = DistSquared(A.Center, B.Center); float rSum = A.Radius + B.Radius; bool hit = d2 <= rSum * rSum;\`.",
    quiz: [
      {
        q: "What topic is heavily tested in AAA gameplay programmer interviews?",
        options: ["Web scripting languages", "C++ memory specifics (VTABLEs, cache spatial locality, custom allocators) and 3D vector math (dot/cross products)", "Operating system registry configs", "HTML design styles"],
        correct: 1,
        exp: "AAA studios require deep systems knowledge, focusing on hardware-conscious C++ layouts and spatial linear algebra math."
      },
      {
        q: "How should you answer design pattern questions during interviews?",
        options: ["Recommend using patterns everywhere", "Explain the trade-offs, particularly the performance implications (like cache misses, vtable lookups, or allocations)", "Only write pseudocode", "Avoid patterns"],
        correct: 1,
        exp: "Patterns decouple code but can introduce performance trade-offs. Discussing these tradeoffs demonstrates professional senior-level engineering experience."
      }
    ]
  },
  "sem8_m6": {
    title: "Resume & Portfolio Polishing",
    concept: "Resumes and portfolios demonstrate gameplay engineering skills. Portfolios should feature 3-4 high-quality C++ or Unreal Engine projects showcasing technical implementations (e.g. physics solvers, replication net code, Custom ECS, shader effects) rather than simple visual templates.",
    code: `// Markdown template for portfolio README
// ## Project Title
// * **Technical Highlights**: Custom multithreaded job system, O(1) grid collision search
// * **C++ Implementation**: Pointer math, templates, custom memory allocations
// * **Video/GIF Demo**: Link to gameplay capture`,
    trap: "Interviewer asks: 'What is the most common mistake in game dev portfolios?' The most common mistake is showcasing generic tutorials (like a basic platformer) or showing templates without explaining custom code. Recruiters want to see custom, raw gameplay code, optimizations, and detailed explanations of your implementation choices.",
    quiz: [
      {
        q: "What type of project is most appealing to AAA technical recruiters?",
        options: ["Simple template game clones without edits", "Highly technical implementations (like custom physics, network systems, or memory allocators) complete with source code links", "Static design documents only", "A list of completed certificates"],
        correct: 1,
        exp: "Recruiters seek engineering proof. Showcasing complex custom systems demonstrates direct technical capability."
      },
      {
        q: "How should technical highlights be described on resumes?",
        options: ["Using vague descriptions like 'added combat'", "Using action verbs and highlighting measurable optimizations (e.g. 'reduced CPU allocations by 40% using object pools')", "Writing full code segments", "Listing team directories"],
        correct: 1,
        exp: "Highlighting measurable results (e.g., framing performance improvements in frame time reductions) proves system optimization capability."
      }
    ]
  }
};
