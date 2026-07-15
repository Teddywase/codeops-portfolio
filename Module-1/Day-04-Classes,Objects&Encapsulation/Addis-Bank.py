# Addis Bank — Account Management System
# Requirements
# - Define Account with public owner and account_number, and a private __balance (default 0).
# - Expose the balance through a read-only @property — no direct edits from outside.
# - Write deposit(amount) and withdraw(amount) that reject non-positive amounts and overdrafts.
# - Add a statement() method that prints the owner, account number, and balance in ETB.

class Account:
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.account_number = number
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient balance")
        self.__balance -= amount

    def statement(self):
        print(f"Owner: {self.owner}")
        print(f"Account Number: {self.account_number}")
        print(f"Balance: {self.__balance} ETB")

        
if __name__ == "__main__":
    account1 = Account("Abebe Kebede", "1001", 5000)
    account2 = Account("Tigist Hailu", "1002", 3000)
    
    print("=== Account 1 ===")
    account1.statement()
    account1.deposit(2000)
    print(f"\nAfter deposit: {account1.balance} ETB")
    account1.withdraw(1500)
    print(f"After withdrawal: {account1.balance} ETB")
    
    print("\n=== Account 2 ===")
    account2.statement()
    account2.deposit(500)
    print(f"\nAfter deposit: {account2.balance} ETB")