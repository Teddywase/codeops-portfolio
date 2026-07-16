# Larger Project — The Account Family (Day-05) Mini-project

# Requirements
# • SavingsAccount extends Account with a rate and an add_interest() method that reuses
# deposit().
# • CurrentAccount extends Account with an overdraft limit and an overridden withdraw() that
# allows balances down to the overdraft.
# • Override statement() in each subclass so it labels the account type.
# • Use super().__init__() in both subclasses; don't duplicate the parent's setup.

from abc import ABC, abstractmethod

class Account(ABC):
    """Abstract base class for all account types"""
    
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.number = number
        self.balance = balance
    
    def deposit(self, amount):
        """Deposit money into the account"""
        if amount > 0:
            self.balance += amount
            print(f"Deposited {amount} ETB. New balance: {self.balance} ETB")
        else:
            print("Deposit amount must be positive")
    
    def withdraw(self, amount):
        """Withdraw money from the account"""
        if amount > 0:
            if amount <= self.balance:
                self.balance -= amount
                print(f"Withdrew {amount} ETB. New balance: {self.balance} ETB")
                return True
            else:
                print(f"Insufficient balance. Available: {self.balance} ETB")
                return False
        else:
            print("Withdrawal amount must be positive")
            return False
    
    def statement(self):
        """Generate account statement"""
        print(f"{self.owner}: {self.balance} ETB")
    
    @abstractmethod
    def calculate_interest(self):
        """Abstract method - each account type must implement its own interest calculation"""
        pass
    
    @abstractmethod
    def account_type(self):
        """Abstract method - return the type of account"""
        pass


class SavingsAccount(Account):
    """Savings account that earns interest"""
    
    def __init__(self, owner, number, balance=0, rate=0.05):
        super().__init__(owner, number, balance)
        self.rate = rate
    
    def add_interest(self):
        """Add interest to the account"""
        interest = self.balance * self.rate
        self.deposit(interest)
        print(f"Added interest: {interest:.2f} ETB")
        return interest
    
    def calculate_interest(self):
        """Calculate interest without adding it"""
        return self.balance * self.rate
    
    def account_type(self):
        return "Savings Account"
    
    def statement(self):
        """Override statement to show account type"""
        print(f"[Savings] {self.owner}: {self.balance:.2f} ETB (Rate: {self.rate*100:.0f}%)")


class CurrentAccount(Account):
    """Current account with overdraft facility"""
    
    def __init__(self, owner, number, balance=0, overdraft_limit=1000):
        super().__init__(owner, number, balance)
        self.overdraft_limit = overdraft_limit
        self.overdraft_used = 0
    
    def withdraw(self, amount):
        """Withdraw with overdraft support"""
        if amount <= 0:
            print("Withdrawal amount must be positive")
            return False
        
        available = self.balance + self.overdraft_limit
        if amount <= available:
            self.balance -= amount
            self.overdraft_used = max(0, -self.balance)
            print(f"Withdrew {amount} ETB. New balance: {self.balance:.2f} ETB")
            if self.balance < 0:
                print(f"Overdraft used: {self.overdraft_used:.2f} ETB")
            return True
        else:
            print(f"Overdraft limit exceeded. Available: {available:.2f} ETB")
            return False
    
    def calculate_interest(self):
        """Current accounts don't earn interest (0%)"""
        return 0
    
    def account_type(self):
        return "Current Account"
    
    def statement(self):
        """Override statement to show account type and overdraft info"""
        status = "Overdraft" if self.balance < 0 else "Positive"
        print(f"[Current] {self.owner}: {self.balance:.2f} ETB ({status}, Limit: {self.overdraft_limit} ETB)")



# === Test SavingsAccount ===
print("=== SAVINGS ACCOUNT ===")
savings = SavingsAccount("Almaz", "SAV001", 1000, 0.05)
savings.statement()  

# Test deposit
savings.deposit(500)
savings.statement()  

# Test interest
savings.add_interest()
savings.statement()  

print("\n=== CURRENT ACCOUNT ===")
# === Test CurrentAccount ===
current = CurrentAccount("Dawit", "CUR001", 500, 1000)
current.statement()  

# Test withdrawal within overdraft
current.withdraw(800)  
current.statement()    

# Test withdrawal exceeding overdraft
current.withdraw(800)  
current.statement()    

print("\n=== POLYMORPHISM ===")
# === Test Polymorphism ===
accounts = [
    SavingsAccount("Almaz", "SAV001", 1000, 0.05),
    CurrentAccount("Dawit", "CUR001", 500, 1000)
]

for acc in accounts:
    acc.statement()  
    acc.deposit(100)  
    print(f"Balance: {acc.balance}")