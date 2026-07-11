# Question 1. Temperature label.

temp = int(input("Enter the temperature: "))
if temp <= 15:
     print("Cold")
elif temp <= 28:
     print ("Warm")
else:
    print ("Hot")     

# Question 2. Receipt loop. 

for i in range(1, 10):
     print(f"Receipt #{i}")

# Question 3. Even numbers. 

num = 1
while num <= 20:
     if num % 2 == 0:
          print(num)
     num += 1

# Question 4. Discount function. 

def apply_discount(price, percent=10):
    discount_amount = price * (percent/100)
    return price - discount_amount

print (apply_discount(200))


# Question 5. Countdown.

num = 5
while num >= 1:
    print(num)
    num = num - 1
