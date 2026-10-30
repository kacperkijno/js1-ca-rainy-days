import {
  getCart,
  removeFromCart,
  changeQuantity,
  getCartTotal,
  updateCartBadge,
  clearCart
} from "../cart.js";

const cartList = document.querySelector("#cart-list");
const subtotalElement = document.querySelector("#cart-subtotal");
const shippingElement = document.querySelector("#cart-shipping");
const vatElement = document.querySelector("#cart-vat");
const totalElement = document.querySelector("#cart-total");
const statusElement = document.querySelector("#cart-status");
const submitButtons = document.querySelectorAll("main button[type='submit']");
const shippingInputs = document.querySelectorAll("input[name='shipping']");

updateCartBadge();

function renderCart() {
  const cart = getCart();
  cartList.innerHTML = "";

  if (cart.length === 0) {
    statusElement.textContent = "Your cart is empty. ";
    const link = document.createElement("a");
    link.href = "../index.html#products";
    link.textContent = "Explore our jackets";
    link.classList.add("text-link");
    statusElement.appendChild(link);
    statusElement.classList.remove("is-hidden");

    subtotalElement.textContent = "$0.00";
    if (shippingElement) shippingElement.textContent = "$0.00";
    vatElement.textContent = "$0.00";
    totalElement.textContent = "$0.00";
    
    submitButtons.forEach((button) => {
      button.disabled = true;
    });

    updateCartBadge();
    return;
  }

  statusElement.classList.add("is-hidden");
  submitButtons.forEach((button) => {
    button.disabled = false;
  });

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    const img = document.createElement("img");
    img.src = item.image.url;
    img.alt = item.image.alt;
    img.classList.add("cart-item__image");
    img.width = 992;
    img.height = 1056;

    const bodyDiv = document.createElement("div");
    bodyDiv.classList.add("cart-item__body");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("cart-item__header");

    const h3 = document.createElement("h3");
    h3.classList.add("cart-item__title");
    h3.textContent = item.title;

    const sizeP = document.createElement("p");
    sizeP.classList.add("cart-item__size");
    sizeP.textContent = `Size: ${item.size}`;

    const priceP = document.createElement("p");
    priceP.classList.add("cart-item__price");
    const itemTotal = item.price * item.quantity;
    priceP.textContent = `$${itemTotal.toFixed(2)}`;

    headerDiv.appendChild(h3);
    headerDiv.appendChild(sizeP);
    headerDiv.appendChild(priceP);

    const footerDiv = document.createElement("div");
    footerDiv.classList.add("cart-item__footer");

    const quantityGroup = document.createElement("div");
    quantityGroup.classList.add("quantity");
    quantityGroup.setAttribute("role", "group");
    quantityGroup.setAttribute("aria-label", `Quantity of ${item.title}`);

    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.classList.add("quantity__btn");
    minusBtn.setAttribute("aria-label", "Decrease quantity");
    minusBtn.dataset.id = item.cartItemId;
    minusBtn.dataset.change = "-1";

    const minusSpan = document.createElement("span");
    minusSpan.classList.add("icon", "icon--minus", "icon--sm");
    minusSpan.setAttribute("aria-hidden", "true");
    minusBtn.appendChild(minusSpan);

    const output = document.createElement("output");
    output.classList.add("quantity__value");
    output.textContent = item.quantity;

    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.classList.add("quantity__btn");
    plusBtn.setAttribute("aria-label", "Increase quantity");
    plusBtn.dataset.id = item.cartItemId;
    plusBtn.dataset.change = "1";

    const plusSpan = document.createElement("span");
    plusSpan.classList.add("icon", "icon--plus", "icon--sm");
    plusSpan.setAttribute("aria-hidden", "true");
    plusBtn.appendChild(plusSpan);

    quantityGroup.appendChild(minusBtn);
    quantityGroup.appendChild(output);
    quantityGroup.appendChild(plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("cart-item__remove");
    removeBtn.setAttribute("aria-label", `Remove ${item.title} from cart`);
    removeBtn.dataset.id = item.cartItemId;

    const removeSpan = document.createElement("span");
    removeSpan.classList.add("icon", "icon--trash", "icon--sm");
    removeSpan.setAttribute("aria-hidden", "true");
    removeBtn.appendChild(removeSpan);

    footerDiv.appendChild(quantityGroup);
    footerDiv.appendChild(removeBtn);

    bodyDiv.appendChild(headerDiv);
    bodyDiv.appendChild(footerDiv);

    li.appendChild(img);
    li.appendChild(bodyDiv);

    cartList.appendChild(li);
  });

  updateTotals();
  updateCartBadge();
}

