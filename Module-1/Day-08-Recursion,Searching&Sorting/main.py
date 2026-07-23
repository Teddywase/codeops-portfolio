# In-Class Exercise — Sort & Search the Registry
# Goal
# Add a balance leaderboard, a binary search by account number, and a recursive
# total to the AccountRegistry.
# Steps
# 1. Copy day07/registry.py into day08/ to keep growing it.
# 2. Add top_by_balance(n) using sorted with a key=lambda.
# 3. Write your own binary_search; add find_by_number().
# 4. Add recursive total_transactions() for one account.
# 5. Test all three on sample data; push to day08.

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
    
    def total_transactions_recursive(self):
        """Recursively sum all transaction amounts"""
        def helper(index, total):
            if index < 0:
                return total
            transaction = self.history[index]
            amount = 0
            parts = transaction.split()
            if "Deposited" in transaction:
                amount = float(parts[1])
            elif "Withdrew" in transaction:
                amount = float(parts[1])
            return helper(index - 1, total + amount)
        
        return helper(len(self.history) - 1, 0)
    
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
    
    def top_by_balance(self, n=5):
        """Return top n accounts by balance using sorted()"""
        accounts = list(self.by_number.values())
        sorted_accounts = sorted(accounts, key=lambda a: a.balance, reverse=True)
        return sorted_accounts[:n]
    
    def binary_search(self, numbers, target):
        """Binary search implementation - O(log n)"""
        low = 0
        high = len(numbers) - 1
        
        while low <= high:
            mid = (low + high) // 2
            if numbers[mid] == target:
                return mid
            elif numbers[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1
    
    def find_by_number(self, number):
        """Find account using binary search on sorted numbers"""
        sorted_numbers = sorted(self.by_number.keys())
        index = self.binary_search(sorted_numbers, number)
        if index >= 0:
            return self.by_number[sorted_numbers[index]]
        return None
    
    def find_two_balances_sum(self, target):
        """Two pointers - find two accounts whose balances sum to target"""
        accounts = list(self.by_number.values())
        sorted_accounts = sorted(accounts, key=lambda a: a.balance)
        
        left = 0
        right = len(sorted_accounts) - 1
        
        while left < right:
            total = sorted_accounts[left].balance + sorted_accounts[right].balance
            if total == target:
                return sorted_accounts[left], sorted_accounts[right]
            elif total < target:
                left += 1
            else:
                right -= 1
        return None, None
    
    def best_three_transaction_window(self, account_number):
        """Sliding window - find best 3 consecutive transactions"""
        account = self.find(account_number)
        if not account or len(account.history) < 3:
            return None
        
        amounts = []
        for trans in account.history:
            parts = trans.split()
            if "Deposited" in trans:
                amounts.append(float(parts[1]))
            elif "Withdrew" in trans:
                amounts.append(-float(parts[1]))
        
        if len(amounts) < 3:
            return None
        
        window_size = 3
        window_sum = sum(amounts[:window_size])
        best_sum = window_sum
        best_start = 0
        
        for i in range(window_size, len(amounts)):
            window_sum = window_sum + amounts[i] - amounts[i - window_size]
            if window_sum > best_sum:
                best_sum = window_sum
                best_start = i - window_size + 1
        
        return {
            'start': best_start,
            'end': best_start + window_size - 1,
            'total': best_sum,
            'transactions': account.history[best_start:best_start + window_size]
        }


if __name__ == "__main__":
    print("=" * 60)
    print("DAY 08: REGISTRY WITH SEARCHING, SORTING & RECURSION")
    print("=" * 60)
    
    registry = AccountRegistry()
    
    s1 = SavingsAccount("Almaz", "SAV001", 1000)
    c1 = CurrentAccount("Dawit", "CUR001", 500)
    s2 = SavingsAccount("Betty", "SAV002", 2000)
    c2 = CurrentAccount("Chala", "CUR003", 300)
    s3 = SavingsAccount("Eden", "SAV004", 1500)
    
    registry.add(s1)
    registry.add(c1)
    registry.add(s2)
    registry.add(c2)
    registry.add(s3)
    
    print("\n" + "=" * 60)
    print("1. TOP ACCOUNTS BY BALANCE (Leaderboard)")
    print("=" * 60)
    
    top_accounts = registry.top_by_balance(3)
    for i, acc in enumerate(top_accounts, 1):
        print(f"  #{i}: {acc.owner} - {acc.balance} ETB")
    
    print("\n" + "=" * 60)
    print("2. BINARY SEARCH FIND BY NUMBER")
    print("=" * 60)
    
    print("\nFinding SAV002:")
    acc = registry.find_by_number("SAV002")
    if acc:
        acc.statement()
    
    print("\nFinding SAV999:")
    acc = registry.find_by_number("SAV999")
    if acc:
        acc.statement()
    else:
        print("  Account not found")
    
    print("\n" + "=" * 60)
    print("3. TWO POINTERS - FIND TWO BALANCES SUM")
    print("=" * 60)
    
    target = 2500
    print(f"\nFinding two accounts whose balances sum to {target}:")
    acc1, acc2 = registry.find_two_balances_sum(target)
    if acc1 and acc2:
        print(f"  {acc1.owner}: {acc1.balance} + {acc2.owner}: {acc2.balance} = {acc1.balance + acc2.balance}")
    else:
        print(f"  No pair found summing to {target}")
    
    print("\n" + "=" * 60)
    print("4. RECURSIVE TRANSACTION TOTAL")
    print("=" * 60)
    
    print("\nPerforming transactions on SAV001:")
    s1.deposit(500)
    s1.withdraw(200)
    s1.deposit(300)
    s1.withdraw(100)
    
    total = s1.total_transactions_recursive()
    print(f"\nTotal transaction amount (recursive): {total} ETB")
    
    print("\n" + "=" * 60)
    print("5. SLIDING WINDOW - BEST 3 TRANSACTIONS")
    print("=" * 60)
    
    result = registry.best_three_transaction_window("SAV001")
    if result:
        print(f"\nBest 3 transactions (positions {result['start']} to {result['end']}):")
        print(f"  Total: {result['total']} ETB")
        print("  Transactions:")
        for trans in result['transactions']:
            print(f"    - {trans}")
