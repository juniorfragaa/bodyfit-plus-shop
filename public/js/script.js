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

// HELPERS FOR THE SHOP AND THE BASKET

// I write "month" for 1 and "months" for more than 1 (for plans the quantity means months)
function monthWord(quantity) {
    if (quantity === 1) {
        return "month";
    }
    return "months";
}

// I send a POST request to one of my basket routes with the product id (like fetch in the Login handbook)
async function sendToBasket(route, productId) {
    await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId })
    });
}

// I look in the basket rows for one product and return its quantity (0 if it is not there)
function quantityInBasket(basket, productId) {
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].product_id === productId) {
            return basket[i].quantity;
        }
    }
    return 0;
}

// I show the number of items next to the Basket link in the menu, for example "Basket (3)".
// A plan counts as 1 item, because its quantity is months
async function updateBasketCount() {
    let basketLink = document.getElementById("basket-link");
    if (!basketLink) {
        return;
    }

    try {
        let productsResponse = await fetch("/products");
        let products = await productsResponse.json();
        let basketResponse = await fetch("/basket");
        let basket = await basketResponse.json();
        let count = 0;

        for (let i = 0; i < basket.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === basket[i].product_id) {
                    if (products[j].category === "plan") {
                        count = count + 1;
                    } else {
                        count = count + basket[i].quantity;
                    }
                }
            }
        }

        if (count > 0) {
            basketLink.textContent = "Basket (" + count + ")";
        } else {
            basketLink.textContent = "Basket";
        }
    } catch (error) {
        console.log(error);
    }
}

// I update the count as soon as any page opens
updateBasketCount();

// SHOP PAGE
// I only load the products if this page has the product list (products.html)
const productList = document.getElementById("product-list");

if (productList) {
    showShop();
}

// I ask my server for the products and the basket, then build one card for each product
async function showShop() {
    try {
        let productsResponse = await fetch("/products");
        let products = await productsResponse.json();
        let basketResponse = await fetch("/basket");
        let basket = await basketResponse.json();

        // I find out if there is already a plan in the basket
        let planInBasket = 0;
        for (let i = 0; i < products.length; i++) {
            if (products[i].category === "plan" && quantityInBasket(basket, products[i].id) > 0) {
                planInBasket = products[i].id;
            }
        }

        let output = "";

        // I loop through every product and build one card for each
        for (let i = 0; i < products.length; i++) {
            // The price comes from MySQL as text ("45.00"), so I use parseInt to turn it into a number
            let price = parseInt(products[i].price);
            let quantity = quantityInBasket(basket, products[i].id);

            // The line above the button: how many are in the basket, with - and + to change it
            let inBasket = "";
            if (quantity > 0) {
                let text = "In your basket: " + quantity;
                if (products[i].category === "plan") {
                    text = text + " " + monthWord(quantity);
                }
                inBasket = "<button class='qty-button minus-button'>−</button>" +
                           "<span>" + text + "</span>" +
                           "<button class='qty-button plus-button'>+</button>";
            }

            // A customer can only have one plan, so if another plan is in the basket I tell them here
            if (products[i].category === "plan" && planInBasket !== 0 && planInBasket !== products[i].id) {
                inBasket = "<span>Plan already chosen</span>";
            }

            output +=
                "<div class='product-card'>" +
                    "<img src='" + products[i].image + "' alt='" + products[i].name + "'>" +
                    "<h3>" + products[i].name + "</h3>" +
                    "<p>" + products[i].description + "</p>" +
                    "<p class='product-price'>€" + price + "</p>" +
                    "<div class='in-basket'>" + inBasket + "</div>" +
                    "<button class='add-button'>Add to basket</button>" +
                "</div>";
        }

        // I put all the cards inside the empty div at once
        productList.innerHTML = output;

        // I give the buttons of every card a click event.
        // The cards are in the same order as the products, so card number i is product number i
        let cards = document.querySelectorAll(".product-card");

        for (let i = 0; i < cards.length; i++) {
            let addButton = cards[i].querySelector(".add-button");
            let minusButton = cards[i].querySelector(".minus-button");
            let plusButton = cards[i].querySelector(".plus-button");

            // I hide the button of the other plans when the customer already chose a plan
            if (products[i].category === "plan" && planInBasket !== 0 && planInBasket !== products[i].id) {
                addButton.style.display = "none";
            }

            addButton.addEventListener("click", async function () {
                await sendToBasket("/basket/add", products[i].id);
                showShop();
                updateBasketCount();
            });

            // The - and + buttons only exist when the product is in the basket
            if (minusButton) {
                minusButton.addEventListener("click", async function () {
                    await sendToBasket("/basket/minus", products[i].id);
                    showShop();
                    updateBasketCount();
                });
                plusButton.addEventListener("click", async function () {
                    await sendToBasket("/basket/add", products[i].id);
                    showShop();
                    updateBasketCount();
                });
            }
        }
    } catch (error) {
        console.log(error);
        document.getElementById("shop-message").textContent =
            "Unable to load products. Please try again.";
    }
}

// REGISTER PAGE
// I only run this if the page has the register form (register.html)
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        // I stop the form from reloading the page
        event.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        let message = document.getElementById("message");

        // I check that both passwords match before sending anything to the server
        if (password !== confirmPassword) {
            message.textContent = "The passwords do not match.";
            return;
        }

        try {
            // I send the data to my /register route as JSON
            let response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name, email: email, password: password })
            });
            let data = await response.json();

            // I show the message the server sent back
            message.textContent = data.message;
        } catch (error) {
            message.textContent = "Unable to connect to server";
        }
    });
}

