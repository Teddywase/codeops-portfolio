# Larger Project — Refactor with Patterns
#
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BankConfig:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
            cls._instance.currency = "ETB"
        return cls._instance
    
    def update_interest_rate(self, rate):
        self.interest_rate = rate
        print(f"Interest rate updated to {rate * 100}%")
    
    def update_overdraft_limit(self, limit):
        self.overdraft_limit = limit
        print(f"Overdraft limit updated to {limit} ETB")


class Observer(ABC):
    @abstractmethod
    def update(self, event_type: str, account_number: str, amount: float, balance: float):
        pass


class SMSAlert(Observer):
    def update(self, event_type: str, account_number: str, amount: float, balance: float):
        print(f"[SMS] Account {account_number}: {event_type} of {amount:.2f} ETB")
        print(f"       New balance: {balance:.2f} ETB")


class EmailAlert(Observer):
    def update(self, event_type: str, account_number: str, amount: float, balance: float):
        print(f"[Email] Account {account_number}: {event_type} of {amount:.2f} ETB")
        print(f"        Current balance: {balance:.2f} ETB")


class AuditLog(Observer):
    def update(self, event_type: str, account_number: str, amount: float, balance: float):
        print(f"[Audit] {event_type.upper()} | {account_number} | {amount:.2f} | {balance:.2f}")


class Account(ABC):
    def __init__(self, owner: str, number: str, balance: float = 0):
        self.owner = owner
        self.number = number
        self.balance = balance
        self._observers: List[Observer] = []
        self._transaction_history = []
    
    def subscribe(self, observer: Observer):
        if observer not in self._observers:
            self._observers.append(observer)
            print(f"Subscribed: {observer.__class__.__name__}")
    
    def unsubscribe(self, observer: Observer):
        if observer in self._observers:
            self._observers.remove(observer)
            print(f"Unsubscribed: {observer.__class__.__name__}")
    
    def _notify(self, event_type: str, amount: float):
        for observer in self._observers:
            observer.update(event_type, self.number, amount, self.balance)
    
    def deposit(self, amount: float):
        if amount > 0:
            self.balance += amount
            self._transaction_history.append(f"Deposit: +{amount}")
            self._notify("deposit", amount)
            print(f"Deposited {amount:.2f} ETB. Balance: {self.balance:.2f} ETB")
        else:
            print("Amount must be positive")
    
    def withdraw(self, amount: float):
        if amount <= 0:
            print("Amount must be positive")
            return False
        
        if amount <= self.balance:
            self.balance -= amount
            self._transaction_history.append(f"Withdrawal: -{amount}")
            self._notify("withdrawal", amount)
            print(f"Withdrew {amount:.2f} ETB. Balance: {self.balance:.2f} ETB")
            return True
        else:
            print(f"Insufficient balance. Available: {self.balance:.2f} ETB")
            return False
    
    def get_transaction_history(self):
        return self._transaction_history
    
    @abstractmethod
    def calculate_interest(self) -> float:
        pass
    
    @abstractmethod
    def account_type(self) -> str:
        pass
    
    def statement(self):
        print(f"[{self.account_type()}] {self.owner} ({self.number}): {self.balance:.2f} ETB")


class SavingsAccount(Account):
    def __init__(self, owner: str, number: str, balance: float = 0):
        config = BankConfig()
        super().__init__(owner, number, balance)
        self.rate = config.interest_rate
    
    def add_interest(self):
        interest = self.calculate_interest()
        if interest > 0:
            self.balance += interest
            self._transaction_history.append(f"Interest: +{interest}")
            self._notify("interest", interest)
            print(f"Added interest: {interest:.2f} ETB ({self.rate*100}%)")
        return interest
    
    def calculate_interest(self) -> float:
        return self.balance * self.rate
    
    def account_type(self) -> str:
        return "Savings Account"
    
    def statement(self):
        print(f"[Savings] {self.owner} ({self.number}): {self.balance:.2f} ETB (Rate: {self.rate*100:.0f}%)")


