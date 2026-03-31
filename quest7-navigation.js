// --------------------
// Initial Products
// --------------------
const defaultProducts = [
  {id:1,name:"Elegant Handbag",price:50000,img:"images/bag1.jpg"},
  {id:2,name:"Luxury Purse",price:30000,img:"images/bag2.jpg"},
  {id:3,name:"Casual Bag",price:20000,img:"images/bag3.jpg"},
  {id:4,name:"Leather Handbag",price:70000,img:"images/bag4.jpg"},
  {id:5,name:"Mini Pochi",price:15000,img:"images/bag5.jpg"},
  {id:6,name:"Classic Shoulder Bag",price:45000,img:"images/bag6.jpg"},
  {id:7,name:"Designer Pochi",price:35000,img:"images/bag7.jpg"},
  {id:8,name:"Travel Bag",price:80000,img:"images/bag8.jpg"},
  {id:9,name:"Office Handbag",price:55000,img:"images/bag9.jpg"},
  {id:10,name:"Fashion Tote Bag",price:40000,img:"images/bag10.jpg"}
];

// --------------------
// Load Products from localStorage
// --------------------
let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;

// --------------------
// Render Products
// --------------------
const productContainer = document.getElementById("product-container");
function renderProducts() {
  productContainer.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.dataset.id = p.id;
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price" data-price="${p.price}">TZS ${p.price.toLocaleString()}</p>
      <div class="product-buttons">
        <button class="add-to-cart">Add to Cart</button>
        <button class="edit-btn">Edit</button>
      </div>
    `;
    productContainer.appendChild(div);
  });
  attachProductEvents();
}
renderProducts();

// --------------------
// Reset Products
// --------------------
document.getElementById("reset-products").addEventListener("click", ()=>{
  if(confirm("Reset all products to default?")){
    products = defaultProducts;
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
  }
});

// --------------------
// CART
// --------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const searchInput = document.getElementById("search");
const orderBtn = document.getElementById("order-btn");

function saveCart(){ localStorage.setItem("cart",JSON.stringify(cart)); }
function saveProducts(){ localStorage.setItem("products",JSON.stringify(products)); }

function addToCart(name,price){
  const existing = cart.find(item=>item.name===name);
  if(existing) existing.quantity++;
  else cart.push({id:Date.now(),name,price,quantity:1});
  updateCart();
  saveCart();
}

function removeItem(index){
  cart.splice(index,1);
  updateCart();
  saveCart();
}

function changeQuantity(index,delta){
  cart[index].quantity += delta;
  if(cart[index].quantity<=0) removeItem(index);
  updateCart();
  saveCart();
}

function updateCart(){
  cartList.innerHTML="";
  let total=0;
  if(cart.length===0) cartList.innerHTML="<li>No items yet</li>";
  cart.forEach((item,index)=>{
    total+=item.price*item.quantity;
    const li=document.createElement("li");
    li.innerHTML=`
      ${item.name} (x${item.quantity}) - ${item.price*item.quantity} TZS
      <button onclick="changeQuantity(${index},1)">+</button>
      <button onclick="changeQuantity(${index},-1)">-</button>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
  });
  totalText.innerText=`Total: ${total} TZS`;
}
updateCart();

// --------------------
// SEARCH
// --------------------
function searchProducts(value){
  let found=false;
  document.querySelectorAll(".product").forEach(product=>{
    const name=product.querySelector("h3").innerText.toLowerCase();
    if(name.includes(value.toLowerCase())){
      product.style.display="block";
      found=true;
    } else product.style.display="none";
  });
  const noResults=document.getElementById("no-results");
  if(!found && !noResults){
    const p=document.createElement("p");
    p.id="no-results";
    p.innerText="No products found";
    document.getElementById("products").appendChild(p);
  } else if(found && noResults) noResults.remove();
}

// --------------------
// EDIT PRODUCT
// --------------------
function attachProductEvents(){
  document.querySelectorAll(".edit-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const div=btn.closest(".product");
      const id=parseInt(div.dataset.id);
      const product=products.find(p=>p.id===id);
      const newName=prompt("New name:",product.name);
      const newPrice=prompt("New price:",product.price);
      if(newName && newPrice){
        product.name=newName;
        product.price=parseInt(newPrice);
        saveProducts();
        renderProducts();
      }
    });
  });

  document.querySelectorAll(".add-to-cart").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const div=btn.closest(".product");
      const id=parseInt(div.dataset.id);
      const product=products.find(p=>p.id===id);
      addToCart(product.name,product.price);
    });
  });
}

// --------------------
// CONTACT FORM
// --------------------
const contactForm=document.getElementById("contact-form");
contactForm.addEventListener("submit",function(e){
  e.preventDefault();
  const name=this.querySelector('input[type="text"]').value.trim();
  const email=this.querySelector('input[type="email"]').value.trim();
  const message=this.querySelector('textarea').value.trim();
  if(!name || !email || !message){ alert("Please fill in all fields!"); return; }
  alert("Thank you! Your message has been sent.");
  this.reset();
});

// --------------------
// WhatsApp Order
// --------------------
orderBtn.addEventListener("click",()=>{
  if(cart.length===0){ alert("Your cart is empty!"); return; }
  let message="Hello, I want to order:\n";
  cart.forEach(item=>{ message+=`${item.name} x${item.quantity} = TZS ${item.price*item.quantity}\n`; });
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  message+=`Total: TZS ${total}`;
  const whatsappURL=`https://wa.me/255699059787?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL,"_blank");

  cart=[]; saveCart(); updateCart();
});

// --------------------
// SEARCH EVENT
// --------------------
searchInput.addEventListener("keyup",e=>{ searchProducts(e.target.value); });