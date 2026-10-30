const newsletterForms = document.querySelectorAll("#newsletter form, .footer__newsletter form");

newsletterForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input[type='email']");
    if (!input || !input.value.trim()) return;

    const container = form.closest(".footer__newsletter") || form.parentElement;
    let messageElement = container.querySelector(".newsletter-message");

    if (!messageElement) {
      messageElement = document.createElement("p");
      messageElement.classList.add("newsletter-message");
      messageElement.setAttribute("role", "status");
      messageElement.setAttribute("aria-live", "polite");
      form.insertAdjacentElement("afterend", messageElement);
    }

    messageElement.textContent = "Thanks for signing up!";
    input.value = "";
  });
});