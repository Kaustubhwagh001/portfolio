// assets/js/form.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending...";

    const formData = new FormData(form);

    try {
      // submit directly to Google Form's "formResponse" endpoint
      await fetch("https://docs.google.com/forms/d/e/1FAIpQLSf2EpEZ7XrNrLWgJHZnWLdaTCoyW6kokUyfE0iVSA6eCkJQ_w/formResponse", {
        method: "POST",
        body: formData,
        mode: "no-cors"
      });

      status.textContent = "✅ Message sent successfully!";
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "❌ Failed to send. Please try again later.";
    }
  });
});
