# Question 1. Spot the SRP violation. Take a Report class that builds, saves, and emails a report. Split it
#into three focused classes.

from abc import ABC, abstractmethod

class BadReport:
    def __init__(self, data):
        self.data = data
    
    def build(self):
        return f"Report: {self.data}"
    
    def save(self, filename):
        with open(filename, 'w') as f:
            f.write(self.build())
        print(f"Saved to {filename}")
    
    def send_email(self, recipient):
        print(f"Sending report to {recipient}")

class ReportBuilder:
    def __init__(self, data):
        self.data = data
    
    def build(self):
        return f"Report: {self.data}"

class ReportSaver:
    @staticmethod
    def save(content, filename):
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Saved to {filename}")

class ReportEmailer:
    @staticmethod
    def send(content, recipient):
        print(f"Sending report to {recipient}")

print("\nTesting SRP refactor:")
builder = ReportBuilder("Monthly Sales Data")
content = builder.build()
ReportSaver.save(content, "report.txt")
ReportEmailer.send(content, "manager@company.com")

# Question 2. Refactor to OCP. Replace an if/elif that prints a shape's area by shape type with a small
# class hierarchy and one method.

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        return 3.14159 * self.radius ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side
    
    def area(self):
        return self.side ** 2

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def area(self):
        return 0.5 * self.base * self.height

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

def print_area(shape):
    print(f"  {shape.__class__.__name__}: Area = {shape.area():.2f}")

print("Shapes with OCP design:")
shapes = [
    Circle(5),
    Square(4),
    Triangle(3, 6),
    Rectangle(4, 7)
]
for shape in shapes:
    print_area(shape)

# Question 3. Write a Singleton. Build an AppSettings Singleton holding a currency ("ETB") and confirm two
#instances are the same object.

class AppSettings:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.currency = "ETB"
            cls._instance.app_name = "MyApp"
            cls._instance.version = "1.0.0"
        return cls._instance
    
    def update_currency(self, new_currency):
        self.currency = new_currency
        print(f"Currency updated to {new_currency}")

settings1 = AppSettings()
settings2 = AppSettings()

print(f"settings1 is settings2: {settings1 is settings2}")
print(f"Same object ID: {id(settings1)} == {id(settings2)}")
print(f"Currency: {settings1.currency}")
print(f"App Name: {settings1.app_name}")

settings1.update_currency("USD")
print(f"settings2 sees new currency: {settings2.currency}")

# Question 4. Write a Factory. Create a ShapeFactory.create(kind) that returns a Circle, Square, or
#Triangle.

class ShapeFactory:
    @staticmethod
    def create(kind, **kwargs):
        if kind == "circle":
            return Circle(kwargs.get('radius', 1))
        elif kind == "square":
            return Square(kwargs.get('side', 1))
        elif kind == "triangle":
            return Triangle(kwargs.get('base', 1), kwargs.get('height', 1))
        elif kind == "rectangle":
            return Rectangle(kwargs.get('width', 1), kwargs.get('height', 1))
        else:
            raise ValueError(f"Unknown shape type: {kind}")

print("Creating shapes with factory:")
factory_shapes = [
    ShapeFactory.create("circle", radius=3),
    ShapeFactory.create("square", side=5),
    ShapeFactory.create("triangle", base=4, height=6),
    ShapeFactory.create("rectangle", width=3, height=7)
]

for shape in factory_shapes:
    print_area(shape)

# Question 5. Write an Observer pair. Make a NewsAgency subject and two subscriber classes that print when
# notified.

class Subject(ABC):
    def __init__(self):
        self.observers = []
    
    def subscribe(self, observer):
        self.observers.append(observer)
    
    def unsubscribe(self, observer):
        self.observers.remove(observer)
    
    def notify(self, news):
        for observer in self.observers:
            observer.update(news)

class NewsAgency(Subject):
    def publish_news(self, headline, content):
        print(f"\nBreaking News: {headline}")
        news_data = {
            'headline': headline,
            'content': content,
            'timestamp': '2026-07-19 10:00'
        }
        self.notify(news_data)

class Subscriber(ABC):
    @abstractmethod
    def update(self, news_data):
        pass

class Newspaper(Subscriber):
    def __init__(self, name):
        self.name = name
    
    def update(self, news_data):
        print(f"Newspaper {self.name}: {news_data['headline']}")
        print(f"   {news_data['content']}")

class TVStation(Subscriber):
    def __init__(self, name):
        self.name = name
    
    def update(self, news_data):
        print(f"TV {self.name}: Breaking! {news_data['headline']}")
        print(f"   {news_data['content']}")

class SMSAlertSubscriber(Subscriber):
    def __init__(self, phone):
        self.phone = phone
    
    def update(self, news_data):
        print(f"SMS to {self.phone}: {news_data['headline'][:20]}...")

print("News Agency with Observers:")

agency = NewsAgency()

newspaper = Newspaper("Daily Times")
tv = TVStation("ETV")
sms = SMSAlertSubscriber("+251-911-123456")

agency.subscribe(newspaper)
agency.subscribe(tv)
agency.subscribe(sms)

agency.publish_news(
    "New Banking System Launched",
    "CodeOps Bank introduces modern banking system with SOLID principles"
)

print("\n--- Unsubscribing SMS ---")
agency.unsubscribe(sms)
agency.publish_news(
    "Interest Rates Increase",
    "Bank raises interest rates to 7% for savings accounts"
)
