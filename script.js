const phrases = {
  ru: [
    "frontendDeveloper & sacerdos",
    "создаю вещи в тишине",
    "ТГК: @d03lr",
    "frontendDeveloper"
  ],
  en: [
    "frontendDeveloper & sacerdos",
    "creating things in silence",
    "TGK: @d03lr",
    "frontendDeveloper"
  ]
};

let lang = localStorage.getItem("ynubo-lang") || "ru";
let index = 0, timer;

const typed = document.querySelector("#typed");
const langBtn = document.querySelector("#lang");
const themeBtn = document.querySelector("#theme");

function currentText(){
  return phrases[lang][index];
}

function typeLoop(){
  clearTimeout(timer);
  const text = currentText();
  let pos = 0;
  typed.textContent = "";

  const type = () => {
    if(pos < text.length){
      typed.textContent += text[pos++];
      timer = setTimeout(type, 62);
    }else{
      timer = setTimeout(erase, 1450);
    }
  };

  const erase = () => {
    if(typed.textContent.length){
      typed.textContent = typed.textContent.slice(0,-1);
      timer = setTimeout(erase, 30);
    }else{
      index = (index + 1) % phrases[lang].length;
      timer = setTimeout(typeLoop, 240);
    }
  };

  type();
}

function applyLang(){
  document.documentElement.lang = lang;
  langBtn.textContent = lang.toUpperCase();

  document.querySelectorAll("[data-ru]").forEach(el => {
    const value = el.dataset[lang];
    if(value) el.textContent = value;
  });

  index = 0;
  typeLoop();
  localStorage.setItem("ynubo-lang", lang);
}

langBtn.addEventListener("click", () => {
  lang = lang === "ru" ? "en" : "ru";
  applyLang();
});

function setThemeIcon(){
  const light = document.body.classList.contains("light");
  themeBtn.innerHTML = light
    ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M21 14.8A8.5 8.5 0 0 1 9.2 3 8.5 8.5 0 1 0 21 14.8Z"/></svg>';
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("ynubo-theme", document.body.classList.contains("light") ? "light" : "dark");
  setThemeIcon();
});

if(localStorage.getItem("ynubo-theme") === "light") document.body.classList.add("light");
setThemeIcon();
applyLang();

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add("visible");
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach(e => observer.observe(e));

document.querySelectorAll(".copy").forEach(button => {
  button.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(button.dataset.copy);
      const old = button.innerHTML;
      button.innerHTML = "✓";
      setTimeout(() => button.innerHTML = old, 1000);
    }catch{}
  });
});

/* Very subtle parallax matching the floating photo feeling. */
const photo = document.querySelector(".hero-photo");
window.addEventListener("pointermove", e => {
  if(innerWidth <= 650) return;
  const x = (e.clientX / innerWidth - .5) * 2;
  const y = (e.clientY / innerHeight - .5) * 2;
  photo.style.marginLeft = `${x * 3}px`;
  photo.style.filter = `drop-shadow(${x * 5}px ${-y * 5}px 25px rgba(0,0,0,.15))`;
});
