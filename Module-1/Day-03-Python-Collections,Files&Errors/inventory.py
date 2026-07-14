# Mini-Project — Pharmacy Inventory Tracker
# inventory.py

stock = {}

try:
    with open("stock.txt", "r") as f:
        for line in f:
            item, qty = line.strip().split(",")
            stock[item] = int(qty)
except FileNotFoundError:
    print("No stock file yet - starting empty")

def adjust(item, amount):
    stock[item] = stock.get(item, 0) + amount

low = [item for item, qty in stock.items() if qty < 10]
print("Low stock:", low)

adjust("Paracetamol", 15)
adjust("Amoxicillin", -5)

with open("stock.txt", "w") as f:
    for item, qty in stock.items():
        f.write(f"{item},{qty}\n")