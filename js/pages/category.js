import { getProducts } from "../api.js";
import { createProductCard, setupAddToCart } from "../render.js";
import { updateCartBadge } from "../cart.js";
import "../newsletter.js";

const productList = document.querySelector("#product-list");
const statusElement = document.querySelector("#products-status");
const filtersForm = document.querySelector(".filters__form");
const sortSelect = document.querySelector("#sort");

let allProducts = [];
let currentGender = productList ? productList.dataset.gender : "";

updateCartBadge();

async function initCategoryPage() {
  if (!productList) {
    return;
  }

  statusElement.textContent = "Loading jackets...";
  statusElement.classList.remove("is-hidden");

  try {
    const products = await getProducts();

    allProducts = products.filter((p) => p.gender === currentGender);

    statusElement.classList.add("is-hidden");

    if (allProducts.length === 0) {
      statusElement.textContent = "No jackets found in this category.";
      statusElement.classList.remove("is-hidden");
      return;
    }

    setupAddToCart(allProducts, statusElement);

    renderProducts(allProducts);

    if (filtersForm) {
      filtersForm.addEventListener("submit", (event) => {
        event.preventDefault();
        applyFiltersAndSort();
      });

      filtersForm.addEventListener("reset", () => {
        setTimeout(() => {
          renderProducts(allProducts);
          if (sortSelect) {
            sortSelect.value = "featured";
          }
        }, 0);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        applyFiltersAndSort();
      });
    }
  } catch (error) {
    statusElement.textContent = "Could not load jackets. Please try again later.";
    statusElement.classList.remove("is-hidden");
  }
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    statusElement.textContent = "No jackets match your filters.";
    statusElement.classList.remove("is-hidden");
    return;
  }

  statusElement.classList.add("is-hidden");

  products.forEach((product) => {
    const card = createProductCard(product, "../");
    productList.appendChild(card);
  });
}

function applyFiltersAndSort() {
  const checkedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(
    (input) => input.value,
  );

  const onSaleCheckbox = document.querySelector('input[name="onSale"]');
  const isOnSaleOnly = onSaleCheckbox ? onSaleCheckbox.checked : false;

  let filtered = allProducts.filter((product) => {
    const matchesColor = checkedColors.length === 0 || checkedColors.includes(product.baseColor);
    const matchesSale = !isOnSaleOnly || product.onSale === true;

    return matchesColor && matchesSale;
  });

  if (sortSelect) {
    const sortValue = sortSelect.value;
    filtered = [...filtered].sort((a, b) => {
      if (sortValue === "price-asc") {
        const priceA = a.onSale ? a.discountedPrice : a.price;
        const priceB = b.onSale ? b.discountedPrice : b.price;
        return priceA - priceB;
      }
      if (sortValue === "price-desc") {
        const priceA = a.onSale ? a.discountedPrice : a.price;
        const priceB = b.onSale ? b.discountedPrice : b.price;
        return priceB - priceA;
      }
      if (sortValue === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  renderProducts(filtered);
}

initCategoryPage();
