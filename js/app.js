/* ================================================================
   KAZA237 — JavaScript principal
   Fichier : js/app.js
   VERSION CORRIGÉE — Gère le cas où Swiper n'est pas disponible
   ================================================================
   CE FICHIER CONTIENT :
   1. La configuration du slider "À la une"
   2. La configuration du slider "Biens récents"
   3. La fonction de recherche avec filtres
   ================================================================ */

// =============================================================
// MENU HAMBURGER MOBILE
// Ouvre et ferme le menu mobile quand on clique sur les 3 barres
// =============================================================
function toggleMenu() {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  if (!btnHamburger || !menuMobile) return; // Sécurité

  // Ajoute ou enlève la classe "actif" sur le menu
  menuMobile.classList.toggle('actif');

  // Ajoute ou enlève la classe "ouvert" sur le bouton (animation X)
  btnHamburger.classList.toggle('ouvert');
}

// Rendre toggleMenu accessible depuis le HTML
window.toggleMenu = toggleMenu;

// Exporter toggleMenu pour les autres modules
export { toggleMenu };

// Fermer le menu si on clique en dehors
document.addEventListener('click', function(event) {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  if (!btnHamburger || !menuMobile) return; // Sécurité

  // Si le clic n'est ni sur le bouton ni sur le menu → fermer
  if (!btnHamburger.contains(event.target) && !menuMobile.contains(event.target)) {
    menuMobile.classList.remove('actif');
    btnHamburger.classList.remove('ouvert');
  }
});

// Fermer le menu si on tourne le téléphone (landscape → portrait)
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    const menuMobile = document.getElementById('menuMobile');
    const btnHamburger = document.getElementById('btnHamburger');
    if (menuMobile) menuMobile.classList.remove('actif');
    if (btnHamburger) btnHamburger.classList.remove('ouvert');
  }
});

// =============================================================
// SLIDERS SWIPER — Configuration (seulement si Swiper existe)
// =============================================================

// ⚠️ IMPORTANT : Swiper doit être chargé AVANT ce script
// Vérifier que Swiper est disponible avant de l'utiliser

if (typeof Swiper !== 'undefined') {
  
  // =============================================================
  // SLIDER "À LA UNE" — Configuration
  // =============================================================
  try {
    const swiperUne = new Swiper('.swiper-une', {
      // Nombre de slides visibles à la fois
      slidesPerView: 1,
      spaceBetween: 20,

      // Défilement automatique toutes les 3 secondes (3000 ms)
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },

      // Boucle infinie
      loop: true,

      // Points de pagination
      pagination: {
        el: '.swiper-une .swiper-pagination',
        clickable: true,
      },

      // Boutons précédent / suivant
      navigation: {
        nextEl: '.swiper-une .swiper-button-next',
        prevEl: '.swiper-une .swiper-button-prev',
      },

      // Responsive : combien de slides selon la taille d'écran
      breakpoints: {
        640: { slidesPerView: 2 },  // Tablette : 2 slides
        1024: { slidesPerView: 3 }, // Desktop : 3 slides
      },
    });
  } catch (error) {
    console.warn('Erreur lors de l\'initialisation du slider "À la une":', error);
  }

  // =============================================================
  // SLIDER "BIENS RÉCENTS" — Configuration
  // =============================================================
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

      // Responsive
      breakpoints: {
        640: { slidesPerView: 2 },  // Tablette : 2 cartes
        1024: { slidesPerView: 4 }, // Desktop : 4 cartes
      },
    });
  } catch (error) {
    console.warn('Erreur lors de l\'initialisation du slider "Biens récents":', error);
  }

} else {
  console.warn('⚠️ Swiper n\'est pas chargé. Les sliders ne fonctionneront pas.');
  console.warn('Assurez-vous que la bibliothèque Swiper est chargée AVANT ce script.');
}

// =============================================================
// FONCTION DE RECHERCHE
// Récupère les valeurs et redirige vers la page annonces
// =============================================================
function rechercherBiens() {
  // Récupérer les valeurs des filtres
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

  // Construire l'URL avec les filtres
  let url = 'annonces/index.html?';
  if (ville)  url += 'ville='  + encodeURIComponent(ville)  + '&';
  if (type)   url += 'type='   + encodeURIComponent(type)   + '&';
  if (budget) url += 'budget=' + encodeURIComponent(budget) + '&';

  // Aller vers la page annonces
  window.location.href = url;
}

// Permettre de lancer la recherche en appuyant sur "Entrée"
document.addEventListener('DOMContentLoaded', function() {
  const filtre_budget = document.getElementById('filtre-budget');
  if (filtre_budget) {
    filtre_budget.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') rechercherBiens();
    });
  }
});

// Rendre rechercherBiens accessible depuis le HTML
window.rechercherBiens = rechercherBiens;