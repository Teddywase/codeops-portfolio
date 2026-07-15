# This a day-04 exercise

# Question 1. Book class. Define Book with title, author, and pages. Add a describe() 
# method that prints a one-line summary. Create two books.

class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
    def describe(self):  
        return f"'{self.title}' by {self.author}, {self.pages} pages"

book1 = Book("Fikir Eske Mekabir", "Haddis Alemayehu", 800)
book2 = Book("Oromay", "Bealu Girma", 330)

print(book1.describe())
print(book2.describe())

# Question 2. Product class. Define Product with name, price (ETB), and quantity. Add restock(n) and
# sell(n) methods that change the quantity.

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity
    def restock(self, n):
        if n <= 0:
            print("Restock amount must be positive")
            return
        self.quantity += n
        print(f"Restocked {n} {self.name}(s). New quantity: {self.quantity}")
    def sell(self, n):
        if n <= 0:
            print("Sell amount must be positive")
            return
        if n > self.quantity:
            print(f"Insufficient stock only {self.quantity} {self.name}(s) available.")
            return
        self.quantity -= n
        print(f"Sold {n} {self.name}(s). Remaining quantity: {self.quantity}")
product1 = Product("Fruit", 200, 10)
product2 = Product("Coffee", 500, 20)

# Test the methods
print(f"Initial: {product1.name} - Quantity: {product1.quantity}")
product1.sell(3)    # Sell 3 Fruits
product1.restock(5) # Restock 5 Fruits
product1.sell(15)   # Try to sell more than available

print(f"\n{product2.name} - Initial quantity: {product2.quantity}")
product2.sell(25)   # Try to sell more than available
product2.restock(10) # Restock 10 bags
product2.sell(15)   # Sell 15 bags
        
# Question 3. Make it private. Change quantity to a private __quantity and add a @property getter for it.

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity
    
    @property
    def quantity(self):
        return self.__quantity
    
    def restock(self, n):
        if n <= 0:
            raise ValueError("Restock amount must be positive")
        self.__quantity += n
        return f"Restocked {n} {self.name}(s). New quantity: {self.__quantity}"
    
    def sell(self, n):
        if n <= 0:
            raise ValueError("Sell amount must be positive")
        if n > self.__quantity:
            raise ValueError(f"Insufficient stock! Only {self.__quantity} {self.name}(s) available.")
        self.__quantity -= n
        return f"Sold {n} {self.name}(s). Remaining quantity: {self.__quantity}"

# Question 4. Validate. Add a setter (or guard in sell) that refuses to let the quantity go below zero.

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity
    
    @property
    def quantity(self):
        return self.__quantity
    
    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        self.__quantity = value
    
    def restock(self, n):
        if n <= 0:
            raise ValueError("Restock amount must be positive")
        self.__quantity += n
        return f"Restocked {n} {self.name}(s). New quantity: {self.__quantity}"
    
    def sell(self, n):
        if n <= 0:
            raise ValueError("Sell amount must be positive")
        if n > self.__quantity:
            raise ValueError(f"Insufficient stock! Only {self.__quantity} {self.name}(s) available.")
        self.__quantity -= n
        return f"Sold {n} {self.name}(s). Remaining quantity: {self.__quantity}"

# Question 5. Prove independence. Create three Product objects, change one, and show the other two are
# unaffected.

class Product:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.__quantity = quantity
    
    @property
    def quantity(self):
        return self.__quantity
    
    @quantity.setter
    def quantity(self, value):
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        self.__quantity = value
    
    def restock(self, n):
        if n <= 0:
            raise ValueError("Restock amount must be positive")
        self.__quantity += n
        return f"Restocked {n} {self.name}(s). New quantity: {self.__quantity}"
    
    def sell(self, n):
        if n <= 0:
            raise ValueError("Sell amount must be positive")
        if n > self.__quantity:
            raise ValueError(f"Insufficient stock! Only {self.__quantity} {self.name}(s) available.")
        self.__quantity -= n
        return f"Sold {n} {self.name}(s). Remaining quantity: {self.__quantity}"

product1 = Product("Coffee", 500, 20)
product2 = Product("Tej", 150, 10)
product3 = Product("Injera", 10, 50)

print(f"Initial quantities:")
print(f"Product 1 ({product1.name}): {product1.quantity}")
print(f"Product 2 ({product2.name}): {product2.quantity}")
print(f"Product 3 ({product3.name}): {product3.quantity}")

product1.sell(5)
product1.restock(10)

print(f"\nAfter changing Product 1 only:")
print(f"Product 1 ({product1.name}): {product1.quantity}")
print(f"Product 2 ({product2.name}): {product2.quantity}")
print(f"Product 3 ({product3.name}): {product3.quantity}")

product2.sell(3)

print(f"\nAfter changing Product 2 only:")
print(f"Product 1 ({product1.name}): {product1.quantity}")
print(f"Product 2 ({product2.name}): {product2.quantity}")
print(f"Product 3 ({product3.name}): {product3.quantity}")