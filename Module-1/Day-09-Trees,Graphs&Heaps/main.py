from collections import deque
import heapq

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


class TreeNode:
    def __init__(self, account):
        self.account = account
        self.left = None
        self.right = None


class BranchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, account):
        if self.root is None:
            self.root = TreeNode(account)
            print(f"Added root: {account.owner}")
            return
        
        current = self.root
        while True:
            if account.balance < current.account.balance:
                if current.left is None:
                    current.left = TreeNode(account)
                    print(f"Added {account.owner} (left of {current.account.owner})")
                    break
                current = current.left
            else:
                if current.right is None:
                    current.right = TreeNode(account)
                    print(f"Added {account.owner} (right of {current.account.owner})")
                    break
                current = current.right
    
    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result
    
    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.account)
            self._inorder(node.right, result)
    
    def height(self):
        return self._height(self.root)
    
    def _height(self, node):
        if node is None:
            return 0
        left = self._height(node.left)
        right = self._height(node.right)
        return 1 + max(left, right)
    
    def total_balance(self):
        return self._total(self.root)
    
    def _total(self, node):
        if node is None:
            return 0
        return node.account.balance + self._total(node.left) + self._total(node.right)


class TransferGraph:
    def __init__(self):
        self.connections = {}
    
    def add_account(self, account):
        if account.number not in self.connections:
            self.connections[account.number] = []
            print(f"Added account to graph: {account.owner}")
    
    def add_transfer(self, from_acc, to_acc, amount):
        if from_acc.number not in self.connections:
            self.add_account(from_acc)
        if to_acc.number not in self.connections:
            self.add_account(to_acc)
        
        self.connections[from_acc.number].append((to_acc.number, amount))
        self.connections[to_acc.number].append((from_acc.number, amount))
        print(f"Transfer: {from_acc.owner} -> {to_acc.owner}: {amount} ETB")
    
    def bfs(self, start_account):
        if start_account.number not in self.connections:
            return []
        
        visited = set()
        queue = deque([start_account.number])
        visited.add(start_account.number)
        result = []
        
        while queue:
            current = queue.popleft()
            result.append(current)
            for neighbor, amount in self.connections[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return result


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
    
    def top_by_balance(self, n=5):
        accounts = list(self.by_number.values())
        sorted_accounts = sorted(accounts, key=lambda a: a.balance, reverse=True)
        return sorted_accounts[:n]
    
    def binary_search(self, numbers, target):
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
        sorted_numbers = sorted(self.by_number.keys())
        index = self.binary_search(sorted_numbers, number)
        if index >= 0:
            return self.by_number[sorted_numbers[index]]
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("DAY 09: TREES, GRAPHS & HEAPS")
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
    print("1. BINARY SEARCH TREE - Branch Structure")
    print("=" * 60)
    
    branch = BranchTree()
    branch.insert(s1)
    branch.insert(s2)
    branch.insert(s3)
    branch.insert(c1)
    branch.insert(c2)
    
    print("\nIn-order traversal (sorted by balance):")
    for acc in branch.inorder():
        print(f"  {acc.owner}: {acc.balance} ETB")
    
    print(f"\nTree height: {branch.height()}")
    print(f"Total balance: {branch.total_balance()} ETB")
    
    print("\n" + "=" * 60)
    print("2. GRAPH - Transfer Network")
    print("=" * 60)
    
    graph = TransferGraph()
    
    graph.add_transfer(s1, c1, 200)
    graph.add_transfer(s1, s2, 300)
    graph.add_transfer(s2, s3, 150)
    graph.add_transfer(s2, c2, 250)
    graph.add_transfer(s3, c1, 100)
    
    print("\nBFS from SAV001:")
    bfs_result = graph.bfs(s1)
    for number in bfs_result:
        acc = registry.find(number)
        if acc:
            print(f"  {acc.owner}")
    
    print("\n" + "=" * 60)
    print("3. HEAP - Priority Queue")
    print("=" * 60)
    
    priority_queue = []
    
    tasks = [
        (1, "Rent payment"),
        (5, "Snacks"),
        (2, "Salary deposit"),
        (4, "Groceries"),
        (3, "Electricity bill")
    ]
    
    print("Adding tasks with priorities (lower number = higher priority):")
    for priority, task in tasks:
        heapq.heappush(priority_queue, (priority, task))
        print(f"  Priority {priority}: {task}")
    
    print("\nProcessing tasks by priority:")
    while priority_queue:
        priority, task = heapq.heappop(priority_queue)
        print(f"  Doing: {task} (Priority {priority})")
    
