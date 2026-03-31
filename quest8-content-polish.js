let cart = JSON.parse(localStorage.getItem("cart")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

const cartList = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const searchInput = document.getElementById("search");

/* ADMIN LOGIN */
let isAdmin = false;
const password = "1234";

document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!isAdmin) {
      const input = prompt("Enter admin password:");
      if (input === password) {
        isAdmin = true;
      } else {
        alert("Wrong password!");
        return;
      }
    }
    const product = btn.closest(".product");
    editProduct(product);
  });
});

/* CART FUNCTIONS */
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  updateCart();
  saveCart();
}

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = "<li>No items yet</li>";
  }

  cart.forEach((item, index) => {
    if(item.quantity < 1) item.quantity = 1;
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} - TZS ${item.price * item.quantity}
      <button onclick="cart[${index}].quantity++; updateCart();">+</button>
      <button onclick="cart[${index}].quantity--; updateCart();">-</button>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
  });

  totalText.innerText = `Total: ${total} TZS`;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  saveCart();
}

/* SEARCH */
searchInput.addEventListener("keyup", (e) => {
  document.querySelectorAll(".product").forEach(p => {
    p.style.display = p.innerText.toLowerCase().includes(e.target.value.toLowerCase()) ? "block" : "none";
  });
});

/* EDIT PRODUCT */
function editProduct(product) {
  const name = product.querySelector("h3");
  const price = product.querySelector(".price");

  const newName = prompt("New name:", name.innerText);
  const newPrice = prompt("New price:", price.dataset.price);

  if (newName) name.innerText = newName;
  if (newPrice) {
    price.dataset.price = newPrice;
    price.innerText = `TZS ${newPrice}`;
  }
}

/* CHECKOUT */
document.getElementById("checkout-btn").onclick = () => {
  if (cart.length === 0) return alert("Cart empty!");
  document.getElementById("checkout").style.display = "block";
};

/* CONFIRM ORDER */
document.getElementById("confirm-order").onclick = () => {
  history.push([...cart]);
  localStorage.setItem("history", JSON.stringify(history));
  cart = [];
  saveCart();
  updateCart();
  showHistory();
  alert("Order placed!");
};

/* ORDER HISTORY */
function showHistory() {
  const list = document.getElementById("order-history");
  list.innerHTML = "";

  history.forEach(order => {
    const li = document.createElement("li");
    li.innerText = order.map(i => `${i.name} x${i.quantity}`).join(", ");
    list.appendChild(li);
  });
}

showHistory();

/* ADD TO CART BUTTONS */
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.onclick = () => {
    const product = btn.closest(".product");
    const name = product.querySelector("h3").innerText;
    const price = parseInt(product.querySelector(".price").dataset.price);
    addToCart(name, price);
  };
});

/* WHATSAPP ORDER */
document.getElementById("order-btn").onclick = () => {
  if(cart.length === 0) return alert("Cart is empty!");
  let total = cart.reduce((sum,i)=>sum + i.price*i.quantity,0);
  let msg = "Order:\n";
  cart.forEach(i => msg += `${i.name} x${i.quantity}\n`);
  msg += `Total: TZS ${total}`;
  window.open(`https://wa.me/255699059787?text=${encodeURIComponent(msg)}`);
};

/* CLEAR CART */
document.getElementById("clear-cart").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is already empty!");
    return;
  }
  if (confirm("Are you sure you want to clear the cart?")) {
    cart = [];
    saveCart();
    updateCart();
  }
});