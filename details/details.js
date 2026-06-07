/* ================================================================
   KAZA237 — JavaScript de la page Détail d'un bien
   VERSION SIMPLE ET ROBUSTE — Sans imports complexes
   ================================================================ */

/* ============================================================
   BASE DE DONNÉES DES BIENS (données de démo)
   ============================================================ */
const tousLesBiens = [
  {
    id: '1',
    titre: 'Villa 4 chambres avec piscine',
    type: 'maison-villa',
    typeAffiche: 'Maison / Villa',
    prix: 180000000,
    prixAffiche: '180 000 000',
    unite: 'FCFA',
    ville: 'douala',
    villeAffiche: 'Douala',
    quartier: 'Bonapriso',
    images: ['/assets/images/bien1.png', '/assets/images/bien2.png', '/assets/images/bien3.jpg'],
    description: 'Belle villa sécurisée avec piscine, grand jardin et parking.',
  },
  {
    id: '2',
    titre: 'Appartement 3 pièces standing',
    type: 'appartement',
    typeAffiche: 'Appartement',
    prix: 85000000,
    prixAffiche: '85 000 000',
    unite: 'FCFA',
    ville: 'yaounde',
    villeAffiche: 'Yaoundé',
    quartier: 'Bastos',
    images: ['/assets/images/bien2.png', '/assets/images/bien3.jpg'],
    description: 'Appartement moderne avec balcon, sécurité 24h et parking souterrain.',
  },
  {
    id: '3',
    titre: 'Studio moderne tout équipé',
    type: 'studio-meuble',
    typeAffiche: 'Studio meublé',
    prix: 120000,
    prixAffiche: '120 000',
    unite: 'FCFA / mois',
    ville: 'douala',
    villeAffiche: 'Douala',
    quartier: 'Akwa',
    images: ['/assets/images/bien3.jpg', '/assets/images/bien4.jpg'],
    description: 'Studio entièrement meublé, climatisé, internet inclus.',
  },
  {
    id: '4',
    titre: 'Terrain vue mer, titre foncier',
    type: 'terrain',
    typeAffiche: 'Terrain',
    prix: 45000000,
    prixAffiche: '45 000 000',
    unite: 'FCFA',
    ville: 'douala',
    villeAffiche: 'Kribi',
    quartier: 'Bord de mer',
    images: ['/assets/images/bien4.jpg', '/assets/images/bien5.png'],
    description: '600 m² avec titre foncier en règle, bord de mer.',
  },
  {
    id: '5',
    titre: 'Plateau open space avec parking',
    type: 'bureau',
    typeAffiche: 'Bureau',
    prix: 300000,
    prixAffiche: '300 000',
    unite: 'FCFA / mois',
    ville: 'yaounde',
    villeAffiche: 'Yaoundé',
    quartier: 'Centre-ville',
    images: ['/assets/images/bien5.png', '/assets/images/bien6.jpg'],
    description: '80 m² en plein centre ville, parking inclus.',
  },
  {
    id: '6',
    titre: 'Appartement moderne à Bonamoussadi',
    type: 'appartement',
    typeAffiche: 'Appartement meublé',
    prix: 150000,
    prixAffiche: '150 000',
    unite: 'FCFA / mois',
    ville: 'douala',
    villeAffiche: 'Douala',
    quartier: 'Bonamoussadi',
    images: ['/assets/images/bien6.jpg', '/assets/images/bien1.png'],
    description: 'Appartement sécurisé avec parking, gardiennage 24h.',
  },
];

/* ============================================================
   RÉCUPÉRER L'ID DU BIEN DEPUIS L'URL
   ============================================================ */
function getIdDepuisURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/* ============================================================
   CHARGER ET AFFICHER LES DONNÉES DU BIEN
   ============================================================ */
function chargerBien(id) {
  console.log('Chargement du bien ID:', id);
  
  const bien = tousLesBiens.find(b => b.id === id);
  
  if (!bien) {
    console.error('Bien non trouvé:', id);
    document.title = 'Bien introuvable — Kaza237';
    return;
  }

  console.log('Bien trouvé:', bien);
  afficherDonnesBien(bien);
  chargerSimilaires(bien.id, bien.type);
}

/* ============================================================
   AFFICHER LES DONNÉES DU BIEN
   ============================================================ */
function afficherDonnesBien(bien) {
  document.title = bien.titre + ' — Kaza237';

  // Fil d'ariane
  const filArianeTitre = document.getElementById('filArianeTitre');
  if (filArianeTitre) filArianeTitre.textContent = bien.titre;

  // Infos principales
  const detailType = document.getElementById('detailType');
  if (detailType) detailType.textContent = bien.typeAffiche;

  const detailTitre = document.getElementById('detailTitre');
  if (detailTitre) detailTitre.textContent = bien.titre;

  const detailLieu = document.getElementById('detailLieu');
  if (detailLieu) {
    detailLieu.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + bien.villeAffiche + ', ' + bien.quartier;
  }

  const detailPrix = document.getElementById('detailPrix');
  if (detailPrix) {
    detailPrix.innerHTML = bien.prixAffiche + ' <span>' + bien.unite + '</span>';
  }

  const contactPrix = document.getElementById('contactPrix');
  if (contactPrix) {
    contactPrix.innerHTML = bien.prixAffiche + ' <span>' + bien.unite + '</span>';
  }

  const detailDescription = document.getElementById('detailDescription');
  if (detailDescription) detailDescription.textContent = bien.description;

  // Mettre à jour le slider
  mettreAJourSlider(bien.images);
}

