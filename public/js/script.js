// CONTACT FORM
// I look for the contact form on the page
const form = document.getElementById("contact-form");

// I only run the contact form code if this page has the contact form (contact.html)
if (form) {
    // I validate the contact form in the browser before it is sent
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
}

// SHOP PAGE
// I only load the products if this page has the product list (products.html)
const productList = document.getElementById("product-list");

if (productList) {
    // I ask my server for the products. The server reads them from MySQL and sends JSON
    fetch("/products")
        .then(response => response.json())
        .then(products => {
            let output = "";

            // I loop through every product and build one card for each
            for (let i = 0; i < products.length; i++) {
                // The price comes from MySQL as text ("45.00"), so I turn it into a number
                let price = Number(products[i].price);

                output +=
                    "<div class='product-card'>" +
                        "<img src='" + products[i].image + "' alt='" + products[i].name + "'>" +
                        "<h3>" + products[i].name + "</h3>" +
                        "<p>" + products[i].description + "</p>" +
                        "<p class='product-price'>€" + price.toFixed(2) + "</p>" +
                        "<button class='add-button' data-id='" + products[i].id + "'>Add to basket</button>" +
                    "</div>";
            }

            // I put all the cards inside the empty div at once
            productList.innerHTML = output;
        })
        .catch(error => {
            console.log(error);
            document.getElementById("shop-message").textContent =
                "Unable to load products. Please try again.";
        });
}