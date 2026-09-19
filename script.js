const list = [
  {
    name: "Premium T-Shirt",
    price: 490,
    image: "1779024969_L_9.jpeg",
    category: "fashion"
  },
  {
    name: "Smart Watch",
    price: 890,
    image: "1779024969_L_9.jpeg",
    category: "gadgets"
  },
  {
    name: "Earbuds",
    price: 690,
    image: "1779024969_L_9.jpeg",
    category: "gadgets"
  },
  {
    name: "Travel Bag",
    price: 790,
    image: "1779024969_L_9.jpeg",
    category: "bags"
  }
];

const box = document.getElementById("products");
const searchInput = document.getElementById("search");

let cartItems = JSON.parse(localStorage.getItem("yourTrendCart")) || [];

// Products দেখানো
function showProducts(products) {
  box.innerHTML = "";

  if (products.length === 0) {
    box.innerHTML = "<p style='text-align:center;'>কোনো Product পাওয়া যায়নি</p>";
    return;
  }

  products.forEach(function (p) {
    box.innerHTML += `
      <div class="card">
        <img class="img" src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><b>৳${p.price}</b></p>
        <button class="btn" onclick="addCart('${p.name}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

showProducts(list);

// Search
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase().trim();

  const results = list.filter(function (p) {
    return p.name.toLowerCase().includes(keyword);
  });

  showProducts(results);
});

// Category
function filterCategory(category) {
  if (category === "all") {
    showProducts(list);
    return;
  }

  const results = list.filter(function (p) {
    return p.category === category;
  });

  showProducts(results);
}

// Add to Cart
function addCart(productName) {
  const product = list.find(function (p) {
    return p.name === productName;
  });

  if (!product) return;

  const existing = cartItems.find(function (item) {
    return item.name === productName;
  });

  if (existing) {
    existing.quantity++;
  } else {
    cartItems.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  updateCart();
}

// Cart update
function updateCart() {
  localStorage.setItem("yourTrendCart", JSON.stringify(cartItems));


  let count = 0;
  let total = 0;

  cartItems.forEach(function (item) {
    count += item.quantity;
    total += item.price * item.quantity;
  });

  document.getElementById("count").innerText = count;
  document.getElementById("total").innerText = total;

  showCartItems();
}

// Cart items দেখানো
function showCartItems() {
  const cartBox = document.getElementById("cartItems");

  cartBox.innerHTML = "";

  if (cartItems.length === 0) {
    cartBox.innerHTML = "<p>Cart এখন খালি</p>";
    return;
  }

  cartItems.forEach(function (item, index) {
    cartBox.innerHTML += `
      <div style="border-bottom:1px solid #ddd;padding:10px 0;">
        <b>${item.name}</b>
        <p>৳${item.price} × ${item.quantity}</p>

        <button onclick="decreaseItem(${index})">−</button>
        <span style="margin:0 10px;">${item.quantity}</span>
        <button onclick="increaseItem(${index})">+</button>

        <button onclick="removeItem(${index})"
          style="margin-left:10px;">
          ❌
        </button>
      </div>
    `;
  });
}

// Quantity বাড়ানো
function increaseItem(index) {
  cartItems[index].quantity++;
  updateCart();
}

// Quantity কমানো
function decreaseItem(index) {
  cartItems[index].quantity--;

  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }

  updateCart();
}

// Product remove
function removeItem(index) {
  cartItems.splice(index, 1);
  updateCart();
}

// Cart open
function openCart() {
  document.getElementById("cartBox").style.display = "block";
  showCartItems();
}

// Cart close
function closeCart() {
  document.getElementById("cartBox").style.display = "none";
}

// Order
function placeOrder() {
  const n = document.getElementById("name").value.trim();
  const ph = document.getElementById("phone").value.trim();
  const a = document.getElementById("address").value.trim();
  const msg = document.getElementById("msg");

  if (!n || !ph || !a) {
    msg.innerText = "⚠️ সব তথ্য পূরণ করুন";
    return;
  }

  if (cartItems.length === 0) {
    msg.innerText = "⚠️ আগে Cart-এ Product যোগ করুন";
    return;
  }

  let total = 0;

  cartItems.forEach(function (item) {
    total += item.price * item.quantity;
  });

  msg.innerText =
    "✅ অর্ডার সফল! মোট: ৳" + total;

  // Order হওয়ার পর Cart খালি
  cartItems = [];
  updateCart();
}function goCheckout() {
  if (cartItems.length === 0) {
    alert("⚠️ আগে Cart-এ Product যোগ করুন");
    return;
  }

  closeCart();

  showCheckoutSummary();

  document.querySelector(".checkout").scrollIntoView({
    behavior: "smooth"
  });
}
}function showCheckoutSummary() {
  const itemsBox = document.getElementById("checkoutItems");
  const totalBox = document.getElementById("checkoutTotal");

  itemsBox.innerHTML = "";

  let total = 0;

  cartItems.forEach(function (item) {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    itemsBox.innerHTML += `
      <div class="summary-item">
        <span>
          ${item.name} × ${item.quantity}
        </span>
        <b>৳${subtotal}</b>
      </div>
    `;
  });

  totalBox.innerText = total;
}
