// Unit 1: Variables & Initialization
#include <iostream>

int main() {
    // 1. Old C-Style initialization
    int num1 = 10;
    
    // 2. C++11 Uniform initialization (List initialization)
    // Prevents narrowing conversions (e.g. initializing double into int implicitly)
    int num2{20};
    
    std::cout << "Number 1: " << num1 << "\n";
    std::cout << "Number 2: " << num2 << "\n";
    
    // EXERCISE: Initialize a double and float using uniform list initialization and print them.
    
    return 0;
}