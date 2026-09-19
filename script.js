const list = [
  {
    name: "Premium T-Shirt",
    price: 490,
    image: "1783948832_L_1.jpeg",
    category: "fashion"
  },
  {
    name: "Smart Watch",
    price: 890,
    image: "1779024969_L_2.jpeg",
    category: "gadgets"
  },
  {
    name: "Earbuds",
    price: 690,
    image: "1779024969_L_3.jpeg",
    category: "gadgets"
  },
  {
    name: "Travel Bag",
    price: 790,
    image: "1779024969_L_4.jpeg",
    category: "bags"
  }
];

const box = document.getElementById("products");
const searchInput = document.getElementById("search");

let cart = 0;

// Product দেখানো
function showProducts(products) {
  box.innerHTML = "";

  if (products.length === 0) {
    box.innerHTML = "<p style='text-align:center;'>কোনো Product পাওয়া যায়নি</p>";
    return;
  }

  products.forEach(function (p) {
    box.innerHTML += `
      <div class="card">
        <img class="img" src="images/${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><b>৳${p.price}</b></p>
        <button class="btn" onclick="addCart()">Add to Cart</button>
      </div>
    `;
  });
}

// প্রথমে সব Product
showProducts(list);

// Search
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase().trim();

  const results = list.filter(function (p) {
    return p.name.toLowerCase().includes(keyword);
  });

  showProducts(results);
});

// Category filter
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

// Cart
function addCart() {
  cart++;
  document.getElementById("count").innerText = cart;
}

// Order
function placeOrder() {
  const n = document.getElementById("name").value.trim();
  const ph = document.getElementById("phone").value.trim();
  const a = document.getElementById("address").value.trim();
  const msg = document.getElementById("msg");

  if (!n || !ph || !a) {
    msg.innerText = "সব তথ্য পূরণ করুন";
    return;
  }

  msg.innerText = "✅ অর্ডার সফল!";
}
