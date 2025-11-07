// form.js — Nervarah site form handler

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = "Submitting...";

    setTimeout(() => {
      alert("Thank you! Your submission has been received.");
      form.reset();
      btn.disabled = false;
      btn.textContent = "Submit";
    }, 1000);
  });
});
