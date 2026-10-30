import { addToCart } from "./cart.js";

export function createProductCard(product, basePath) {
  const productUrl = `${basePath}product/index.html?id=${product.id}`;

  const card = document.createElement("article");
  card.classList.add("product-card");

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("product-card__image-wrapper");

  const imageLink = document.createElement("a");
  imageLink.href = productUrl;

  const image = document.createElement("img");
  image.src = product.image.url;
  image.alt = product.image.alt;
  image.classList.add("product-card__image");

  imageLink.appendChild(image);
  imageWrapper.appendChild(imageLink);

  if (product.onSale) {
    const badge = document.createElement("span");
    badge.classList.add("product-card__badge");
    badge.textContent = "Sale";
    imageWrapper.appendChild(badge);
  }

  card.appendChild(imageWrapper);

  const body = document.createElement("div");
  body.classList.add("product-card__body");

  const row = document.createElement("div");
  row.classList.add("product-card__row");

  const title = document.createElement("h3");
  title.classList.add("product-card__title");

  const titleLink = document.createElement("a");
  titleLink.href = productUrl;
  titleLink.classList.add("product-card__link");
  titleLink.textContent = product.title;

  title.appendChild(titleLink);
  row.appendChild(title);

  const price = document.createElement("p");
  price.classList.add("price");

  const currentPrice = document.createElement("span");
  currentPrice.classList.add("price__current");
  price.appendChild(currentPrice);

  if (product.onSale) {
    currentPrice.textContent = `$${product.discountedPrice.toFixed(2)}`;
    price.classList.add("price--sale");

    const oldPrice = document.createElement("s");
    oldPrice.classList.add("price__old");
    oldPrice.textContent = `$${product.price.toFixed(2)}`;
    price.appendChild(oldPrice);
  } else {
    currentPrice.textContent = `$${product.price.toFixed(2)}`;
  }

  row.appendChild(price);
  body.appendChild(row);

  const category = document.createElement("p");
  category.classList.add("product-card__category");

  if (product.gender === "Female") {
    category.textContent = "Women's jacket";
  } else {
    category.textContent = "Men's jacket";
  }

  body.appendChild(category);

  const actions = document.createElement("div");
  actions.classList.add("product-card__actions");

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.classList.add("btn", "btn--sm", "btn--accent", "add-to-cart");
  addButton.textContent = "Add to cart";
  addButton.dataset.id = product.id;

  actions.appendChild(addButton);
  body.appendChild(actions);
  card.appendChild(body);

  return card;
}

export function setupAddToCart(products, statusElement = null) {
  const popover = document.querySelector("#size-popover");
  const popoverList = document.querySelector("#size-popover-list");
  const productList = document.querySelector("#product-list");

  if (!popover || !popoverList || !productList) {
    return;
  }

  productList.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-cart");
    if (!button) {
      return;
    }

    const productId = button.dataset.id;
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return;
    }

    popoverList.innerHTML = "";

    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size) => {
        const sizeBtn = document.createElement("button");
        sizeBtn.type = "button";
        sizeBtn.classList.add("size-popover__btn");
        sizeBtn.textContent = size;
        sizeBtn.dataset.id = product.id;
        sizeBtn.dataset.size = size;
        popoverList.appendChild(sizeBtn);
      });
    }

    if (typeof popover.showPopover === "function") {
      popover.showPopover();
    }
  });

  popoverList.addEventListener("click", (event) => {
    const sizeBtn = event.target.closest(".size-popover__btn");
    if (!sizeBtn) {
      return;
    }

    const productId = sizeBtn.dataset.id;
    const size = sizeBtn.dataset.size;
    const product = products.find((p) => p.id === productId);

    if (product) {
      addToCart(product, size);

      if (typeof popover.hidePopover === "function") {
        popover.hidePopover();
      }

      if (statusElement) {
        statusElement.textContent = `Added ${product.title} (Size: ${size}) to your cart!`;
        statusElement.classList.remove("is-hidden");
        setTimeout(() => {
          statusElement.classList.add("is-hidden");
        }, 3000);
      }
    }
  });
}
