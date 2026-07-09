# Chapter 1 â€” How Computers Work

This study guide focuses on core computer hardware fundamentals necessary for low-level gameplay optimizations.

## ðŸ”‘ Key Concepts

### 1. The CPU (Central Processing Unit)
- The brain of the computer. It executes instructions using the **Fetch-Decode-Execute** cycle.
- **ALU (Arithmetic Logic Unit)** handles mathematics and logic operations.
- **Control Unit** coordinates execution.
- **Registers**: Extremely fast, small storage locations inside the CPU itself.

### 2. RAM (Random Access Memory)
- Volatile workspace memory.
- Slower than registers but holds the working set of your processes.
- Gameplay optimization relies heavily on how data flows from RAM to CPU registers.

### 3. CPU Cache Hierarchy
- **L1 Cache**: Smallest, fastest, per-core. Usually 32KBâ€“64KB. Runs at CPU core speeds (1 cycle latency).
- **L2 Cache**: Medium, fast. Usually 256KBâ€“512KB per core. Slightly higher latency (4â€“10 cycles).
- **L3 Cache**: Large, shared across all cores. 2MBâ€“32MB+ (L3 is shared). Latency is 30â€“60 cycles.
- **Cache Miss**: When the CPU requests data that is not in L1/L2/L3 cache, it has to fetch it from RAM (200+ cycles latency). This causes "CPU stalling" which kills frame rates. Understanding cache is critical for writing performant game loops.

### 4. GPU (Graphics Processing Unit)
- Massive parallel processor with thousands of smaller, simpler cores designed to process vertices and pixels simultaneously.
- Highly optimized for vector and matrix calculations.

### 5. Binary & Hexadecimal
- All digital computers operate on **bits** (0 and 1).
- **Byte**: 8 bits.
- **Hexadecimal (Hex)**: Base 16 notation (0-9, A-F). Used extensively in debugging memory addresses and defining colors (e.g., `#FF00FF`).

---

## âš¡ Self-Assessment / Exam Prep
1. Why is a cache miss bad for game frame rates, and how does sequential array access vs. linked list traversal affect cache performance?
2. Represent the decimal number `42` in binary.