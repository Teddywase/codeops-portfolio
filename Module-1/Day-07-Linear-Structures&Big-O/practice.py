# DAY 07 PRACTICE: BIG-O AND DATA STRUCTURES

import time
from collections import deque

# Question 1. Name the Big-O. For five short snippets (a list index, a single loop, a nested loop, 
# a dict lookup, a binary search), write the Big-O of each as a comment and explain why.
print("\n" + "=" * 70)
print("EXERCISE 1: Name the Big-O")
print("=" * 70)

print("""
1. accounts[0]                    
   Big-O: O(1) - Constant time
   Reason: Direct index access, jumps straight to the position

2. for acc in accounts: print(acc.owner)
   Big-O: O(n) - Linear time
   Reason: Iterates through each account once

3. for a in accounts:
       for b in accounts:
           if a.owner == b.owner: ...
   Big-O: O(n^2) - Quadratic time
   Reason: Nested loops over the same data

4. accounts["ACC001"]             
   Big-O: O(1) - Constant time
   Reason: Dictionary lookup by key, hash table access

5. Binary search on sorted array
   Big-O: O(log n) - Logarithmic time
   Reason: Halves the search space each step
""")

# Question 2. List vs. dict lookup. Build a list and a dict of 100,000 fake account numbers. Time how long it
# takes to find one near the end in each.
print("\n" + "=" * 70)
print("EXERCISE 2: List vs Dict Lookup Performance")
print("=" * 70)

print("Creating 100,000 accounts...")

my_list = []
my_dict = {}

for i in range(100000):
    number = f"ACC{i}"
    my_list.append(number)
    my_dict[number] = True

test = "ACC99999"

start = time.time()
found = test in my_list
end = time.time()
print(f"List lookup: {found}, Time: {(end-start)*1000:.4f} ms")

start = time.time()
found = test in my_dict
end = time.time()
print(f"Dict lookup: {found}, Time: {(end-start)*1000:.4f} ms")

# Question 3. Build a stack. Write a Stack class with push, pop, and peek, and use it to reverse a list of
# names.
print("\n" + "=" * 70)
print("EXERCISE 3: Stack - LIFO Data Structure")
print("=" * 70)

class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
        print(f"Push: {item}")
    
    def pop(self):
        if self.items:
            item = self.items.pop()
            print(f"Pop: {item}")
            return item
        print("Stack is empty")
        return None
    
    def peek(self):
        if self.items:
            return self.items[-1]
        return None
    
    def print_stack(self):
        print(f"Stack: {self.items}")

print("Reversing names with Stack:")

names = ["Almaz", "Dawit", "Betty"]
print(f"Original: {names}")

stack = Stack()
for name in names:
    stack.push(name)

print("\nStack (top to bottom):")
stack.print_stack()

print("\nPopping all:")
reversed_names = []
while stack.items:
    reversed_names.append(stack.pop())

print(f"Reversed: {reversed_names}")

# Question 4. Build a queue. Use collections.deque to model a bank service line: enqueue five customers,
# then serve them in order.

print("\n" + "=" * 70)
print("EXERCISE 4: Queue - FIFO Data Structure")
print("=" * 70)

print("Bank line using deque:")

line = deque()

customers = ["Almaz", "Dawit", "Betty", "Chala", "Eden"]

print("Customers joining line:")
for customer in customers:
    line.append(customer)
    print(f"  {customer} joined")

print(f"\nCurrent line: {list(line)}")

print("\nServing customers:")
while line:
    serving = line.popleft()
    print(f"  Serving: {serving}")
    print(f"  Remaining: {list(line)}")

# Question 5. Singly linked list. Implement a Node and a LinkedList with push_front and a print_all() that
# walks the chain.
print("\n" + "=" * 70)
print("EXERCISE 5: Singly Linked List")
print("=" * 70)

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        print(f"Added: {data}")
    
    def print_all(self):
        if self.head is None:
            print("Empty list")
            return
        
        current = self.head
        while current:
            print(current.data, end=" -> ")
            current = current.next
        print("None")

print("Creating linked list:")

ll = LinkedList()
ll.push_front("Betty")
ll.push_front("Dawit")
ll.push_front("Almaz")

print("\nLinked list:")
ll.print_all()

print("\nWalking through the chain:")
current = ll.head
step = 1
while current:
    print(f"  Node {step}: {current.data}")
    current = current.next
    step += 1
