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

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.classList.add("btn", "btn--sm", "add-to-cart");
  addButton.textContent = "Add to cart";
  addButton.dataset.id = product.id;

  body.appendChild(addButton);
  card.appendChild(body);

  return card;
}
