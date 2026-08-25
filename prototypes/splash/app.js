const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const drawer = document.querySelector("#nav-drawer");
const form = document.querySelector("#demo-form");
const thanks = document.querySelector("#demo-thanks");

const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const setOpen = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "✕" : "☰";
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  drawer.hidden = !open;
  document.body.classList.toggle("nav-open", open);
};

toggle.addEventListener("click", () => {
  setOpen(toggle.getAttribute("aria-expanded") !== "true");
});

drawer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setOpen(false));
});

document.querySelectorAll("[data-scroll]").forEach((el) => {
  el.addEventListener("click", (event) => {
    const href = el.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const existing = JSON.parse(localStorage.getItem("advertdreams-demo") || "[]");
    existing.push({ ...data, at: new Date().toISOString() });
    localStorage.setItem("advertdreams-demo", JSON.stringify(existing));
  } catch {
    /* demo only */
  }
  form.hidden = true;
  thanks.hidden = false;
  thanks.focus();
});
