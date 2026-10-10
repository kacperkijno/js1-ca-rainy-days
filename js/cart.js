const CART_KEY = "rainy-days-cart";

export function getCart() {
  const cartData = localStorage.getItem(CART_KEY);
  if (!cartData) {
    return [];
  }
  return JSON.parse(cartData);
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  const finalPrice = product.onSale ? product.discountedPrice : product.price;

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
}

export function removeFromCart(id) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== id);
  saveCart(updatedCart);
  updateCartBadge();
}

export function changeQuantity(id, change) {
  const cart = getCart();
  const item = cart.find((product) => product.id === id);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart(cart);
  updateCartBadge();
}

export function getCartCount() {
  let count = 0;
  getCart().forEach((item) => {
    count += item.quantity;
  });
  return count;
}

export function getCartTotal() {
  let total = 0;
  getCart().forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
}

export function updateCartBadge() {
  const badgeElement = document.querySelector(".cart-badge");
  if (!badgeElement) {
    return;
  }
  badgeElement.textContent = getCartCount();
}