/* ================================================================
   KAZA237 — JavaScript principal
   Fichier : js/app.js
   ================================================================
   CE FICHIER CONTIENT :
   1. La configuration du slider "À la une"
   2. La configuration du slider "Biens récents"
   3. La fonction de recherche avec filtres
   ================================================================ */

// =============================================================
    // SLIDER "À LA UNE" — Configuration
    // =============================================================
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

    // =============================================================
    // SLIDER "BIENS RÉCENTS" — Configuration
    // =============================================================
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

    // =============================================================
    // FONCTION DE RECHERCHE
    // Récupère les valeurs et redirige vers la page annonces
    // =============================================================
    function rechercherBiens() {
      // Récupérer les valeurs des filtres
      const ville   = document.getElementById('filtre-ville').value;
      const type    = document.getElementById('filtre-type').value;
      const budget  = document.getElementById('filtre-budget').value;

      // Construire l'URL avec les filtres
      let url = 'annonces.html?';
      if (ville)  url += 'ville='  + ville  + '&';
      if (type)   url += 'type='   + type   + '&';
      if (budget) url += 'budget=' + budget + '&';

      // Aller vers la page annonces
      window.location.href = url;
    }

    // Permettre de lancer la recherche en appuyant sur "Entrée"
    document.getElementById('filtre-budget').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') rechercherBiens();
    });

// =============================================================
// MENU HAMBURGER MOBILE
// Ouvre et ferme le menu mobile quand on clique sur les 3 barres
// =============================================================
function toggleMenu() {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  // Ajoute ou enlève la classe "actif" sur le menu
  menuMobile.classList.toggle('actif');

  // Ajoute ou enlève la classe "ouvert" sur le bouton (animation X)
  btnHamburger.classList.toggle('ouvert');
}

/* Rendre toggleMenu accessible depuis le HTML */
window.toggleMenu = toggleMenu;

// Fermer le menu si on clique en dehors
document.addEventListener('click', function(event) {
  const btnHamburger = document.getElementById('btnHamburger');
  const menuMobile   = document.getElementById('menuMobile');

  // Si le clic n'est ni sur le bouton ni sur le menu → fermer
  if (!btnHamburger.contains(event.target) && !menuMobile.contains(event.target)) {
    menuMobile.classList.remove('actif');
    btnHamburger.classList.remove('ouvert');
  }
});

// Fermer le menu si on tourne le téléphone (landscape → portrait)
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    document.getElementById('menuMobile').classList.remove('actif');
    document.getElementById('btnHamburger').classList.remove('ouvert');
  }
});