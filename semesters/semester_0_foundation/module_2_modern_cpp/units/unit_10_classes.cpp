// Unit 10: Classes & Encapsulation
#include <iostream>
#include <string>

class Player {
private:
    std::string name;
    int health;
    int score;

public:
    // Constructor
    Player(std::string pName, int pHealth) 
        : name(pName), health(pHealth), score(0) {} // Member initializer list (Best Practice)
        
    void TakeDamage(int amount) {
        health -= amount;
        if (health < 0) health = 0;
        std::cout << name << " took " << amount << " damage! Current Health: " << health << "\n";
    }
    
    // Getter
    int GetHealth() const { return health; }
};

int main() {
    Player hero("Kael", 100);
    hero.TakeDamage(25);
    
    // EXERCISE: Add a 'Heal' method to the Player class and test it in main.
    
    return 0;
}