function updateTotals() {
  const subtotal = getCartTotal();
  
  const selectedShippingInput = document.querySelector("input[name='shipping']:checked");
  let shippingCost = 0;
  if (selectedShippingInput && selectedShippingInput.value === "express") {
    shippingCost = 15;
  }

  const vat = subtotal * 0.2;
  const total = subtotal + shippingCost;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (shippingElement) {
    shippingElement.textContent = shippingCost === 0 ? "$0.00" : `$${shippingCost.toFixed(2)}`;
  }
  vatElement.textContent = `$${vat.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

cartList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".cart-item__remove");
  if (removeButton) {
    const id = removeButton.dataset.id;
    removeFromCart(id);
    renderCart();
    return;
  }

  const quantityButton = event.target.closest(".quantity__btn");
  if (quantityButton) {
    const id = quantityButton.dataset.id;
    const change = Number(quantityButton.dataset.change);
    changeQuantity(id, change);
    renderCart();
  }
});

shippingInputs.forEach((input) => {
  input.addEventListener("change", () => {
    updateTotals();
  });
});

renderCart();

// --- OBSŁUGA PŁATNOŚCI I UKRYWANIA PÓL KARTY ---
const paymentInputs = document.querySelectorAll("input[name='payment']");
const cardFieldsContainer = document.querySelector("#card-fields-container");
const cardInputs = cardFieldsContainer ? cardFieldsContainer.querySelectorAll("input") : [];

function handlePaymentChange() {
  const selectedPayment = document.querySelector("input[name='payment']:checked");
  
  if (selectedPayment && selectedPayment.value === "card") {
    if (cardFieldsContainer) {
      cardFieldsContainer.classList.remove("is-hidden");
    }
    cardInputs.forEach(input => {
      input.setAttribute("required", "required");
    });
  } else {
    if (cardFieldsContainer) {
      cardFieldsContainer.classList.add("is-hidden");
    }
    cardInputs.forEach(input => {
      input.removeAttribute("required");
      input.value = ""; 
    });
  }
}

paymentInputs.forEach((input) => {
  input.addEventListener("change", handlePaymentChange);
});

handlePaymentChange();

const checkoutForm = document.querySelector("#checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedPayment = document.querySelector("input[name='payment']:checked");
    
    if (selectedPayment && selectedPayment.value === "card") {
      const expiryInput = document.querySelector("#card-expiry");
      if (expiryInput && expiryInput.value) {
        const [monthStr, yearStr] = expiryInput.value.split("/");
        const month = parseInt(monthStr, 10);
        const year = parseInt("20" + yearStr, 10);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          if (statusElement) {
            statusElement.textContent = "The card expiry date is in the past. Please enter a valid expiry date.";
            statusElement.classList.remove("is-hidden");
            statusElement.scrollIntoView({ behavior: "smooth" });
          }
          expiryInput.focus();
          return; 
        }
      }
    }

    const randomOrderNumber = `RD-${Math.floor(100000 + Math.random() * 900000)}`;
    localStorage.setItem("lastOrderNumber", randomOrderNumber);

    clearCart();
    
    window.location.href = "confirmation/index.html";
  });
}