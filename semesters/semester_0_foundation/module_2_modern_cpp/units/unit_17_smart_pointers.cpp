// Unit 17: Smart Pointers (C++11/14/17)
#include <iostream>
#include <memory>

class Weapon {
public:
    Weapon() { std::cout << "Weapon Created!\n"; }
    ~Weapon() { std::cout << "Weapon Destroyed!\n"; }
    void Fire() { std::cout << "Bang!\n"; }
};

int main() {
    // 1. std::unique_ptr (Exclusive ownership)
    // Automatically cleans up memory when it goes out of scope.
    std::cout << "--- Unique Pointer ---\n";
    {
        std::unique_ptr<Weapon> gun = std::make_unique<Weapon>();
        gun->Fire();
    } // gun goes out of scope here -> Weapon is automatically destroyed!
    
    // 2. std::shared_ptr (Shared ownership)
    // Uses a reference count tracker.
    std::cout << "\n--- Shared Pointer ---\n";
    std::shared_ptr<Weapon> weapon1 = std::make_shared<Weapon>();
    {
        std::shared_ptr<Weapon> weapon2 = weapon1; // Ref count increments to 2
        std::cout << "Ref Count: " << weapon1.use_count() << "\n";
    } // weapon2 goes out of scope -> Ref count decrements to 1
    std::cout << "Ref Count after block: " << weapon1.use_count() << "\n";
    
    // EXERCISE: Create a unique_ptr to a double value, initialize it, and read the value.
    
    return 0;
} // weapon1 goes out of scope -> Ref count becomes 0 -> Weapon destroyed!