const list = [
  ["Premium T-Shirt", 490, "1783948832_L_1.jpeg"],
  ["Smart Watch", 890, "1779024969_L_2.jpeg"],
  ["Earbuds", 690, "1779024969_L_3.jpeg"],
  ["Travel Bag", 790, "1779024969_L_4.jpeg"]
];

const box = document.getElementById("products");
const searchInput = document.getElementById("search");

let cart = 0;

// Products দেখানো
function showProducts(products) {
  box.innerHTML = "";

  products.forEach(function (p) {
    box.innerHTML += `
      <div class="card">
        <img class="img" src="images/${p[2]}" alt="${p[0]}">
        <h3>${p[0]}</h3>
        <p><b>৳${p[1]}</b></p>
        <button class="btn" onclick="addCart()">Add to Cart</button>
      </div>
    `;
  });
}

// প্রথমে সব Product দেখাবে
showProducts(list);

// Search
searchInput.addEventListener("input", function () {
  const keyword = searchInput.value.toLowerCase().trim();

  const results = list.filter(function (p) {
    return p[0].toLowerCase().includes(keyword);
  });

  showProducts(results);
});

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
