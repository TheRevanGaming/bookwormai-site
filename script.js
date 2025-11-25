// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    if (mainNav && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
    }
  });
});

// Dynamic year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// Waitlist button behavior (you can swap this with a Stripe link later)
const creatorBtn = document.getElementById("creatorPlanBtn");
if (creatorBtn) {
  creatorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "mailto:youremail@example.com?subject=Book%20Worm%20AI%20Creator%20Tier%20Waitlist&body=Tell%20me%20a%20bit%20about%20your%20worlds%2C%20projects%2C%20and%20how%20you%27d%20like%20to%20use%20Book%20Worm%20AI.";
  });
}
