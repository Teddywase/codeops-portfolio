# Read a file of TeleBirr transactions, summarise them by customer using a dictionary, 
# and handle a missing file gracefully.

# Step 1: Read transactions.txt line by line (name, amount per line).
print("Step 1")
with open("transactions.txt") as f:
    for line in f:
        print(line.strip())

# Step 2: Build a dict mapping each customer to their total spend.
print("Step 2")
customer_totals = {}
with open("transactions.txt") as f:
    for line in f:
        name, amount = line.strip().split(",")
        customer_totals[name] = customer_totals.get(name, 0) + float(amount)
print(customer_totals)

# Step 3 Print each customer and total, sorted highest first.

print("Step 3")
sorted_customers = sorted(customer_totals.items(), key=lambda x: x[1], reverse=True)
print("=" * 35)
print(f"{'Customer':<20} {'Total Spend':>10}")
print("-" * 35)

for name,total in sorted_customers:
    print(f"{name:<20} {total:>10}")

# Step 4 Wrap the file read in try / except for a missing file.
print("Step 4")
try:
    with open("transaction.txt", "r") as f:
        for line in f:
            print(line.strip())
except FileNotFoundError:
    print("File not found")
else:
    print("File read successfully")

# Step 5 Write the summary to report.txt
print("Step 5")
with open("report.txt", "w") as f:
    f.write("TeleBirr Transaction Summary\n")
    f.write("=" * 35 + "\n")
    f.write(f"{'Customer':<20} {'Total Spend':>10}\n")
    f.write("-" * 35 + "\n")
    
    for name, total in sorted_customers:
        f.write(f"{name:<20} {total:>10.2f}\n")
    
    f.write("=" * 35 + "\n")
    f.write(f"Total customers: {len(customer_totals)}\n")
    f.write(f"Total spend: {sum(customer_totals.values()):.2f} ETB\n")

print("Report written to report.txt")