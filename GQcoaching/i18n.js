let translations = {};
let currentLang = "en";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

async function loadTranslations() {
  const res = await fetch("translations.json");
  translations = await res.json();
}

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = getNestedValue(dict, key);
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const value = getNestedValue(dict, key);
    if (value) el.placeholder = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.dataset.i18nHtml;
    const value = getNestedValue(dict, key);
    if (value) el.innerHTML = value;
  });

  localStorage.setItem("gq-lang", lang);
  currentLang = lang;
}

function setLanguage(lang) {
  if (!translations[lang]) lang = "en";
  applyTranslations(lang);
  updateLangUI(lang);
}

function updateLangUI(lang) {
  document.querySelectorAll("[data-lang]").forEach(el => {
    el.classList.toggle("active", el.dataset.lang === lang);
  });
}

function initLanguage() {
  const saved = localStorage.getItem("gq-lang");
  const browser = navigator.language.slice(0,2);

  if (saved && translations[saved]) return saved;
  if (translations[browser]) return browser;

  return "en";
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadTranslations();

  const lang = initLanguage();
  setLanguage(lang);

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });
});