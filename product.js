const product =
  JSON.parse(
    localStorage.getItem("selectedProduct")
  );


if (!product) {

  alert("⚠️ Product পাওয়া যায়নি");

  window.location.href = "index.html";

}


document.getElementById("productImage").src =
  product.image;


document.getElementById("productName").innerText =
  product.name;


document.getElementById("productPrice").innerText =
  product.price;


document.getElementById("productDescription").innerText =
  product.description;


function addSelectedProduct() {

  let cartItems =
    JSON.parse(
      localStorage.getItem("yourTrendCart")
    ) || [];


  const existing =
    cartItems.find(function (item) {

      return item.name === product.name;

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


  localStorage.setItem(
    "yourTrendCart",
    JSON.stringify(cartItems)
  );


  alert("✅ Product Cart-এ যোগ হয়েছে");

}
