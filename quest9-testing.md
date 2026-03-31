# Fahari ya Mrembo 👜 — Quest 9: Form Validation & Error Handling

## Overview

This submission demonstrates the **form validation and error handling** implemented on the website.
It ensures that:

* Users cannot submit empty or invalid inputs
* Name and message fields require at least 3 characters
* Email field is validated using HTML5 email type and regex
* User-friendly error messages are displayed
* Edge cases are handled gracefully (emoji input, empty spaces)

---

## Contact Form Validation Code

```javascript
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formError = document.getElementById("form-error");

function showError(msg) {
  formError.innerText = msg;
  setTimeout(() => formError.innerText = '', 3000);
}

function validateInput(input) {
  if (input.trim() === '') {
    showError('Please enter a value');
    return false;
  }
  if (input.trim().length < 3) {
    showError('Must be at least 3 characters');
    return false;
  }
  return true;
}

function validateEmail(email) {
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!re.test(email)) {
    showError('Enter a valid email');
    return false;
  }
  return true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateInput(nameInput.value)) return;
  if (!validateEmail(emailInput.value)) return;
  if (!validateInput(messageInput.value)) return;

  alert("Form submitted successfully!");
  form.reset();
});
```

---

## How It Works

1. **Trim and Check Empty Values**
   Prevents whitespace-only inputs.

2. **Minimum Length**
   Name and message must be at least 3 characters.

3. **Email Validation**
   Uses regex to ensure the format is correct.

4. **Error Display**
   Shows temporary messages in the UI.

5. **Successful Submission**
   Alerts user and resets the form if all inputs are valid.

---

## Testing Notes

* Tested with **empty fields** → Shows error
* Tested with **less than 3 characters** → Shows error
* Tested with **invalid email** → Shows error
* Tested with **emoji input** → Accepted if valid length
* Form cannot submit unless all validation passes

---

✅ **End of Submission — Quest 9**
