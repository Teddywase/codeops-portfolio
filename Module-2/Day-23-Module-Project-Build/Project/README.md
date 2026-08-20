# Addis Eats - Food Ordering App

A complete food ordering application for an Addis restaurant. Browse Ethiopian dishes, search in real-time, manage your cart, and place orders with customer details and payment method selection.

## ✨ Features

- **Menu Display** - Browse 20+ Ethiopian dishes with categories and spicy indicators
- **Live Search** - Filter dishes in real-time as you type
- **Shopping Cart** - Add/remove items, quantities update automatically
- **Live Total** - See total price update instantly in ETB
- **Persistent Cart** - Cart saves automatically to localStorage
- **Order Placement** - Complete order form with validation
- **Order Storage** - All orders saved to localStorage with unique IDs
- **Payment Methods** - Telebirr, CBE, and Cash on Delivery options
- **Form Validation** - Name, address, and Ethiopian phone number validation
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Success Tracking** - Order confirmation with Order ID and total

## 📁 Project Structure

```
Project/
├── index.html          # Main menu page
├── payment.html        # Payment/checkout page
├── app.js              # Main application logic
├── payment.js          # Payment form handling
├── style.css           # Styling for both pages
├── data/
│   └── menu.json       # Menu items database
└── README.md           # This file
```

## 🚀 How to Use

1. **Browse Menu** - Open `index.html` in your browser
2. **Search Dishes** - Use the search bar to filter by name
3. **Add to Cart** - Click "Add to order" on any dish
4. **View Cart** - Cart updates in real-time on the right side
5. **Checkout** - Click "Process Payment" button
6. **Fill Form** - Enter your name, address, phone, and payment method
7. **Confirm Order** - Click "Pay Now" to submit
8. **Success** - You'll see your Order ID and be redirected to home

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, Responsive design
- **JavaScript (ES6)** - Async/await, localStorage, DOM manipulation
- **JSON** - Menu data format

## File Descriptions

- **index.html** - Main page with menu grid and cart sidebar
- **payment.html** - Checkout page with order form
- **app.js** - Menu loading, cart management, navigation
- **payment.js** - Form validation, order processing, localStorage
- **style.css** - All styling for both pages
- **menu.json** - Restaurant menu with dish details (name, price, category, image, spicy)

## Data Storage

Orders are saved locally with the following structure:
```javascript
{
  orderId: 1234567890,
  name: "Customer Name",
  address: "Customer Address",
  phone: "0911234567",
  paymentMethod: "cash",
  total: "500",
  orderDate: "8/20/2026, 10:30:00 AM",
  cart: [/* ordered items */]
}
```

## Validation Rules

- **Name** - At least 2 characters (letters and spaces only)
- **Address** - At least 3 characters
- **Phone** - Ethiopian format: 0911234567 or +251911234567

## Future Enhancements

- Admin dashboard to view orders
- Email notifications
- Order tracking
- User accounts and history
- Real payment gateway integration
- Order cancellation/modification