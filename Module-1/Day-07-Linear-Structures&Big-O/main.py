# DAY 07 MINI-PROJECT: BIG-O AND DATA STRUCTURES

class BankConfig:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


class Account:
    def __init__(self, owner, number, balance=0):
        self.owner = owner
        self.number = number
        self.balance = balance
        self.history = []
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            self.history.append(f"Deposited {amount}")
            print(f"Deposited {amount}. Balance: {self.balance}")
    
    def withdraw(self, amount):
        if amount > 0 and amount <= self.balance:
            self.balance -= amount
            self.history.append(f"Withdrew {amount}")
            print(f"Withdrew {amount}. Balance: {self.balance}")
            return True
        print("Insufficient balance")
        return False
    
    def undo(self):
        if not self.history:
            print("No transactions to undo")
            return
        
        last = self.history.pop()
        print(f"Undid: {last}")
        
        if "Deposited" in last:
            amount = float(last.split()[1])
            self.balance -= amount
        elif "Withdrew" in last:
            amount = float(last.split()[1])
            self.balance += amount
        
        print(f"Balance: {self.balance}")
    
    def statement(self):
        print(f"{self.owner}: {self.balance} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, number, balance=0):
        config = BankConfig()
        super().__init__(owner, number, balance)
        self.rate = config.interest_rate
    
    def add_interest(self):
        interest = self.balance * self.rate
        self.balance += interest
        self.history.append(f"Interest {interest}")
        print(f"Added interest: {interest}")
    
    def statement(self):
        print(f"[Savings] {self.owner}: {self.balance} ETB (Rate: {self.rate*100}%)")


class CurrentAccount(Account):
    def __init__(self, owner, number, balance=0):
        config = BankConfig()
        super().__init__(owner, number, balance)
        self.overdraft_limit = config.overdraft_limit
    
    def withdraw(self, amount):
        available = self.balance + self.overdraft_limit
        if amount > 0 and amount <= available:
            self.balance -= amount
            self.history.append(f"Withdrew {amount}")
            print(f"Withdrew {amount}. Balance: {self.balance}")
            return True
        print("Overdraft limit exceeded")
        return False
    
    def statement(self):
        print(f"[Current] {self.owner}: {self.balance} ETB (Limit: {self.overdraft_limit})")


class AccountRegistry:
    def __init__(self):
        self.by_number = {}
        self.order = []
    
    def add(self, account):
        self.by_number[account.number] = account
        self.order.append(account.number)
        print(f"Added: {account.number}")
    
    def find(self, number):
        return self.by_number.get(number)
    
    def list_all(self):
        for number in self.order:
            account = self.by_number[number]
            account.statement()
    
    def remove(self, number):
        if number in self.by_number:
            del self.by_number[number]
            self.order.remove(number)
            print(f"Removed: {number}")
            return True
        print(f"Account {number} not found")
        return False


if __name__ == "__main__":
    print("DAY 07: ACCOUNT REGISTRY")    
    
    registry = AccountRegistry()
    
    s1 = SavingsAccount("Almaz", "SAV001", 1000)
    c1 = CurrentAccount("Dawit", "CUR001", 500)
    s2 = SavingsAccount("Betty", "SAV002", 2000)
    
    registry.add(s1)
    registry.add(c1)
    registry.add(s2)
    
    print("\nAll accounts:")
    registry.list_all()
    
    print("\nFind account SAV001:")
    acc = registry.find("SAV001")
    if acc:
        acc.statement()
    
    print("\nFind account SAV999:")
    acc = registry.find("SAV999")
    if acc:
        acc.statement()
    else:
        print("Account not found")
    
    print("\nTransaction history (stack):")
    s1.deposit(500)
    s1.withdraw(200)
    s1.deposit(300)
    
    print("\nHistory stack (LIFO - last in, first out):")
    for i, transaction in enumerate(reversed(s1.history)):
        print(f"  {i+1}. {transaction}")
    
    print("\nUndo last transaction:")
    s1.undo()
    s1.statement()