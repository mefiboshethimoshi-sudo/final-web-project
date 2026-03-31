// ===============================
// CART DATA
// ===============================
let cart = [];

// ===============================
// SELECT ELEMENTS
// ===============================
const buttons = document.querySelectorAll(".product button");
const cartList = document.querySelector(".cart-items");
const totalDisplay = document.querySelector("#cart h3");
const orderBtn = document.querySelector(".order-btn");

// ===============================
// ADD TO CART
// ===============================
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const product = button.parentElement;

    const name = product.querySelector("h3").innerText;
    const priceText = product.querySelector(".price").innerText;
    const price = parseInt(priceText.replace(/\D/g, ""));

    const item = {
      id: Date.now() + index,
      name: name,
      price: price
    };

    cart.push(item);
    updateCart();
  });
});

// ===============================
// UPDATE CART UI
// ===============================
function updateCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>No items yet</li>";
  } else {
    cart.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${item.name} - TZS ${item.price}
        <button onclick="removeItem(${item.id})">Remove</button>
      `;

      cartList.appendChild(li);
    });
  }

  updateTotal();
}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// ===============================
// CALCULATE TOTAL
// ===============================
function updateTotal() {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  totalDisplay.innerText = "Total: " + total + " TZS";
}

// ===============================
// WHATSAPP ORDER
// ===============================
orderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let message = "Hello, I want to order:%0A";

  cart.forEach(item => {
    message += `- ${item.name} (TZS ${item.price})%0A`;
  });

  let total = cart.reduce((sum, item) => sum + item.price, 0);
  message += `%0ATotal: TZS ${total}`;

  // WhatsApp link
  const phoneNumber = "255700000000"; // change to your number
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(url, "_blank");
});