// LOGIN PAGE
// I only run this if the page has the login form (login.html)
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        let message = document.getElementById("message");

        try {
            // I send the email and password to my /login route
            let response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });
            let data = await response.json();

            // I show the message the server sent back
            message.textContent = data.message;
        } catch (error) {
            message.textContent = "Unable to connect to server";
        }
    });
}

// BASKET PAGE
// I only run this if the page has the basket list (basket.html)
const basketList = document.getElementById("basket-list");

if (basketList) {
    showBasket();
}

// I build the basket: one row per product, the total and the checkout button
async function showBasket() {
    let checkoutLink = document.getElementById("checkout-link");

    try {
        let productsResponse = await fetch("/products");
        let products = await productsResponse.json();
        let basketResponse = await fetch("/basket");
        let basket = await basketResponse.json();

        if (basket.length === 0) {
            basketList.innerHTML = "<p>Your basket is empty. <a href='products.html'>Go to the shop</a></p>";
            document.getElementById("basket-total").textContent = "";
            checkoutLink.style.display = "none";
            return;
        }

        let output = "";
        let total = 0;
        let rowProducts = [];   // I keep the product of each row, in the same order as the rows

        for (let i = 0; i < basket.length; i++) {
            // I find the product details (name, price, image) for this basket row
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === basket[i].product_id) {
                    let product = products[j];
                    let price = parseInt(product.price);
                    let subtotal = price * basket[i].quantity;
                    total = total + subtotal;
                    rowProducts.push(product);

                    let unit = "";
                    if (product.category === "plan") {
                        unit = " " + monthWord(basket[i].quantity);
                    }

                    output +=
                        "<div class='basket-item'>" +
                            "<img src='" + product.image + "' alt='" + product.name + "'>" +
                            "<div class='basket-info'>" +
                                "<h3>" + product.name + "</h3>" +
                                "<p>€" + price + " each</p>" +
                            "</div>" +
                            "<div class='qty-controls'>" +
                                "<button class='qty-button minus-button'>−</button>" +
                                "<span>" + basket[i].quantity + unit + "</span>" +
                                "<button class='qty-button plus-button'>+</button>" +
                            "</div>" +
                            "<p class='basket-subtotal'>€" + subtotal + "</p>" +
                            "<button class='remove-button'>Remove</button>" +
                        "</div>";
                }
            }
        }

        basketList.innerHTML = output;
        document.getElementById("basket-total").textContent = "Total: €" + total;
        checkoutLink.style.display = "inline-block";

        // I give the -, + and Remove buttons of every row a click event
        let rows = document.querySelectorAll(".basket-item");

        for (let i = 0; i < rows.length; i++) {
            let productId = rowProducts[i].id;

            rows[i].querySelector(".minus-button").addEventListener("click", async function () {
                await sendToBasket("/basket/minus", productId);
                showBasket();
                updateBasketCount();
            });
            rows[i].querySelector(".plus-button").addEventListener("click", async function () {
                await sendToBasket("/basket/add", productId);
                showBasket();
                updateBasketCount();
            });
            rows[i].querySelector(".remove-button").addEventListener("click", async function () {
                await sendToBasket("/basket/remove", productId);
                showBasket();
                updateBasketCount();
            });
        }
    } catch (error) {
        console.log(error);
        basketList.innerHTML = "<p>Unable to load the basket. Please try again.</p>";
    }
}

// CHECKOUT PAGE
// I only run this if the page has the checkout form (checkout.html)
const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
    showCheckout();

    checkoutForm.addEventListener("submit", async function (event) {
        // I stop the form from reloading the page
        event.preventDefault();

        let name = document.getElementById("checkoutName").value;
        let email = document.getElementById("checkoutEmail").value;
        let message = document.getElementById("message");

        try {
            // I send the name and email to my /orders route. The server reads the basket itself
            let response = await fetch("/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name, email: email })
            });
            let data = await response.json();

            // I show the confirmation message from the server
            message.textContent = data.message;

            // If the order was placed, the basket is now empty, so I hide the form and update the page
            if (response.status === 200) {
                checkoutForm.style.display = "none";
                document.getElementById("home-link").style.display = "inline-block";
                document.getElementById("checkout-summary").style.display = "none";
                document.getElementById("checkout-total").textContent = "";
                updateBasketCount();
            }
        } catch (error) {
            message.textContent = "Unable to connect to server";
        }
    });
}

// I show a summary of the basket on the checkout page: one line per product and the total
async function showCheckout() {
    let summary = document.getElementById("checkout-summary");

    try {
        let productsResponse = await fetch("/products");
        let products = await productsResponse.json();
        let basketResponse = await fetch("/basket");
        let basket = await basketResponse.json();

        if (basket.length === 0) {
            summary.innerHTML = "<p>Your basket is empty. <a href='products.html'>Go to the shop</a></p>";
            document.getElementById("checkout-total").textContent = "";
            return;
        }

        let output = "";
        let total = 0;

        for (let i = 0; i < basket.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (products[j].id === basket[i].product_id) {
                    let price = parseInt(products[j].price);
                    let subtotal = price * basket[i].quantity;
                    total = total + subtotal;

                    let unit = "";
                    if (products[j].category === "plan") {
                        unit = " " + monthWord(basket[i].quantity);
                    }

                    output += "<p>" + products[j].name + " x " + basket[i].quantity + unit +
                              " <strong>€" + subtotal + "</strong></p>";
                }
            }
        }

        summary.innerHTML = output;
        document.getElementById("checkout-total").textContent = "Total: €" + total;
    } catch (error) {
        console.log(error);
        summary.innerHTML = "<p>Unable to load your order. Please try again.</p>";
    }
}
