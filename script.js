const products=document.getElementById("products");
const icons=["👕","⌚","🎧","👜"];

for(let i=1;i<=30;i++){
  let price=390+(i%6)*100;

  products.innerHTML+=`
  <div class="card">
    <div class="img">${icons[i%4]}</div>
    <h3>Premium Product ${i}</h3>
    <p><b>৳${price}</b></p>
    <button class="btn">Add to Cart</button>
  </div>`;
}