/* ============================================================
   METTRE À JOUR LES PHOTOS DU SLIDER
   ============================================================ */
function mettreAJourSlider(images) {
  const swiperWrapper = document.querySelector('.swiper-detail .swiper-wrapper');
  if (!swiperWrapper || !images || images.length === 0) return;

  swiperWrapper.innerHTML = '';

  images.forEach(function(src, index) {
    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <div class="details-slide">
          <img src="${src}" alt="Photo ${index + 1}" 
               onerror="this.src='/assets/images/placeholder.jpg'" />
        </div>
      </div>
    `;
  });
}

/* ============================================================
   CHARGER LES BIENS SIMILAIRES
   ============================================================ */
function chargerSimilaires(idActuel, typeActuel) {
  const loader = document.getElementById('loaderSimilaires');
  const container = document.getElementById('similairesList');

  if (!container) return;

  try {
    // Filtrer les biens similaires
    const similaires = tousLesBiens.filter(b => b.type === typeActuel && b.id !== idActuel);

    // Cacher le loader
    if (loader) loader.style.display = 'none';

    if (similaires.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Aucun bien similaire.</p>';
      return;
    }

    // Afficher max 3 biens similaires
    container.innerHTML = '';
    similaires.slice(0, 3).forEach(function(bien) {
      container.innerHTML += `
        <a href="./details.html?id=${bien.id}" class="carte-similaire">
          <div class="similaire-image">
            <img src="${bien.images[0]}" alt="${bien.titre}" 
                 onerror="this.src='/assets/images/placeholder.jpg'" />
            <div class="similaire-badge-type">${bien.typeAffiche}</div>
          </div>
          <div class="similaire-corps">
            <div class="similaire-type">${bien.typeAffiche}</div>
            <div class="similaire-titre">${bien.titre}</div>
            <div class="similaire-prix">${bien.prixAffiche} <span>${bien.unite}</span></div>
            <div class="similaire-lieu">
              <i class="fa-solid fa-location-dot"></i> ${bien.villeAffiche}, ${bien.quartier}
            </div>
          </div>
        </a>
      `;
    });

  } catch (error) {
    console.error('Erreur chargement similaires:', error);
    if (loader) loader.style.display = 'none';
  }
}

/* ============================================================
   FORMULAIRE DE CONTACT → WHATSAPP
   ============================================================ */
function envoyerDemande(event) {
  event.preventDefault();

  const prenom = document.getElementById('contact-prenom').value;
  const nom = document.getElementById('contact-nom').value;
  const tel = document.getElementById('contact-tel').value;
  const message = document.getElementById('contact-message').value;
  const titreBien = document.getElementById('detailTitre').textContent;
  const lieu = document.getElementById('detailLieu').textContent.trim();

  let msgWA = 'Bonjour Kaza237 !\n\n';
  msgWA += "Je suis intéressé(e) par : " + titreBien + '\n';
  msgWA += "Localisation : " + lieu + '\n\n';
  msgWA += "👤 Nom : " + prenom + ' ' + nom + '\n';
  msgWA += "📞 Téléphone : " + tel + '\n';
  if (message) msgWA += "💬 Message : " + message + '\n';

  window.open('https://wa.me/237656155803?text=' + encodeURIComponent(msgWA), '_blank');
}

/* ============================================================
   INITIALISER LE SLIDER SWIPER
   ============================================================ */
function initialiserSlider() {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper non disponible');
    return;
  }

  try {
    new Swiper('.swiper-detail', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.swiper-detail .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-detail .swiper-button-next',
        prevEl: '.swiper-detail .swiper-button-prev',
      },
    });
  } catch (error) {
    console.warn('Erreur slider:', error);
  }
}

/* ============================================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Page détails chargée');
  
  const id = getIdDepuisURL();
  console.log('ID reçu:', id);

  if (id) {
    chargerBien(id);
  }

  setTimeout(() => initialiserSlider(), 300);

  // Gérer le lien de retour
  const lienRetour = document.getElementById('lienRetour');
  if (lienRetour) {
    const referrer = document.referrer;
    if (referrer.includes('reservations')) {
      lienRetour.textContent = 'Réservations';
      lienRetour.href = '../reservations/index.html';
    } else if (referrer.includes('annonces')) {
      lienRetour.textContent = 'Annonces';
      lienRetour.href = '../annonces/index.html';
    } else {
      lienRetour.textContent = 'Accueil';
      lienRetour.href = '../index.html';
    }
  }
});

/* Rendre les fonctions accessibles globalement */
window.envoyerDemande = envoyerDemande;