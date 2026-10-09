/* YOUR TREND — SHARED NAVIGATION FOR ALL PAGES */

(function () {
  function addBottomNavigation() {
    if (document.getElementById("ytBottomNav")) return;

    const nav = document.createElement("nav");
    nav.id = "ytBottomNav";
    nav.className = "yt-bottom-nav";
    nav.setAttribute("aria-label", "Main navigation");

    nav.innerHTML = `
      <a href="index.html" class="yt-nav-item" data-page="home">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 10 9-7 9 7"></path>
          <path d="M5 9v11h14V9"></path>
          <path d="M9 21v-7h6v7"></path>
        </svg>
        <span>Home</span>
      </a>

      <a href="account.html" class="yt-nav-item" data-page="account">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M4 21a8 8 0 0 1 16 0"></path>
        </svg>
        <span>Account</span>
      </a>

      <a href="index.html#products" class="yt-nav-item" data-page="products">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1"></rect>
        </svg>
        <span>Products</span>
      </a>

      <a href="account.html#orders" class="yt-nav-item" data-page="orders">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 3h9l4 4v14H6z"></path>
          <path d="M14 3v5h5"></path>
          <path d="M9 13h7M9 17h7"></path>
        </svg>
        <span>My Orders</span>
      </a>
    `;

    document.body.appendChild(nav);

    function updateActive() {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isCustomer = path.endsWith("/customer.html");
      const isProduct = path.endsWith("/product.html");

      let active = "home";

      if (isCustomer) {
        active = hash === "#orders" ? "orders" : "account";
      } else if (isProduct || hash === "#products") {
        active = "products";
      }

      nav.querySelectorAll(".yt-nav-item").forEach(function (link) {
        const selected = link.dataset.page === active;
        link.classList.toggle("active", selected);

        if (selected) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    updateActive();
    window.addEventListener("hashchange", updateActive);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addBottomNavigation);
  } else {
    addBottomNavigation();
  }
})();
