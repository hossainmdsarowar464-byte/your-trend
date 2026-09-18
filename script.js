const list=[
["Premium T-Shirt",490,"1779024969_L_10.jpeg"],
["Smart Watch",890,"⌚"],
["Bluetooth Earbuds",690,"🎧"],
["Travel Bag",790,"👜"]
];

const box=document.getElementById("products");
let cart=0;

for(let i=0;i<30;i++){
  let p=list[i%4];
  box.innerHTML+=`
  <div class="card">
    <div class="img">${p[2]}</div>
    <h3>${p[0]}</h3>
    <p><b>৳${p[1]}</b></p>
    <button class="btn" onclick="addCart()">Add to Cart</button>
  </div>`;
}

function addCart(){
  cart++;
  document.getElementById("count").innerText=cart;
}

function placeOrder(){
  const n=name.value,ph=phone.value,a=address.value;
  if(!n||!ph||!a){msg.innerText="সব তথ্য পূরণ করুন";return;}
  msg.innerText="✅ অর্ডার সফল!";
}
