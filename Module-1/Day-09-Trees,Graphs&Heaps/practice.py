# Day 09 Exercises

from collections import deque
import heapq

# Question 1. Build a BST. Write a Node class and an insert(root, value) function. Insert several balances,
# then print them with an in-order traversal — they should come out sorted.

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return Node(value)
    
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

def inorder(root):
    if root:
        inorder(root.left)
        print(root.value, end=" ")
        inorder(root.right)

print("Inserting numbers: 50, 30, 70, 20, 40, 60, 80")
root = None
for num in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, num)

print("In-order traversal (sorted order):")
inorder(root)
print()

# Question 2. Tree depth. Write a recursive height(node) that returns the depth of a binary tree.

def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))

print(f"Tree height: {height(root)}")

# Question 3. Graph BFS. Given an adjacency-list graph, implement bfs(graph, start) and return the set of
# reachable vertices.

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        node = queue.popleft()
        print(node, end=" ")
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    print()

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print("Graph connections:")
for node, neighbors in graph.items():
    print(f"  {node} -> {neighbors}")

print("\nBFS from A:")
bfs(graph, 'A')

# Question 4. Graph DFS. Implement dfs(graph, start) recursively, and compare the visit order with your
# BFS.

def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start, end=" ")
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    
    return visited

print("DFS from A:")
dfs(graph, 'A')
print()

# Question 5. Priority queue. Use heapq to push five (priority, task) tuples in mixed order, then pop them all
# — they should come out by priority.

pq = []

tasks = [
    (3, "Low priority"),
    (1, "High priority"),
    (2, "Medium priority"),
    (5, "Very low"),
    (4, "Low-medium")
]

print("Adding tasks to priority queue:")
for priority, task in tasks:
    heapq.heappush(pq, (priority, task))
    print(f"  ({priority}, {task})")

print("\nProcessing tasks by priority (smallest number first):")
while pq:
    priority, task = heapq.heappop(pq)
    print(f"  {task} (Priority {priority})")

print("\n" + "=" * 60)
print("EXTRA: SEARCH IN BST")
print("=" * 60)

def search(root, value):
    if root is None or root.value == value:
        return root
    if value < root.value:
        return search(root.left, value)
    return search(root.right, value)

print("Searching for 40:")
result = search(root, 40)
if result:
    print(f"Found: {result.value}")
else:
    print("Not found")

print("\nSearching for 100:")
result = search(root, 100)
if result:
    print(f"Found: {result.value}")
else:
    print("Not found")
