import { getProducts } from "../api.js";
import { createProductCard, setupAddToCart } from "../render.js";
import { updateCartBadge } from "../cart.js";

const productList = document.querySelector("#product-list");
const status = document.querySelector("#products-status");

updateCartBadge();

async function initCategoryPage() {
  const gender = productList.dataset.gender;

  try {
    const products = await getProducts();
    const filteredProducts = products.filter((product) => product.gender === gender);

    if (filteredProducts.length === 0) {
      status.textContent = "No jackets found in this category.";
      return;
    }

    filteredProducts.forEach((product) => {
      const card = createProductCard(product, "../");
      productList.appendChild(card);
    });

    status.classList.add("is-hidden");
    
    setupAddToCart(filteredProducts, status);
  } catch (error) {
    status.textContent = "Sorry, we couldn't load the jackets. Please try again later.";
  }
}

initCategoryPage();