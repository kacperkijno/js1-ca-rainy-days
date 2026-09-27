export const API_URL = "https://v2.api.noroff.dev/rainy-days";

export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const result = await response.json();
  const products = result.data;

  return products;
}

