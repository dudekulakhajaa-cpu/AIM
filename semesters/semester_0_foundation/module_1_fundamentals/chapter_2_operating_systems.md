# Chapter 2 â€” Operating Systems & Threading

An OS acts as the mediator between game code and the hardware. Writing high-performance gameplay systems requires understanding how OS scheduling and memory layout work.

## ðŸ”‘ Key Concepts

### 1. Operating Systems: Windows vs. Linux
- **Windows**: The primary platform for AAA games due to DirectX dominance and historical hardware support.
- **Linux**: Dominates server backends for multiplayer games (run-time efficiency, containerization).

### 2. Memory Space: Kernel vs. User Mode
- **User Mode**: Where game code runs. Limited access to hardware.
- **Kernel Mode**: Privileged mode for device drivers and direct hardware access. Switching between user and kernel mode (syscalls) is expensive.

### 3. Processes and Threads
- **Process**: An isolating wrapper containing an allocated memory space, file handles, security contexts, and threads.
- **Thread**: The smallest unit of execution that the OS can schedule on a CPU core. Multiple threads inside a process share the same memory space.
- **Context Switch**: The process of saving the state of a thread and loading another thread. High context-switch overhead can stutter games.

### 4. Multithreading in Games
- Games historically ran on a single thread. Modern game engines use **Task Graphs / Job Systems** to distribute work (e.g., animations on thread A, physics on thread B, rendering command buffer generation on thread C).
- **Race Condition**: Multiple threads writing/reading shared memory without synchronization, leading to undefined behavior or crashes.

---

## âš¡ Self-Assessment / Exam Prep
1. Explain the difference between a process and a thread.
2. What is a mutex, and how does it prevent race conditions? What is the risk of using them too frequently?