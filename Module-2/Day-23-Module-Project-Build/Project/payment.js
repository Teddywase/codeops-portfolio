// Get DOM elements
const form = document.querySelector("form");
const paymentTotalEl = document.getElementById("paymentTotal");
const nameInput = document.getElementById("name");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const paymentMethodSelect = document.getElementById("paymentMethod");
const payBtn = document.getElementById("payBtn");
const ordError = document.getElementById("ordError");

// Load and display the total price
document.addEventListener("DOMContentLoaded", () => {
    const total = localStorage.getItem("paymentTotal") || "0";
    if (paymentTotalEl) {
        paymentTotalEl.textContent = total + " ETB";
    }
});

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Get values and remove extra spaces
    const name = nameInput.value.trim();
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();
    const paymentMethod = paymentMethodSelect.value;
    const total = localStorage.getItem("paymentTotal") || "0";

    // Regular expressions
    // Name: at least 2 characters
    const nameRegex = /^[A-Za-z ]{2,}$/;
    // Ethiopian phone number
    const phoneRegex = /^(?:\+251|0)9\d{8}$/;

    ordError.textContent = "";
    ordError.style.color = "red";

    // Validate name
    if (!nameRegex.test(name)) {
        ordError.textContent = "Please enter a valid name (at least 2 characters).";
        return;
    }

    // Validate address
    if (address.length < 3) {
        ordError.textContent = "Please enter a valid address.";
        return;
    }

    // Validate phone
    if (!phoneRegex.test(phone)) {
        ordError.textContent = "Invalid Ethiopian phone number. Use format: 0911234567 or +251911234567";
        return;
    }

    // Create order object
    const order = {
        orderId: Date.now(),
        name: name,
        address: address,
        phone: phone,
        paymentMethod: paymentMethod,
        total: total,
        orderDate: new Date().toLocaleString(),
        cart: JSON.parse(localStorage.getItem("addiseats")) || []
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart after successful order
    localStorage.setItem("addiseats", JSON.stringify([]));
    localStorage.removeItem("paymentTotal");

    // Show success message
    alert(`✓ Order Placed Successfully!\n\nOrder ID: ${order.orderId}\nTotal: ${total} ETB\nPayment Method: ${paymentMethod}`);

    // Redirect to home page
    window.location.href = "index.html";
});