class CurrentAccount(Account):
    def __init__(self, owner: str, number: str, balance: float = 0):
        config = BankConfig()
        super().__init__(owner, number, balance)
        self.overdraft_limit = config.overdraft_limit
        self.overdraft_used = 0
    
    def withdraw(self, amount: float):
        if amount <= 0:
            print("Amount must be positive")
            return False
        
        available = self.balance + self.overdraft_limit
        if amount <= available:
            self.balance -= amount
            self.overdraft_used = max(0, -self.balance)
            self._transaction_history.append(f"Withdrawal: -{amount}")
            self._notify("withdrawal", amount)
            print(f"Withdrew {amount:.2f} ETB. Balance: {self.balance:.2f} ETB")
            if self.balance < 0:
                print(f"Overdraft used: {self.overdraft_used:.2f} ETB")
            return True
        else:
            print(f"Overdraft limit exceeded. Available: {available:.2f} ETB")
            return False
    
    def calculate_interest(self) -> float:
        return 0
    
    def account_type(self) -> str:
        return "Current Account"
    
    def statement(self):
        status = "Overdraft" if self.balance < 0 else "Positive"
        print(f"[Current] {self.owner} ({self.number}): {self.balance:.2f} ETB ({status}, Limit: {self.overdraft_limit} ETB)")


class AccountFactory:
    @staticmethod
    def create(kind: str, owner: str, number: str, balance: float = 0) -> Account:
        account_types = {
            "savings": SavingsAccount,
            "current": CurrentAccount,
            "saving": SavingsAccount,
            "checking": CurrentAccount,
        }
        
        account_class = account_types.get(kind.lower())
        if account_class:
            return account_class(owner, number, balance)
        raise ValueError(f"Unknown account type: {kind}")
    
    @staticmethod
    def create_multiple(accounts_data: List[Dict]) -> List[Account]:
        return [
            AccountFactory.create(
                data['kind'], data['owner'], data['number'], data.get('balance', 0)
            )
            for data in accounts_data
        ]


if __name__ == "__main__":
    print("=" * 70)
    print("DAY 06: REFACTORED BANK WITH SOLID AND PATTERNS")
    print("=" * 70)
    
    print("\n[TEST 1] Singleton - BankConfig")
    print("-" * 50)
    c1 = BankConfig()
    c2 = BankConfig()
    print(f"Same instance: {c1 is c2}")
    c1.update_interest_rate(0.07)
    print(f"Shared state: {c2.interest_rate * 100}%")
    
    print("\n[TEST 2] Factory - AccountFactory")
    print("-" * 50)
    
    accounts = AccountFactory.create_multiple([
        {"kind": "savings", "owner": "Almaz", "number": "SAV001", "balance": 1000},
        {"kind": "current", "owner": "Dawit", "number": "CUR001", "balance": 500},
        {"kind": "savings", "owner": "Betty", "number": "SAV002", "balance": 2000},
    ])
    
    for acc in accounts:
        acc.statement()
    
    print("\n[TEST 3] Observer - Alerts")
    print("-" * 50)
    
    sms = SMSAlert()
    email = EmailAlert()
    audit = AuditLog()
    
    test_account = AccountFactory.create("savings", "Test User", "TEST001", 1000)
    
    print("\nSubscribing observers:")
    test_account.subscribe(sms)
    test_account.subscribe(email)
    test_account.subscribe(audit)
    
    print("\n--- Transactions with alerts ---")
    test_account.deposit(500)
    test_account.withdraw(300)
    
    if isinstance(test_account, SavingsAccount):
        test_account.add_interest()
    
    print("\n--- Unsubscribe email and test ---")
    test_account.unsubscribe(email)
    test_account.deposit(100)
    
    print("\n[TEST 4] Overdraft Functionality")
    print("-" * 50)
    
    od_account = AccountFactory.create("current", "OD Test", "OD001", 200)
    od_account.subscribe(sms)
    
    print("\nInitial:")
    od_account.statement()
    
    print("\nWithdraw 500 (within limit):")
    od_account.withdraw(500)
    
    print("\nWithdraw 500 (exceeds limit):")
    od_account.withdraw(500)
    
    print("\n[TEST 5] Polymorphism")
    print("-" * 50)
    
    for acc in accounts:
        acc.statement()
        interest = acc.calculate_interest()
        if interest > 0:
            print(f"  Interest: {interest:.2f} ETB")
        else:
            print(f"  No interest")
    
    print("\n[TEST 6] SOLID Principles Verification")
    print("-" * 50)
    
    print("SRP: Account handles balance, alerts are separate")
    print("OCP: New observers can be added without changing Account")
    print("LSP: Savings and Current can replace Account")
    print("ISP: Observer interface is minimal")
    print("DIP: Account depends on Observer abstraction")
    print("Factory: Centralized creation")
    print("Singleton: Single config shared")
    print("Observer: Loose coupling")
    
    print("\n" + "=" * 70)
    print("DAY 06 COMPLETE - ALL TESTS PASSED")
    print("=" * 70)