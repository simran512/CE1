
const products = [
  { id: 1, name: "Headphones", category: "Tech", price: 1200 },
  { id: 2, name: "Desk Lamp", category: "Home", price: 800 },
  { id: 3, name: "Backpack", category: "Style", price: 1500 },
  { id: 4, name: "Wireless Mouse", category: "Tech", price: 600 },
  { id: 5, name: "Coffee Mug", category: "Home", price: 300 },
  { id: 6, name: "Sunglasses", category: "Style", price: 700 },
  { id: 7, name: "Keyboard", category: "Tech", price: 1000 },
  { id: 8, name: "Water Bottle", category: "Home", price: 400 }
];

let cart = [];
let wishlist = [];
let orders = [];
let discountRate = 0;

function showProducts() {
  const search = document.getElementById("search").value.toLowerCase().trim();
  const category = document.getElementById("category").value;
  const sort = document.getElementById("sort").value;

  let filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) &&
    (category === "All" || product.category === category)
  );

  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  const list = document.getElementById("products");
  list.innerHTML = "";

  filtered.forEach(product => {
    const saved = wishlist.includes(product.id);

    list.innerHTML += `
      <div class="product">
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: ₹${product.price}</p>
        <div class="product-actions">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="wishlist-button" onclick="toggleWishlist(${product.id})">
            ${saved ? "♥ Saved" : "♡ Wishlist"}
          </button>
        </div>
      </div>
    `;
  });

  document.getElementById("search-message").textContent =
    filtered.length ? `${filtered.length} product(s) found` : "No products found. Try another search.";
}

function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity++;
  } else {
    const product = products.find(product => product.id === id);
    cart.push({ ...product, quantity: 1 });
  }

  showCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    showCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(product => product.id !== id);
  showCart();
}

function showCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";

  let count = 0;
  let subtotal = 0;

  cart.forEach(item => {
    count += item.quantity;
    subtotal += item.price * item.quantity;

    list.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <p>₹${item.price} each</p>
        <div class="quantity">
          <button onclick="changeQuantity(${item.id}, -1)">−</button>
          ${item.quantity}
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
          <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent = "₹" + subtotal;
  document.getElementById("discount").textContent = "₹" + discount;
  document.getElementById("total").textContent = "₹" + total;
  document.getElementById("checkout-total").textContent = "₹" + total;
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
  } else {
    wishlist.push(id);
  }

  document.getElementById("wish-count").textContent = wishlist.length;
  showProducts();
  showWishlist();
}

function showWishlist() {
  const list = document.getElementById("wishlist-products");
  list.innerHTML = "";

  const saved = products.filter(product => wishlist.includes(product.id));

  if (saved.length === 0) {
    list.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  saved.forEach(product => {
    list.innerHTML += `
      <div class="product wishlist-item">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price}</p>
        <div class="product-actions">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="remove" onclick="toggleWishlist(${product.id})">Remove</button>
        </div>
      </div>
    `;
  });
}

function showOrders() {
  const list = document.getElementById("orders-list");
  list.innerHTML = "";

  if (orders.length === 0) {
    list.innerHTML = "<p>You have not placed any orders yet.</p>";
    return;
  }

  orders.forEach((order, index) => {
    list.innerHTML += `
      <div class="order-item">
        <strong>Order #${index + 1}</strong>
        <p>Customer: ${order.name}</p>
        <p>Items: ${order.items}</p>
        <p>Total: ₹${order.total}</p>
        <p>Status: Order placed</p>
      </div>
    `;
  });
}

function showSection(id) {
  document.querySelectorAll(".extra-section").forEach(section => {
    section.classList.add("hidden");
  });

  if (id === "shop") {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    return;
  }

  document.getElementById(id).classList.remove("hidden");

  if (id === "wishlist-section") showWishlist();
  if (id === "orders-section") showOrders();

  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

document.getElementById("search").addEventListener("input", showProducts);
document.getElementById("category").addEventListener("change", showProducts);
document.getElementById("sort").addEventListener("change", showProducts);

document.getElementById("apply-coupon").addEventListener("click", function() {
  const code = document.getElementById("coupon").value.trim().toUpperCase();
  const message = document.getElementById("coupon-message");

  if (cart.length === 0) {
    discountRate = 0;
    message.textContent = "Add products to your cart first.";
    message.style.color = "red";
  } else if (code === "SAVE10") {
    discountRate = 0.10;
    message.textContent = "10% discount applied!";
    message.style.color = "green";
  } else {
    discountRate = 0;
    message.textContent = "Invalid coupon. Try SAVE10.";
    message.style.color = "red";
  }

  showCart();
});

document.getElementById("checkout").addEventListener("click", function() {
  if (cart.length === 0) {
    document.getElementById("checkout-message").textContent = "Your cart is empty.";
    return;
  }

  document.getElementById("checkout-message").textContent = "";
  showSection("checkout-section");
});

document.getElementById("checkout-form").addEventListener("submit", function(event) {
  event.preventDefault();

  if (cart.length === 0) return;

  const name = document.getElementById("customer-name").value.trim();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - Math.round(subtotal * discountRate);
  const items = cart.map(item => `${item.name} x ${item.quantity}`).join(", ");

  orders.push({ name, items, total });

  cart = [];
  discountRate = 0;

  document.getElementById("coupon").value = "";
  document.getElementById("coupon-message").textContent = "Use SAVE10 for 10% off.";
  document.getElementById("checkout-message").textContent = "Order placed successfully!";
  document.getElementById("checkout-form").reset();

  showCart();
  showOrders();
  showSection("orders-section");
  document.getElementById("checkout-message").textContent = "Order placed successfully!";
});

showProducts();
showCart();
showWishlist();
