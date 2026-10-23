import { getProduct } from "../api.js";
import { addToCart, updateCartBadge } from "../cart.js";

const titleElement = document.querySelector(".product__title");
const currentPriceElement = document.querySelector(".price__current");
const oldPriceElement = document.querySelector(".price__old");
const priceContainer = document.querySelector(".product__price");
const imageElement = document.querySelector(".product__image");
const eyebrowElement = document.querySelector(".product__header .eyebrow");
const colorElement = document.querySelector(".product__color");
const descriptionElement = document.querySelector(".product-tabs__panel--description p");
const sizePickerContainer = document.querySelector(".size-picker");
const breadcrumbCurrent = document.querySelector('.breadcrumbs__item[aria-current="page"]');
const breadcrumbParent = document.querySelector('.breadcrumbs__item:not([aria-current="page"]) a');
const statusElement = document.querySelector("#product-status");
const decreaseBtn = document.querySelector('.quantity__btn[aria-label="Decrease quantity"]');
const increaseBtn = document.querySelector('.quantity__btn[aria-label="Increase quantity"]');
const quantityOutput = document.querySelector(".quantity__value");

let quantity = 1;

if (decreaseBtn && increaseBtn && quantityOutput) {
  decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityOutput.textContent = quantity;
    }
  });

  increaseBtn.addEventListener("click", () => {
    quantity++;
    quantityOutput.textContent = quantity;
  });
}

const id = new URLSearchParams(location.search).get("id");

updateCartBadge();

async function initProductPage() {
  if (!id) {
    statusElement.textContent = "No product ID provided.";
    statusElement.classList.remove("is-hidden");
    return;
  }

  statusElement.textContent = "Loading product...";
  statusElement.classList.remove("is-hidden");

  try {
    const product = await getProduct(id);

    titleElement.textContent = product.title;
    breadcrumbCurrent.textContent = product.title;
    document.title = `${product.title} | Rainy Days`;

    imageElement.src = product.image.url;
    imageElement.alt = product.image.alt;

    descriptionElement.textContent = product.description;
    colorElement.textContent = product.baseColor;

    if (product.gender === "Female") {
      eyebrowElement.textContent = "Women’s jacket";
      if (breadcrumbParent) {
        breadcrumbParent.textContent = "Women’s jackets";
        breadcrumbParent.href = "../category/womens.html";
      }
    } else {
      eyebrowElement.textContent = "Men’s jacket";
      if (breadcrumbParent) {
        breadcrumbParent.textContent = "Men’s jackets";
        breadcrumbParent.href = "../category/mens.html";
      }
    }

    if (product.onSale) {
      currentPriceElement.textContent = `$${product.discountedPrice.toFixed(2)}`;
      oldPriceElement.textContent = `$${product.price.toFixed(2)}`;
      priceContainer.classList.add("price--sale");
      oldPriceElement.classList.remove("is-hidden");
    } else {
      currentPriceElement.textContent = `$${product.price.toFixed(2)}`;
      priceContainer.classList.remove("price--sale");
      oldPriceElement.classList.add("is-hidden");
    }

    sizePickerContainer.innerHTML = "";
    product.sizes.forEach((size) => {
      const label = document.createElement("label");
      label.classList.add("size-picker__option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "size";
      input.value = size;
      input.classList.add("size-picker__input");

      const span = document.createElement("span");
      span.textContent = size;
      span.classList.add("size-picker__label");

      label.appendChild(input);
      label.appendChild(span);
      sizePickerContainer.appendChild(label);
    });

    const productForm = document.querySelector(".product__form");
    if (productForm) {
      productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedSizeInput = document.querySelector('input[name="size"]:checked');

        if (!selectedSizeInput) {
          statusElement.textContent = "Please select a size before adding to cart.";
          statusElement.classList.remove("is-hidden");
          return;
        }

        const selectedSize = selectedSizeInput.value;

        addToCart(product, selectedSize, quantity);

        statusElement.textContent = `Added ${quantity} x ${product.title} (Size: ${selectedSize}) to your cart!`;
        statusElement.classList.remove("is-hidden");

        setTimeout(() => {
          statusElement.classList.add("is-hidden");
        }, 3000);
      });
    }

    statusElement.classList.add("is-hidden");
  } catch (error) {
    statusElement.textContent = "Sorry, we couldn’t load this jacket.";
    statusElement.classList.remove("is-hidden");
  }
}

initProductPage();