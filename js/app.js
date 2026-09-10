const DATA = { products: {}, list: [], site: {} };

function getCart() {
  try { return JSON.parse(localStorage.getItem("pavlo-cart") || "[]"); }
  catch { return []; }
}

function setCart(items) {
  localStorage.setItem("pavlo-cart", JSON.stringify(items));
  updateCartCount();
}

function cartCount() {
  return getCart().reduce((n, item) => n + item.qty, 0);
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(cartCount());
  });
}

function inStock(item) {
  if (!item) return false;
  if (item.inStock === false || item.stock === 0) return false;
  return true;
}

function addToCart(id) {
  const product = DATA.products[id];
  if (!product || !inStock(product)) return;
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  setCart(cart);
}

function removeFromCart(id) {
  setCart(getCart().filter((item) => item.id !== id));
}

function applySiteCopy() {
  const site = DATA.site;
  document.querySelectorAll("[data-banner]").forEach((el) => {
    if (site.banner) el.textContent = site.banner;
  });
  document.querySelectorAll("[data-footer]").forEach((el) => {
    if (site.footer) el.textContent = site.footer;
  });
  document.querySelectorAll("[data-tagline]").forEach((el) => {
    if (site.tagline) el.textContent = site.tagline;
  });
  document.querySelectorAll("[data-about]").forEach((el) => {
    if (site.about) {
      el.innerHTML = site.about.split(/\n\n+/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("");
    }
  });
  document.querySelectorAll("[data-brand]").forEach((el) => {
    if (site.name) el.textContent = site.name;
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


function promoActive() {
  const promo = DATA.site && DATA.site.promo;
  if (!promo || !promo.active) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (promo.start && today < promo.start) return null;
  if (promo.end && today > promo.end) return null;
  return promo;
}

function unitPrice(item) {
  const promo = promoActive();
  const list = Number(item.price || 0);
  if (promo && promo.type !== "free_shipping" && item.category === promo.category && Number(promo.percent || 0) > 0) {
    return Math.round(list * (1 - Number(promo.percent || 0) / 100));
  }
  return list;
}

function promoNotice(product) {
  const promo = promoActive();
  if (!promo || product.category !== promo.category) return "";
  if (promo.type === "free_shipping") {
    return ` Pads Starter: free shipping on Pads orders $${promo.threshold || 40}+.`;
  }
  if (Number(promo.percent || 0) > 0) {
    return ` ${promo.name} ${promo.percent}% off is applied.`;
  }
  return "";
}

function priceHTML(item) {
  const list = Number(item.price || 0);
  const sale = unitPrice(item);
  const stock = inStock(item) ? "" : `<div class="stock-badge">Out of stock</div>`;
  if (sale < list) {
    return `<div class="price"><s>$${list}</s> <strong>$${sale}</strong></div>${stock}`;
  }
  return `<div class="price">$${list}</div>${stock}`;
}

function marketButtons(item) {
  // marketplace draft links placeholder
  return "";
}

const CATEGORY_ORDER = ["Pads","Walk","Leashes","Bowls","Treats","Toys","Beds","Grooming","Apparel","Travel","Health","Training","Cat Litter","Cat Trees","Cat Toys","Cat Treats","Cat Bowls","Cat Beds","Cat Grooming","Cat Apparel","Cat Travel","Cat Health"];
const CATEGORY_COLOR = {
  Pads:"#ece7df", Walk:"#dce8dc", Leashes:"#e4e0d6", Bowls:"#e7eef2",
};

function tileHTML(product) {
  return `<div class="tile" style="background:${CATEGORY_COLOR[product.category]||"#f0eee9"}"></div>`;
}

async function loadData() {
  const [prodRes, siteRes] = await Promise.all([
    fetch("data/products.json"),
    fetch("data/site.json")
  ]);
  const prodData = await prodRes.json();
  const site = await siteRes.json();
  DATA.site = site;
  const items = prodData.items || prodData;
  DATA.list = items;
  DATA.products = Object.fromEntries(items.map((p) => [p.id, p]));
  applySiteCopy();
  updateCartCount();
}

function renderShop(root) {
  if (!root) return;
  const byCat = {};
  DATA.list.forEach((p) => {
    (byCat[p.category] = byCat[p.category] || []).push(p);
  });
  root.innerHTML = CATEGORY_ORDER.filter((c) => byCat[c]).map((cat) => {
    const items = byCat[cat];
    return `<section class="chapter">
      <div class="kicker">${String(items.length).padStart(2,"0")} objects</div>
      <h2>${cat}</h2>
      <div class="grid">${items.map((p) => `<a class="card" href="product.html?id=${encodeURIComponent(p.id)}">
        ${tileHTML(p)}
        <div class="card-body"><strong>${escapeHtml(p.name)}</strong>${priceHTML(p)}</div>
      </a>`).join("")}</div>
    </section>`;
  }).join("");
}

function renderProduct(root, id) {
  const product = DATA.products[id];
  if (!product) {
    root.innerHTML = "<p>Product not found.</p>";
    return;
  }
  const gallery = product.images || [];
  const hero = gallery[0];
  const thumbs = gallery.map((src, i) => `<button type="button" class="gallery-thumb${i===0?" active":""}" data-src="${src}"><img src="${src}" alt=""></button>`).join("");
  root.innerHTML = `
    <div class="product-layout">
      <div class="product-photos">
        ${hero ? `<img class="product-hero" src="${hero}" alt="${escapeHtml(product.name)}" data-hero>` : tileHTML(product)}
        ${gallery.length > 1 ? `<div class="product-gallery">${thumbs}</div>` : ""}
      </div>
      <div class="product-meta">
        <h1>${escapeHtml(product.name)}</h1>
        ${priceHTML(product)}
        <p>${escapeHtml(product.description || "")}</p>
        ${product.supplier ? `<p class="notice">Ships from ${escapeHtml(product.supplier)}${product.warehouse ? " \u00b7 "+escapeHtml(product.warehouse) : ""}. Label/slip uses PAVLO once the account is live.</p>` : ""}
        <p class="notice">${inStock(product) ? "Preview catalog. Checkout is disabled." : "Out of stock. A supplier has not restocked this item yet. Checkout stays off."}${promoNotice(product)}</p>
        ${inStock(product)
          ? `<button class="btn" type="button" data-add="${escapeHtml(product.id)}">Add to cart</button>`
          : `<button class="btn" type="button" disabled>Out of stock</button>`}
        ${marketButtons(product)}
      </div>
    </div>`;
  root.querySelectorAll(".gallery-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      const heroImg = root.querySelector("[data-hero]");
      if (heroImg) heroImg.src = btn.getAttribute("data-src");
      root.querySelectorAll(".gallery-thumb").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });
}

function renderCart(root) {
  const cart = getCart();
  if (!cart.length) {
    root.innerHTML = "<p>Cart is empty.</p>";
    return;
  }
  let total = 0;
  const rows = cart.map((item) => {
    const product = DATA.products[item.id];
    if (!product) return "";
    const line = unitPrice(product) * item.qty;
    total += line;
    return `<div class="cart-row"><span>${escapeHtml(product.name)} \u00d7 ${item.qty}</span><span>$${line}</span><button type="button" data-remove="${escapeHtml(item.id)}">Remove</button></div>`;
  }).join("");
  root.innerHTML = rows + `<p class="cart-total">Total $${total}</p><p class="notice">Checkout is disabled until a supplier can ship.</p>`;
  root.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-remove"));
      renderCart(root);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  const path = location.pathname;
  if (path.endsWith("shop.html") || path.endsWith("/shop")) renderShop(document.querySelector("[data-shop]") || document.querySelector("main"));
  if (path.includes("product")) {
    const id = new URLSearchParams(location.search).get("id");
    renderProduct(document.querySelector("[data-product]") || document.querySelector("main"), id);
  }
  if (path.endsWith("cart.html") || path.endsWith("/cart")) renderCart(document.querySelector("[data-cart]") || document.querySelector("main"));
  document.body.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      addToCart(add.getAttribute("data-add"));
      updateCartCount();
    }
  });
});
