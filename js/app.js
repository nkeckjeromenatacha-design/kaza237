/* ================================================================
   KAZA237 — JavaScript principal
   Fichier : js/app.js
   VERSION CORRIGÉE — Avec Firebase et Swiper
   ================================================================ */

// Importer Firebase
import { db } from './firebase-config.js';

console.log('✅ Firebase chargé dans app.js');

// =============================================================
// MENU HAMBURGER MOBILE
// =============================================================
function toggleMenu() {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  if (!btnHamburger || !menuMobile) return;

  menuMobile.classList.toggle('actif');
  btnHamburger.classList.toggle('ouvert');
}

window.toggleMenu = toggleMenu;

export { toggleMenu };

// Fermer le menu si on clique en dehors
document.addEventListener('click', function(event) {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  if (!btnHamburger || !menuMobile) return;

  if (!btnHamburger.contains(event.target) && !menuMobile.contains(event.target)) {
    menuMobile.classList.remove('actif');
    btnHamburger.classList.remove('ouvert');
  }
});

// Fermer le menu si on tourne le téléphone
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    const menuMobile = document.getElementById('menuMobile');
    const btnHamburger = document.getElementById('btnHamburger');
    if (menuMobile) menuMobile.classList.remove('actif');
    if (btnHamburger) btnHamburger.classList.remove('ouvert');
  }
});

// =============================================================
// SLIDERS SWIPER
// =============================================================

if (typeof Swiper !== 'undefined') {
  console.log('✅ Swiper disponible');

  // Slider "À la une"
  try {
    const swiperUne = new Swiper('.swiper-une', {
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: '.swiper-une .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-une .swiper-button-next',
        prevEl: '.swiper-une .swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
    console.log('✅ Slider "À la une" initialisé');
  } catch (error) {
    console.warn('⚠️ Erreur slider "À la une":', error);
  }

  // Slider "Biens récents"
  try {
    const swiperRecents = new Swiper('.swiper-recents', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-recents .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-recents .swiper-button-next',
        prevEl: '.swiper-recents .swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      },
    });
    console.log('✅ Slider "Biens récents" initialisé');
  } catch (error) {
    console.warn('⚠️ Erreur slider "Biens récents":', error);
  }

} else {
  console.warn('⚠️ Swiper n\'est pas chargé');
}

// =============================================================
// FONCTION DE RECHERCHE
// =============================================================
function rechercherBiens() {
  const filtre_ville   = document.getElementById('filtre-ville');
  const filtre_type    = document.getElementById('filtre-type');
  const filtre_budget  = document.getElementById('filtre-budget');

  if (!filtre_ville || !filtre_type || !filtre_budget) {
    console.warn('Les champs de filtre ne sont pas trouvés');
    return;
  }

  const ville   = filtre_ville.value;
  const type    = filtre_type.value;
  const budget  = filtre_budget.value;

  let url = 'annonces/index.html?';
  if (ville)  url += 'ville='  + encodeURIComponent(ville)  + '&';
  if (type)   url += 'type='   + encodeURIComponent(type)   + '&';
  if (budget) url += 'budget=' + encodeURIComponent(budget) + '&';

  window.location.href = url;
}

window.rechercherBiens = rechercherBiens;

document.addEventListener('DOMContentLoaded', function() {
  const filtre_budget = document.getElementById('filtre-budget');
  if (filtre_budget) {
    filtre_budget.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') rechercherBiens();
    });
  }
});
