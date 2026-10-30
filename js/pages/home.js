import { getProducts } from "../api.js";
import { createProductCard, setupAddToCart } from "../render.js";
import { updateCartBadge } from "../cart.js";
import "../newsletter.js";

const productList = document.querySelector("#product-list");
const status = document.querySelector("#products-status");

updateCartBadge();

function setupSlider(track) {
  const arrows = document.querySelectorAll(".bestsellers__arrows .arrow-btn");
  if (!arrows.length) return;
  const prevButton = arrows[0];
  const nextButton = arrows[1];

  function updateButtons() {
    const atStart = track.scrollLeft <= 0;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

    prevButton.disabled = atStart;
    nextButton.disabled = atEnd;
  }

  nextButton.addEventListener("click", () => {
    const card = track.firstElementChild;
    if (!card) return;
    track.scrollBy({ left: card.offsetWidth, behavior: "smooth" });
  });

  prevButton.addEventListener("click", () => {
    const card = track.firstElementChild;
    if (!card) return;
    track.scrollBy({ left: -card.offsetWidth, behavior: "smooth" });
  });

  track.addEventListener("scroll", updateButtons);
  updateButtons();
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((product) => {
    const card = createProductCard(product, "");
    productList.appendChild(card);
  });
}

function setupFilter(products) {
  const chipList = document.querySelector(".chip-list");
  if (!chipList) return;
  const chips = document.querySelectorAll(".chip");

  chipList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("chip")) {
      return;
    }

    chips.forEach((chip) => {
      chip.setAttribute("aria-pressed", "false");
    });
    event.target.setAttribute("aria-pressed", "true");

    const gender = event.target.dataset.gender;

    if (gender) {
      const filteredProducts = products.filter((product) => product.gender === gender);
      renderProducts(filteredProducts);
    } else {
      renderProducts(products);
    }
  });
}

async function initHomePage() {
  try {
    const products = await getProducts();

    if (products.length === 0) {
      status.textContent = "No jackets found.";
      return;
    }

    renderProducts(products);
    status.classList.add("is-hidden");
    setupSlider(productList);
    setupFilter(products);
    
    setupAddToCart(products, status);
  } catch (error) {
    status.textContent = "Sorry, we couldn't load the jackets. Please try again later.";
  }
}

initHomePage();