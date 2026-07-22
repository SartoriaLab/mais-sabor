// ===== Casa de Carnes Mais Sabor - Scripts compartilhados =====

window.businessInfoData = {
  "name": "Casa de Carnes Mais Sabor",
  "slogan": "Da nossa casa pra sua mesa",
  "phone": "(16) 99634-4348",
  "whatsappNumber": "5516996344348",
  "whatsappMensagemPadrao": "Ola, vim pelo site e quero fazer um pedido.",
  "address": "Rua Felippe Abbud, 244",
  "neighborhood": "Vila São Sebastião",
  "cityState": "Taquaritinga - SP",
  "cep": "15903-100",
  "hours": {
    "texto": "Seg a Sáb das 7h às 19h · Domingos das 7h às 12h",
    "semana": "Seg a Sáb: 7h às 19h",
    "domingo": "Domingos: 7h às 12h"
  },
  "instagram": "https://www.instagram.com/casadecarnes.maissabor/",
  "instagramHandle": "@casadecarnes.maissabor",
  "googleMapsEmbed": "https://www.google.com/maps?q=Rua+Felippe+Abbud,+244+-+Vila+Sao+Sebastiao,+Taquaritinga+-+SP,+15903-100&output=embed",
  "googleMapsLink": "https://www.google.com/maps/search/?api=1&query=Rua+Felippe+Abbud,+244+-+Vila+Sao+Sebastiao,+Taquaritinga+-+SP,+15903-100"
};

const header = document.querySelector(".header");
const mobileToggle = document.getElementById("mobileToggle");
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (!header) return;
  if (window.scrollY > 8) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

if (mobileToggle && nav) {
  mobileToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const id = anchor.getAttribute("href");
    if (id === "#") return;
    const section = document.querySelector(id);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const yearNode = document.getElementById("current-year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

// ===== STATUS ABERTO / FECHADO =====
// Horário: Seg-Sáb 7h-19h · Dom 7h-12h
function atualizarStatusAbertura() {
  const pill = document.getElementById("statusPill");
  if (!pill) return;
  const textEl = pill.querySelector(".status-text");

  const agora = new Date();
  const dia = agora.getDay(); // 0 = domingo, 6 = sábado
  const hora = agora.getHours() + agora.getMinutes() / 60;

  let aberto = false;
  let proximoAbre = "";

  if (dia === 0) {
    aberto = hora >= 7 && hora < 12;
    proximoAbre = aberto ? "" : hora < 7 ? "Abre às 7h" : "Abre amanhã às 7h";
  } else {
    aberto = hora >= 7 && hora < 19;
    proximoAbre = aberto ? "" : hora < 7 ? "Abre às 7h" : (dia === 6 ? "Abre domingo às 7h" : "Abre amanhã às 7h");
  }

  pill.classList.toggle("open", aberto);
  pill.classList.toggle("closed", !aberto);
  textEl.textContent = aberto ? "ABERTO AGORA" : "FECHADO · " + proximoAbre;
}

atualizarStatusAbertura();
setInterval(atualizarStatusAbertura, 60000);

function setBackgroundWithFallback(node, localImage, fallbackImage, gradient) {
  const checker = new Image();
  const localPath = `assets/img/${localImage}`;

  checker.onload = () => {
    node.style.backgroundImage = `${gradient}, url("${localPath}")`;
  };

  checker.onerror = () => {
    node.style.backgroundImage = `${gradient}, url("${fallbackImage}")`;
  };

  checker.src = localPath;
}

document.querySelectorAll("[data-real-bg]").forEach((node) => {
  const localImage = node.getAttribute("data-real-bg");
  const fallbackImage = node.getAttribute("data-fallback-bg");
  if (!localImage || !fallbackImage) return;

  const gradient = "linear-gradient(180deg, rgba(209,15,44,0) 20%, rgba(15,15,15,0.78) 100%)";
  setBackgroundWithFallback(node, localImage, fallbackImage, gradient);
});

// LIGHTBOX para folhetos
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  if (!lightbox) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

document.querySelectorAll(".js-lightbox").forEach((el) => {
  const img = el.querySelector("img");
  if (!img) return;
  const trigger = () => openLightbox(img.src, img.alt);
  el.addEventListener("click", trigger);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger();
    }
  });
});

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
