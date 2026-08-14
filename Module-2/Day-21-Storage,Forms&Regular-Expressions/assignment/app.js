// Get elements
const form = document.getElementById("Form");
const error = document.getElementById("error");
const count = document.getElementById("count");

// Submit event
form.addEventListener("submit", function (event) {

    // Prevent form from refreshing the page
    event.preventDefault();


    // Get values and remove extra spaces
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();


    // Regular expressions
    // Name: at least 2 characters
    const nameRegex = /^[A-Za-z ]{2,}$/;
    // Email
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Ethiopian phone number
    const phoneRegex =
        /^(?:\+251|0)9\d{8}$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;

    // Clear previous error
    error.textContent = "";
    error.style.color = "red";

    // Validate name
    if (!nameRegex.test(name)) {
        error.textContent =
            "Please enter a valid name.";
        return;
    }
    // Validate email
    if (!emailRegex.test(email)) {
        error.textContent =
            "Please enter a valid email address.";
        return;
    }
    // Validate phone
    if (!phoneRegex.test(phone)) {
        error.textContent =
            "Invalid Ethiopian phone number.";
        return;
    }
    // Validate password
    if (!passwordRegex.test(password)) {
        error.textContent =
            "Password must be 8+ characters with uppercase, lowercase, number and symbol.";
        return;
    }
    // Get existing users from localStorage
    let people =
        JSON.parse(localStorage.getItem("people")) || [];
    // Create new user
    const person = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    // Add user to array
    people.push(person);

    // Save users as JSON
    localStorage.setItem(
        "people",
        JSON.stringify(people)
    );
    // Success message
    error.style.color = "green";
    error.textContent =
        "Signup successful!";
    // Clear form
    form.reset();
    // Update count
    showCount();
});
// Show number of registered people
function showCount() {

    const people =
        JSON.parse(localStorage.getItem("people")) || [];

    count.textContent =
        people.length + " people have signed up.";
}
// Run when page loads
window.addEventListener("load", function () {
    showCount();
});