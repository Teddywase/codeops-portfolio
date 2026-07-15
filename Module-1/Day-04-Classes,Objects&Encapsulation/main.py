# Class exercise Day-04

# 1. Define Account with owner, account_number, and a private __balance.
# 2. Add a @property to read the balance (no direct edits).
# 3. Write deposit() and withdraw() that validate the amount.
# 4. Reject negative deposits and overdraws with a clear message.
# 5. Create two accounts, run some transactions, and push to day04.


class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance
    
    @property
    def balance(self):
        return self.__balance
    
    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be positive")
            return
        self.__balance += amount
        print(f"Deposited {amount} ETB. New balance: {self.__balance} ETB")
    
    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive")
            return
        if amount > self.__balance:
            print(f"Insufficient balance! Available: {self.__balance} ETB")
            return
        self.__balance -= amount
        print(f"Withdrew {amount} ETB. New balance: {self.__balance} ETB")

account1 = Account("Abebe Kebede", "1001", 5000)
account2 = Account("Tigist Hailu", "1002", 3000)

print(f"Account 1: {account1.owner} ({account1.account_number}) - Balance: {account1.balance} ETB")
print(f"Account 2: {account2.owner} ({account2.account_number}) - Balance: {account2.balance} ETB")

print("\n--- Account 1 Transactions ---")
account1.deposit(2000)
account1.withdraw(1500)
account1.withdraw(6000)

print("\n--- Account 2 Transactions ---")
account2.deposit(500)
account2.withdraw(1000)
account2.deposit(-100)

print("\n--- Final Balances ---")
print(f"Account 1: {account1.balance} ETB")
print(f"Account 2: {account2.balance} ETB")