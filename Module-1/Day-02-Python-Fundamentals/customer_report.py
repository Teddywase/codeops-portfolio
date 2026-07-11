
customer =[("Almaz", 1500), ("Dawit", 700), ("Tigist", 200), ("Hanna", 1200), ("Samuel", 450),]

def tier(balance):
    if balance >= 1000:
        return "Premimum"
    elif balance >=500:
        return "Standard"
    else:
        return "Basic"
for name, balance in customer:
    print(f"{name} : {tier(balance)} ({balance} ETB)")
