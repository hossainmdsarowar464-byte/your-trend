const box=document.getElementById("products");
const icons=["👕","⌚","🎧","👜"];
let cart=0;

for(let i=1;i<=30;i++){
  let price=390+(i%6)*100;
  box.innerHTML+=`
  <div class="card">
    <div class="img">${icons[i%4]}</div>
    <h3>Premium Product ${i}</h3>
    <p><b>৳${price}</b></p>
    <button class="btn" onclick="addCart()">Add to Cart</button>
  </div>`;
}

function addCart(){
  cart++;
  document.getElementById("count").innerText=cart;
}function placeOrder(){
  const n=name.value,p=phone.value,a=address.value;
  if(!n||!p||!a){msg.innerText="সব তথ্য পূরণ করুন";return;}
  msg.innerText="✅ অর্ডার সফল!";
}
