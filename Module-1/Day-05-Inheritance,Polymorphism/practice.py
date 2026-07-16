# day05/practice.py
from abc import ABC, abstractmethod

# Question 1. Vehicle hierarchy. Make a Vehicle base class with make, model, and a describe() method.
# Add Car and Truck subclasses.

class Vehicle(ABC):
    def __init__(self, make, model):
        self.make = make
        self.model = model
    
    def describe(self):
        return f"{self.make} {self.model}"
    
    @abstractmethod
    def wheels(self):
        pass

# Question 2. Use super(). Give Truck a capacity attribute, setting make and model via super().__init__().
class Car(Vehicle):
    def __init__(self, make, model, doors=4):
        super().__init__(make, model)
        self.doors = doors
    
    def wheels(self):
        return 4
    
    def describe(self):
        return f"Car: {super().describe()} with {self.doors} doors"

class Truck(Vehicle):
    def __init__(self, make, model, capacity):
        super().__init__(make, model)
        self.capacity = capacity
    
    def wheels(self):
        return 6
    
# Question 3. Override. Override describe() in Truck so it also mentions the capacity.
    def describe(self):
        return f"Truck: {super().describe()} with {self.capacity} ton capacity"

# Question 4. Polymorphism. Put several vehicles in a list and loop over them, calling describe() on each.
def test_vehicles():
    vehicles = [
        Car("Toyota", "Camry", 4),
        Car("Honda", "Civic", 2),
        Truck("Ford", "F-150", 3.5),
        Truck("Volvo", "FH16", 25)
    ]
    
    print("=== Vehicle Descriptions ===")
    for vehicle in vehicles:
        print(vehicle.describe())
    
    print("\n=== Number of Wheels ===")
    for vehicle in vehicles:
        print(f"{vehicle.make} {vehicle.model}: {vehicle.wheels()} wheels")

# Question 5. Abstract method. Make Vehicle an abstract base class with an abstract wheels() method, and
# have each subclass return its own number.

if __name__ == "__main__":
    test_vehicles()