# Question 1. Unique cities. Given a list with repeated city names, use a set to print the distinct cities, then
# the count.

cities = ["Addis Ababa", "Adama", "Diredawa", "Bahirdar","Adama", "Harer", "Addis Ababa"]

distinct_cities = set(cities)
print("Distinct cities:")

for city in distinct_cities:
    print(city)

print(f"Number of distinct cities: {len(distinct_cities)}")

# Question 2. Price report. Make a dictionary of five grocery items and prices in ETB. Loop with .items() to
# print each on its own line

items = {"Vegetables": 120, "Fruits": 100, "Coffee": 80, "Honey":70, "Butter": 150}

print("\nGrocery Items and Prices (ETB):")

for item, price in items.items():
    print(f"{item}: {price} ETB")

# Question 3. Tax comprehension. Given prices = [100, 250, 400, 80], use one comprehension to build
# a list with 15% tax added.

prices = [100, 250, 400, 80]
with_tax = [round(price * 1.15) for price in prices]

print(f"\nOriginal prices: {prices}")
print(f"Prices with 15% tax: {with_tax}\n")

# Question 4. Cheap items. From the same list, use a comprehension with a condition to keep only prices
# under 200.

prices = [100, 250, 400, 80]
cheap_items = [price for price in prices if price < 200]

print(f"Cheap Items: {cheap_items}")

# Question 5. Write & read. Write three customer names to names.txt, then open it and print each name
# back, one per line.


# Write three customer names
with open("names.txt", "w") as f:
    f.write("Almaz Bekele\n")
    f.write("Dawit Hailu\n")
    f.write("Samuel Tesfaye\n")

print("Customer names from file:")
with open("names.txt", "r") as f:
    for line in f:
        print(f"  {line.strip()}")


# Question 6. Safe division. Ask the user for a number and divide 1000 by it, catching both ValueError and
# ZeroDivisionError.

while True:
    try:
        user_input = input("Enter a number to divide 1000 by: ")
        divisor = float(user_input)
        result = 1000 / divisor
        print(f"1000 / {divisor} = {result:.2f}")
        break
    except ValueError:
        print("Error: Please enter a valid number")
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
    except Exception as e:
        print(f"Unexpected error: {e}")
