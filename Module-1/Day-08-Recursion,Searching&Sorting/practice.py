
print("\n" + "=" * 60)
print("EXERCISE 1: RECURSION - Factorial")
print("=" * 60)

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"factorial(5) = {factorial(5)}")
print(f"factorial(0) = {factorial(0)}")

print("\n" + "=" * 60)
print("EXERCISE 2: RECURSION - Countdown")
print("=" * 60)

def countdown(n):
    if n == 0:
        print("Done!")
        return
    print(n)
    countdown(n - 1)

print("Countdown from 5:")
countdown(5)

print("\n" + "=" * 60)
print("EXERCISE 3: LINEAR SEARCH")
print("=" * 60)

def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1

numbers = [10, 23, 45, 67, 89, 12, 34, 56]
target = 67

result = linear_search(numbers, target)
if result >= 0:
    print(f"Found {target} at index {result}")
else:
    print(f"{target} not found")

print("\n" + "=" * 60)
print("EXERCISE 4: BINARY SEARCH")
print("=" * 60)

def binary_search(items, target):
    low = 0
    high = len(items) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

sorted_numbers = [10, 23, 34, 45, 56, 67, 78, 89]
target = 67

result = binary_search(sorted_numbers, target)
if result >= 0:
    print(f"Found {target} at index {result}")
else:
    print(f"{target} not found")

print("\n" + "=" * 60)
print("EXERCISE 5: BUBBLE SORT")
print("=" * 60)

def bubble_sort(items):
    n = len(items)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
                swapped = True
        if not swapped:
            break
    return items

unsorted = [64, 34, 25, 12, 22, 11, 90]
print(f"Unsorted: {unsorted}")
sorted_list = bubble_sort(unsorted.copy())
print(f"Sorted: {sorted_list}")

print("\n" + "=" * 60)
print("EXERCISE 6: MERGE SORT")
print("=" * 60)

def merge_sort(items):
    if len(items) <= 1:
        return items
    
    mid = len(items) // 2
    left = merge_sort(items[:mid])
    right = merge_sort(items[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

unsorted = [38, 27, 43, 3, 9, 82, 10]
print(f"Unsorted: {unsorted}")
sorted_list = merge_sort(unsorted)
print(f"Sorted: {sorted_list}")

print("\n" + "=" * 60)
print("EXERCISE 7: TWO POINTERS")
print("=" * 60)

def has_pair_sum(nums, target):
    nums = sorted(nums)
    left = 0
    right = len(nums) - 1
    
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return True, nums[left], nums[right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return False, None, None

nums = [2, 7, 11, 15]
target = 18

found, num1, num2 = has_pair_sum(nums, target)
if found:
    print(f"Found: {num1} + {num2} = {target}")
else:
    print(f"No pair sums to {target}")

print("\n" + "=" * 60)
print("EXERCISE 8: SLIDING WINDOW")
print("=" * 60)

def max_subarray_sum(nums, k):
    if len(nums) < k:
        return None
    
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    for i in range(k, len(nums)):
        window_sum = window_sum + nums[i] - nums[i - k]
        if window_sum > max_sum:
            max_sum = window_sum
    
    return max_sum

numbers = [2, 1, 5, 1, 3, 2]
k = 3

result = max_subarray_sum(numbers, k)
print(f"Numbers: {numbers}")
print(f"Maximum sum of {k} consecutive numbers: {result}")
