
const state = {
    dishes: [],
    cart: [],
    search: "",
};


const menuEl = document.querySelector("#menu");
const cartEl = document.getElementById("cart");
const searchEl = document.getElementById("search");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
// Payment process
const proPaymentEl = document.querySelector("#process-payment");
const paymentPopup = document.getElementById("paymentPopup");
const closePayment = document.getElementById("closePayment");
const paymentTotal = document.getElementById("paymentTotal");
const payBtn = document.getElementById("payBtn");


async function loadMenu() {
    menuEl.innerHTML = `<div class="loading-msg">Loading menu from menu.json…</div>`;

    try {
        const response = await fetch("data/menu.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        state.dishes = data;
        render();

        console.log("✅ Menu loaded successfully!", state.dishes.length, "items");
    } catch (error) {
        console.error("Error loading menu:", error);
        menuEl.innerHTML = `
                    <div class="error-msg">
                        Could not load the menu.<br>
                        <small>Error: ${error.message}</small><br>
                        <small>Make sure you're running this on a server (not file:// protocol)</small>
                    </div>
                `;
    }
}

// ----- RENDER MAIN VIEW -----
function render() {
    const term = state.search.toLowerCase().trim();
    const shown = state.dishes.filter((d) =>
        d.name.toLowerCase().includes(term)
    );

    if (shown.length === 0) {
        menuEl.innerHTML =
            `<div style="grid-column:1/-1; padding:2rem; text-align:center; color:#6b7b8f;">No dishes match “${state.search}”</div>`;
    } else {
        menuEl.innerHTML = shown
            .map((d) => `
                            <article class="dish" data-id="${d.id}">                                    
                                <img src = "${d.image}" alt = "${d.name}" class="dish-img" aria-hidden="true">
                                <h3>${d.name}</h3>
                                <p class="category">${d.category}</p>
                                <p class="spicy ${d.spicy}">${d.spicy ? 'Spicy' : 'Not Spicy'}</p>
                                <p class="price">${d.price} ETB</p>
                                <button class="add" aria-label="Add ${d.name} to cart">Add to order</button>
                            </article>
                        `)
            .join("");
    }

    renderCart();
}

function renderCart() {
    const cart = state.cart;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<li class="empty-cart">Your cart is empty</li>`;
        cartTotalEl.textContent = "0 ETB";
        cartCountEl.textContent = "0";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
                        <li class="cart-item" data-id="${item.id}">
                            <span class="name">${item.name}</span>
                            <span class="qty-badge">×${item.qty}</span>
                            <span class="price-sm">${subtotal} ETB</span>
                            <button class="rm" aria-label="Remove ${item.name}">✕</button>
                        </li>
                    `;
    });

    cartItemsEl.innerHTML = html;
    cartTotalEl.textContent = `${total} ETB`;
    cartCountEl.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function save() {
    localStorage.setItem("addiseats", JSON.stringify(state.cart));
}

function loadCart() {
    const s = localStorage.getItem("addiseats");
    if (s) {
        try {
            state.cart = JSON.parse(s);
        } catch (_) {
            state.cart = [];
        }
    } else {
        state.cart = [];
    }
}
searchEl.addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
});


menuEl.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add");
    if (!addBtn) return;

    const dishEl = addBtn.closest(".dish");
    if (!dishEl) return;

    const id = Number(dishEl.dataset.id);
    const dish = state.dishes.find((d) => d.id === id);
    if (!dish) return;

    const line = state.cart.find((i) => i.id === id);
    if (line) {
        line.qty++;
    } else {
        state.cart.push({ ...dish, qty: 1 });
    }

    save();
    render();
});


cartEl.addEventListener("click", (e) => {
    const rmBtn = e.target.closest(".rm");
    if (!rmBtn) return;

    const li = rmBtn.closest(".cart-item");
    if (!li) return;

    const id = Number(li.dataset.id);
    state.cart = state.cart.filter((i) => i.id !== id);

    save();
    render();
});

proPaymentEl.addEventListener("click", (p) => {
    let processError = p.target.closest("#proError");
    const subtotal = state.cart.reduce(
        (total, item) => total + (item.price * item.qty), 0);

    if (subtotal === 0) {
        proPaymentEl.innerHTML = `
            <button class="pro">Process Payment</button>
            <p class="proError">
                Your cart is empty. Please order something.
            </p>
        `;
    } else {
        localStorage.setItem("paymentTotal", subtotal);
        window.location.href = "payment.html";
    }
});


async function init() {
    loadCart();
    await loadMenu();
}


init();