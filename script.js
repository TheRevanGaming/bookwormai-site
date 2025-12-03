// === CONFIG ===

// Where the actual Book Worm Studio (app UI) lives:
const STUDIO_URL = "https://bookwormai-backend-t8uv.onrender.com/";

// LocalStorage keys
const LS_USERS_KEY = "bookworm_users";
const LS_CURRENT_USER_KEY = "bookworm_current_user";

// === UTILITIES ===

function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getUsers() {
  try {
    const raw = localStorage.getItem(LS_USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(LS_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(LS_CURRENT_USER_KEY);
  } else {
    localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user));
  }
  updateUserStatus();
}

function simpleHash(str) {
  // VERY basic hash for beta – not for production security.
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return String(hash);
}

// === DOM ELEMENTS ===

const loginBtn = document.getElementById("login-btn");
const launchBtn = document.getElementById("launch-btn");
const heroLaunchBtn = document.getElementById("hero-launch-btn");
const heroLoginBtn = document.getElementById("hero-login-btn");

const userStatus = document.getElementById("user-status");
const userEmailLabel = document.getElementById("user-email-label");

const yearEl = document.getElementById("year");

// Auth modal elements
const authModal = document.getElementById("auth-modal");
const authClose = document.getElementById("auth-close");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabSignup = document.getElementById("auth-tab-signup");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authPasswordConfirm = document.getElementById("auth-password-confirm");
const authConfirmWrapper = document.getElementById("auth-confirm-wrapper");
const authMessage = document.getElementById("auth-message");
const authSubmitBtn = document.getElementById("auth-submit-btn");

// === STATE ===

let authMode = "login"; // "login" or "signup"

// === INIT ===

// This should log in the browser DevTools console.
// And we’ll update the label so you see it visually.
console.log("Book Worm marketing script.js loaded ✅");

if (userEmailLabel) {
  userEmailLabel.textContent = "Guest (JS OK)";
}

// Run setup once DOM is fully parsed
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded ✅");

  // Set year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Navigation scroll buttons
  document.querySelectorAll(".nav-link[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll-to");
      if (target) smoothScrollTo(target);
    });
  });

  // Launch buttons
  if (launchBtn) {
    launchBtn.addEventListener("click", () => {
      console.log("Launch Studio clicked");
      window.open(STUDIO_URL, "_blank");
    });
  }
  if (heroLaunchBtn) {
    heroLaunchBtn.addEventListener("click", () => {
      console.log("Hero Launch Studio clicked");
      window.open(STUDIO_URL, "_blank");
    });
  }

  // Login buttons
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      console.log("Login clicked");
      openAuthModal("login");
    });
  }
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener("click", () => {
      console.log("Hero Login clicked");
      openAuthModal("signup");
    });
  }

  // Close modal
  if (authClose) {
    authClose.addEventListener("click", () => {
      closeAuthModal();
    });
  }

  // Click on backdrop closes modal
  const backdrop = document.querySelector(".auth-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closeAuthModal();
    });
  }

  // Tabs
  if (authTabLogin) {
    authTabLogin.addEventListener("click", () => {
      switchAuthMode("login");
    });
  }
  if (authTabSignup) {
    authTabSignup.addEventListener("click", () => {
      switchAuthMode("signup");
    });
  }

  // Form submit
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAuthSubmit();
    });
  }

  // Initialize user status
  updateUserStatus();
});

// === AUTH MODAL LOGIC ===

function openAuthModal(mode) {
  switchAuthMode(mode || "login");
  authMessage.textContent = "";
  authEmail.value = "";
  authPassword.value = "";
  if (authPasswordConfirm) authPasswordConfirm.value = "";
  authModal.classList.remove("hidden");
}

function closeAuthModal() {
  authModal.classList.add("hidden");
}

function switchAuthMode(mode) {
  authMode = mode;
  if (mode === "login") {
    authTitle.textContent = "Log In";
    authTabLogin.classList.add("active");
    authTabSignup.classList.remove("active");
    authConfirmWrapper.classList.add("hidden");
    authSubmitBtn.textContent = "Log In";
  } else {
    authTitle.textContent = "Create Account";
    authTabSignup.classList.add("active");
    authTabLogin.classList.remove("active");
    authConfirmWrapper.classList.remove("hidden");
    authSubmitBtn.textContent = "Sign Up";
  }
  authMessage.textContent = "";
}

// === AUTH SUBMIT HANDLERS ===

function handleAuthSubmit() {
  const email = (authEmail.value || "").trim().toLowerCase();
  const pass = authPassword.value || "";
  const passConfirm = authPasswordConfirm ? authPasswordConfirm.value || "" : "";

  authMessage.textContent = "";
  authMessage.style.color = "#f97316"; // orange by default

  if (!email || !pass) {
    authMessage.textContent = "Please fill in email and password.";
    return;
  }

  if (authMode === "signup") {
    if (pass.length < 4) {
      authMessage.textContent = "Password should be at least 4 characters (beta).";
      return;
    }
    if (pass !== passConfirm) {
      authMessage.textContent = "Passwords do not match.";
      return;
    }
    const users = getUsers();
    if (users[email]) {
      authMessage.textContent = "An account with this email already exists.";
      return;
    }

    const passwordHash = simpleHash(pass);
    users[email] = {
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      plan: "free"
    };
    saveUsers(users);

    setCurrentUser({ email, plan: "free" });
    authMessage.style.color = "#22c55e";
    authMessage.textContent = "Account created. You are now logged in.";
    setTimeout(() => {
      closeAuthModal();
    }, 900);
  } else {
    // login
    const users = getUsers();
    const user = users[email];
    if (!user) {
      authMessage.textContent = "No account found with that email.";
      return;
    }
    const passwordHash = simpleHash(pass);
    if (passwordHash !== user.passwordHash) {
      authMessage.textContent = "Incorrect password.";
      return;
    }

    setCurrentUser({ email, plan: user.plan || "free" });
    authMessage.style.color = "#22c55e";
    authMessage.textContent = "Logged in successfully.";
    setTimeout(() => {
      closeAuthModal();
    }, 800);
  }
}

// === USER STATUS DISPLAY ===

function updateUserStatus() {
  const user = getCurrentUser();
  if (!user) {
    if (userEmailLabel) {
      // show JS is running even if logged out
      userEmailLabel.textContent = "Guest (JS OK)";
    }
    return;
  }
  if (userEmailLabel) {
    userEmailLabel.textContent = user.email;
  }
}
