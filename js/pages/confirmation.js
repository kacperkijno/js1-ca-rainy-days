import { updateCartBadge } from "../cart.js";
import "../newsletter.js";

updateCartBadge();

const confirmationSection = document.querySelector("#confirmation-section");
const orderNumberElement = document.querySelector(".confirmation__order-number");
const savedOrderNumber = localStorage.getItem("lastOrderNumber");

if (confirmationSection) {
  if (savedOrderNumber) {
    if (orderNumberElement) {
      orderNumberElement.textContent = savedOrderNumber;
    }
    localStorage.removeItem("lastOrderNumber");
  } else {
    confirmationSection.innerHTML = `
      <span class="icon icon--alert-circle confirmation__icon" aria-hidden="true"></span>
      <p class="eyebrow">Notice</p>
      <h1>No recent order found</h1>
      <p>It looks like you haven't placed an order or your session has expired.</p>
      <div class="confirmation__actions">
        <a href="../../index.html" class="btn btn--accent btn--lg">
          <span class="icon icon--arrow-up-right" aria-hidden="true"></span>
          Back to shop
        </a>
      </div>
    `;
  }
}
