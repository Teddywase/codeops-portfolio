# Signup Form Validation
## Description
This project is a simple signup form built with HTML, CSS, and JavaScript.
The form collects:
* Full name
* Email address
* Ethiopian phone number
* Password
JavaScript regular expressions are used to validate the form before saving the information.
The valid signup entries are stored in `localStorage` as JSON and restored when the page is loaded again.
## Files
### `index.html`
Contains:
* Signup form
* Name input
* Email input
* Phone input
* Password input
* Submit button
* Error message area
* Signup counter
* CSS styling
* JavaScript validation

### `app.js`
If the JavaScript is separated from the HTML, this file contains:
* Form submission handling
* Regular expressions
* Input validation
* Error messages
* localStorage
* JSON conversion
* Signup counter
* Restoring saved data

### `expected.txt`

Contains the expected behavior that the form should satisfy.

## Validation Requirements

### Name

The name must contain at least two characters and may contain letters and spaces.

Valid:

* `Abebe`
* `Abebe Kebede`
* `Abebe Michael Kebede`

Invalid:

* `A`
* `Abe23`
* `Abe@Kebe`

Regex:

```js
/^[A-Za-z ]{2,}$/
```

### Email

The email must have a valid email format.

Example:

```text
Abebe@gmail.com
```

Regex:

```js
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

### Ethiopian Phone Number

The phone number must be an Ethiopian mobile number.

Valid examples:

```text
0911234567
+251911234567
```

Regex:

```js
/^(?:\+251|0)9\d{8}$/
```

### Password

The password must:

* Have at least 8 characters
* Contain an uppercase letter
* Contain a lowercase letter
* Contain a number
* Contain a special character

Example:

```text
Abebe@123
```

Regex:

```js
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/
```

## Form Behavior

When the user submits the form:

1. The default form submission is prevented using `preventDefault()`.
2. The input values are read.
3. Extra spaces are removed using `trim()`.
4. The name is validated.
5. The email is validated.
6. The phone number is validated.
7. The password is validated.
8. If there is an error, a specific error message is displayed.
9. The form stops at the first validation error.
10. If everything is valid, the signup information is saved.
11. The form is cleared.
12. The signup count is updated.

## localStorage

Signup information is stored using the browser's `localStorage`.

The JavaScript converts the array to JSON using:

```js
JSON.stringify(people)
```

When reading the saved information, JSON is converted back to a JavaScript array using:

```js
JSON.parse(localStorage.getItem("people"))
```

Example stored data:

```json
[
    {
        "name": "Abebe Kebede",
        "email": "Abebe@gmail.com",
        "phone": "0911234567",
        "password": "Abebe@123"
    }
]
```
