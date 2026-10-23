const CART_KEY = "rainy-days-cart";

export function getCart() {
  const cartData = localStorage.getItem(CART_KEY);
  if (!cartData) {
    return [];
  }
  try {
    const cart = JSON.parse(cartData);
    return cart.map((item) => ({
      ...item,
      cartItemId: item.cartItemId || `${item.id}-${item.size || "M"}`,
      size: item.size || "M"
    }));
  } catch (error) {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, size = "M", quantity = 1) {
  const cart = getCart();
  
  const cartItemId = `${product.id}-${size}`;
  const finalPrice = product.onSale ? product.discountedPrice : product.price;

  const existingProduct = cart.find((item) => item.cartItemId === cartItemId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      cartItemId: cartItemId,
      id: product.id,
      title: product.title,
      price: finalPrice,
      image: product.image,
      size: size,
      quantity: quantity
    });
  }

  saveCart(cart);
  updateCartBadge();
}

export function removeFromCart(cartItemId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
  saveCart(updatedCart);
  updateCartBadge();
}

export function changeQuantity(cartItemId, change) {
  const cart = getCart();
  const item = cart.find((product) => product.cartItemId === cartItemId);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  saveCart(cart);
  updateCartBadge();
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

export function getCartCount() {
  const cart = getCart();
  let totalCount = 0;
  cart.forEach((item) => {
    totalCount += item.quantity;
  });
  return totalCount;
}

export function getCartTotal() {
  const cart = getCart();
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
}

export function updateCartBadge() {
  const badgeElement = document.querySelector(".cart-badge");
  const screenReaderText = document.querySelector(".cart-link .visually-hidden");
  
  const count = getCartCount();

  if (badgeElement) {
    badgeElement.textContent = count;
  }
  if (screenReaderText) {
    screenReaderText.textContent = `(${count} items)`;
  }
}