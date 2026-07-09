// Unit 8: Pointers
#include <iostream>

void modifyValue(int* ptr) {
    if (ptr != nullptr) {
        *ptr = 99; // Dereference pointer to modify original value
    }
}

int main() {
    int health = 100;
    int* pHealth = &health; // Store memory address of health
    
    std::cout << "Original Health: " << health << "\n";
    std::cout << "Address of Health: " << pHealth << "\n";
    std::cout << "Dereferenced Health: " << *pHealth << "\n";
    
    modifyValue(pHealth);
    std::cout << "Health after modification: " << health << "\n";
    
    // Null pointers: Always verify pointers before dereferencing!
    int* pNull = nullptr;
    
    // EXERCISE: Create a pointer that points to a double variable. Modify the double through the pointer and print the result.
    
    return 0;
}