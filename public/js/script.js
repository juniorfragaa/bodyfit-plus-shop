// I validate the contact form in the browser before it is sent
const form = document.getElementById("contact-form");

form.addEventListener("submit", function (event) {
    event.preventDefault(); // I stop the page from reloading when the form is submitted

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    let isValid = true;

    // I clear the old error messages before checking again
    document.getElementById("name-error").textContent = "";
    document.getElementById("phone-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("message-error").textContent = "";

    // I check the name: required, letters and spaces only
    if (name === "") {
        document.getElementById("name-error").textContent = "Name is required.";
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
        document.getElementById("name-error").textContent = "Name must contain only letters and spaces.";
        isValid = false;
    }

    // I check the phone: required, numbers only, 9 or 10 digits
    if (phone === "") {
        document.getElementById("phone-error").textContent = "Phone number is required.";
        isValid = false;
    } else if (!/^\d{9,10}$/.test(phone)) {
        document.getElementById("phone-error").textContent = "Phone number must be 9 or 10 digits, numbers only.";
        isValid = false;
    }

    // I check that the email and the message are not empty
    if (email === "") {
        document.getElementById("email-error").textContent = "Email is required.";
        isValid = false;
    }

    if (message === "") {
        document.getElementById("message-error").textContent = "Please describe your query.";
        isValid = false;
    }

    if (isValid) {
        alert("Thank you! Your message has been sent.");
        form.reset();
    }
});
