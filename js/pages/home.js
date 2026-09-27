import { getProducts } from "../api.js";
import { createProductCard } from "../render.js";

const productList = document.querySelector("#product-list");
const status = document.querySelector("#products-status");

function setupSlider(track) {
  const arrows = document.querySelectorAll(".bestsellers__arrows .arrow-btn");
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

async function initHomePage() {
  try {
    const products = await getProducts();

    if (products.length === 0) {
      status.textContent = "No jackets found.";
      return;
    }

    products.forEach((product) => {
      const card = createProductCard(product, "");
      productList.appendChild(card);
    });

    status.classList.add("is-hidden");
    setupSlider(productList);
  } catch (error) {
    status.textContent = "Sorry, we couldn't load the jackets. Please try again later.";
  }
}

initHomePage();
