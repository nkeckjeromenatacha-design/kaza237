import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  where,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ================================================================
   KAZA237 — JavaScript de la page Détail d'un bien
   Fichier : js/detail.js
   ================================================================
   CE FICHIER CONTIENT :
   1. Récupération de l'ID du bien depuis l'URL
   2. Chargement des données du bien (exemples → Firebase)
   3. Affichage des infos du bien
   4. Chargement des biens similaires (même catégorie)
   5. Formulaire de contact → WhatsApp
   6. Slider de photos (Swiper.js)
   ================================================================ */
 
 
/* ============================================================
   1. BASE DE DONNÉES DES BIENS (exemples — sera Firebase)
   Même structure que annonces.js et reservations.js
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
    statut: 'disponible',
    vues: 124,
    likes: 32,
    datePublication: '01/04/2025',
    images: [
      'assets/images/bien1.jpg',
      'assets/images/bien2.jpg',
      'assets/images/bien3.jpg',
    ],
    description: 'Belle villa sécurisée avec piscine, grand jardin et parking. Idéale pour une famille. Située dans un quartier calme et résidentiel de Bonapriso. Accès facile aux commerces et établissements scolaires. Gardiennage 24h/24.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie',      valeur: '280 m²' },
      { icone: 'fa-bed',           label: 'Chambres',         valeur: '4 chambres' },
      { icone: 'fa-shower',        label: 'Salles de bain',   valeur: '3 salles' },
      { icone: 'fa-car',           label: 'Parking',          valeur: '2 places' },
      { icone: 'fa-water-ladder',  label: 'Piscine',          valeur: 'Oui' },
      { icone: 'fa-file-contract', label: 'Document',         valeur: 'Titre foncier' },
    ],
    equipements: [],
    whatsapp: 'Villa 4 chambres avec piscine à Douala Bonapriso',
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
    statut: 'disponible',
    vues: 89,
    likes: 21,
    datePublication: '05/04/2025',
    images: [
      'assets/images/bien2.jpg',
      'assets/images/bien3.jpg',
    ],
    description: 'Appartement moderne avec balcon, sécurité 24h et parking souterrain. Situé dans le quartier diplomatique de Bastos.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie',    valeur: '120 m²' },
      { icone: 'fa-bed',           label: 'Chambres',       valeur: '3 chambres' },
      { icone: 'fa-shower',        label: 'Salles de bain', valeur: '2 salles' },
      { icone: 'fa-car',           label: 'Parking',        valeur: '1 place' },
      { icone: 'fa-building',      label: 'Étage',          valeur: '3ème étage' },
      { icone: 'fa-file-contract', label: 'Document',       valeur: 'Titre foncier' },
    ],
    equipements: [],
    whatsapp: "Appartement 3 pièces standing à Yaoundé Bastos",
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
    statut: 'disponible',
    vues: 56,
    likes: 14,
    datePublication: '10/04/2025',
    images: [
      'assets/images/bien3.jpg',
      'assets/images/bien4.jpg',
    ],
    description: 'Studio entièrement meublé, climatisé, internet inclus. Disponible immédiatement. Idéal pour un professionnel ou étudiant.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie', valeur: '35 m²' },
      { icone: 'fa-bed',           label: 'Chambre',     valeur: '1 chambre' },
      { icone: 'fa-shower',        label: 'Salle de bain', valeur: '1 salle' },
      { icone: 'fa-building',      label: 'Étage',        valeur: '2ème étage' },
    ],
    equipements: ['Wifi', 'Climatisation', 'Télévision', 'Cuisine équipée', 'Eau courante'],
    whatsapp: 'Studio moderne tout équipé à Douala Akwa',
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
    statut: 'disponible',
    vues: 43,
    likes: 18,
    datePublication: '08/04/2025',
    images: [
      'assets/images/bien4.jpg',
      'assets/images/bien5.jpg',
    ],
    description: '600 m² avec titre foncier en règle, bord de mer, idéal pour construction villa ou hôtel.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie',  valeur: '600 m²' },
      { icone: 'fa-file-contract', label: 'Document',     valeur: 'Titre foncier' },
      { icone: 'fa-water',         label: 'Vue',          valeur: 'Vue mer' },
      { icone: 'fa-road',          label: 'Accès',        valeur: 'Route goudronnée' },
    ],
    equipements: [],
    whatsapp: 'Terrain vue mer à Kribi Bord de mer',
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
    statut: 'disponible',
    vues: 37,
    likes: 9,
    datePublication: '12/04/2025',
    images: [
      'assets/images/bien5.jpg',
      'assets/images/bien6.jpg',
    ],
    description: '80 m² en plein centre ville, parking inclus, fibre optique disponible. Idéal pour entreprise ou ONG.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie', valeur: '80 m²' },
      { icone: 'fa-car',           label: 'Parking',     valeur: 'Inclus' },
      { icone: 'fa-building',      label: 'Étage',       valeur: 'Rez-de-chaussée' },
      { icone: 'fa-wifi',          label: 'Fibre',       valeur: 'Disponible' },
    ],
    equipements: [],
    whatsapp: 'Bureau open space à Yaoundé Centre-ville',
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
    statut: 'disponible',
    vues: 71,
    likes: 26,
    datePublication: '03/04/2025',
    images: [
      'assets/images/bien6.jpg',
      'assets/images/bien1.jpg',
    ],
    description: 'Appartement sécurisé avec parking, gardiennage 24h et générateur. Proche des grandes surfaces.',
    caracteristiques: [
      { icone: 'fa-ruler-combined', label: 'Superficie',    valeur: '85 m²' },
      { icone: 'fa-bed',           label: 'Chambres',       valeur: '2 chambres' },
      { icone: 'fa-shower',        label: 'Salles de bain', valeur: '1 salle' },
      { icone: 'fa-car',           label: 'Parking',        valeur: '1 place' },
    ],
    equipements: ['Wifi', 'Climatisation', 'Groupe électrogène', 'Sécurité 24h'],
    whatsapp: "Appartement moderne à Douala Bonamoussadi",
  },
];
 
 
/* ============================================================
   2. RÉCUPÉRER L'ID DU BIEN DANS L'URL
   Ex : detail.html?id=1 → id = "1"
   ============================================================ */
function getIdDepuisURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}
 
 
/* ============================================================
   3. CHARGER ET AFFICHER LES DONNÉES DU BIEN
   ============================================================ */
   async function chargerBien(id) {
  try {
    /* Récupérer le bien depuis Firebase */
    const docRef  = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      document.title = 'Bien introuvable — Kaza237';
      return;
    }

    const bien = { id: docSnap.id, ...docSnap.data() };

    /* Incrémenter le nombre de vues automatiquement */
    await updateDoc(docRef, { vues: increment(1) });

    /* Mettre à jour la page avec les données du bien */
    afficherDonnesBien(bien);

    /* Charger les biens similaires */
    chargerSimilaires(bien.id, bien.type);

  } catch (error) {
    console.error('Erreur Firebase :', error);
    /* Si Firebase échoue, utiliser les données de test */
    const bien = tousLesBiens.find(function(b) { return b.id === id; });
    if (bien) {
      afficherDonnesBien(bien);
      chargerSimilaires(bien.id, bien.type);
    }
  }
}

function afficherDonnesBien(bien) {
  const id = bien.id;
 
  /* Chercher le bien dans la liste */
  const bien = tousLesBiens.find(function(b) { return b.id === id; });
 
  /* Si le bien n'existe pas */
  if (!bien) {
    document.title = 'Bien introuvable — Kaza237';
    return;
  }
 
  /* Mettre à jour le titre de l'onglet */
  document.title = bien.titre + ' — Kaza237';
 
  /* Mettre à jour le fil d'ariane */
  document.getElementById('filArianeTitre').textContent = bien.titre;
 
  /* Mettre à jour le type */
  document.getElementById('detailType').textContent = bien.typeAffiche;
 
  /* Mettre à jour le titre */
  document.getElementById('detailTitre').textContent = bien.titre;
 
  /* Mettre à jour la localisation */
  document.getElementById('detailLieu').innerHTML =
    '<i class="fa-solid fa-location-dot"></i> ' +
    bien.villeAffiche + ', ' + bien.quartier;
 
  /* Mettre à jour le prix */
  document.getElementById('detailPrix').innerHTML =
    bien.prixAffiche + ' <span>' + bien.unite + '</span>';
 
  /* Mettre à jour le prix dans la card de contact */
  document.getElementById('contactPrix').innerHTML =
    bien.prixAffiche + ' <span>' + bien.unite + '</span>';
 
  /* Mettre à jour les statistiques */
  document.getElementById('detailVues').innerHTML =
    '<i class="fa-solid fa-eye"></i> ' + bien.vues + ' vues';
  document.getElementById('detailLikes').innerHTML =
    '<i class="fa-solid fa-heart"></i> ' + bien.likes + " j'aime";
  document.getElementById('detailDate').innerHTML =
    '<i class="fa-solid fa-calendar"></i> Publié le ' + bien.datePublication;
 
  /* Mettre à jour le statut */
  const estDisponible = bien.statut === 'disponible';
  const badgeStatut   = document.getElementById('detailStatut');
  const contactStatut = document.getElementById('contactStatut');
 
  if (estDisponible) {
    badgeStatut.className = 'badge-dispo disponible';
    badgeStatut.innerHTML = '<i class="fa-solid fa-circle-check"></i> Disponible';
    contactStatut.textContent = 'Disponible';
    contactStatut.previousElementSibling.style.color = '#16a34a';
  } else {
    badgeStatut.className = 'badge-dispo occupe';
    badgeStatut.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Déjà occupé';
    contactStatut.textContent = 'Déjà occupé';
    contactStatut.previousElementSibling.style.color = '#dc2626';
  }
 
  /* Mettre à jour la description */
  document.getElementById('detailDescription').textContent = bien.description;
 
  /* Mettre à jour la ville et le quartier */
  document.getElementById('detailVille').textContent    = bien.villeAffiche;
  document.getElementById('detailQuartier').textContent = bien.quartier;
 
  /* Mettre à jour les caractéristiques */
  const containerCaract = document.getElementById('detailCaracteristiques');
  containerCaract.innerHTML = '';
  bien.caracteristiques.forEach(function(caract) {
    containerCaract.innerHTML += `
      <div class="caracteristique">
        <i class="fa-solid ${caract.icone}"></i>
        <div>
          <div class="caract-label">${caract.label}</div>
          <div class="caract-valeur">${caract.valeur}</div>
        </div>
      </div>
    `;
  });
 
  /* Mettre à jour les équipements (si le bien en a) */
  const sectionEquipements = document.getElementById('sectionEquipements');
  const containerEquip     = document.getElementById('detailEquipements');
 
  if (bien.equipements && bien.equipements.length > 0) {
    sectionEquipements.style.display = 'block';
    containerEquip.innerHTML = '';
 
    const icones = {
      'Wifi': 'fa-wifi', 'Climatisation': 'fa-wind',
      'Télévision': 'fa-tv', 'Groupe électrogène': 'fa-plug',
      'Eau courante': 'fa-droplet', 'Sécurité 24h': 'fa-shield-halved',
      'Cuisine équipée': 'fa-utensils', 'Parking': 'fa-car',
    };
 
    bien.equipements.forEach(function(eq) {
      const icone = icones[eq] || 'fa-check';
      containerEquip.innerHTML +=
        `<span><i class="fa-solid ${icone}"></i> ${eq}</span>`;
    });
  } else {
    sectionEquipements.style.display = 'none';
  }
 
  /* Mettre à jour le lien WhatsApp direct */
  const msgWA = encodeURIComponent(
    'Bonjour Kaza237, je suis intéressé(e) par ' + bien.whatsapp + '.'
  );
  document.getElementById('btnWhatsappDirect').href =
    'https://wa.me/237656155803?text=' + msgWA;
 
  /* Mettre à jour les photos du slider */
  mettreAJourSlider(bien.images);
 
  /* Charger les biens similaires */
  chargerSimilaires(bien.id, bien.type);
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
        <div class="detail-slide">
          <img src="${src}" alt="Photo ${index + 1} du bien"
               onerror="this.src='assets/images/placeholder.jpg'" />
        </div>
      </div>
    `;
  });
}
 
 
/* ============================================================
   4. CHARGER LES BIENS SIMILAIRES (même type)
   ============================================================ */
function chargerSimilaires(idActuel, typeActuel) {
  const loader    = document.getElementById('loaderSimilaires');
  const container = document.getElementById('similairesList');
 
  /* Filtrer les biens : même type, pas le bien actuel */
  const similaires = tousLesBiens.filter(function(b) {
    return b.type === typeActuel && b.id !== idActuel;
  });
 
  /* Cacher le loader */
  if (loader) loader.style.display = 'none';
 
  if (similaires.length === 0) {
    container.innerHTML =
      '<p style="color: var(--gris-doux); font-size: 14px;">Aucun bien similaire pour le moment.</p>';
    return;
  }
 
  /* Afficher max 3 biens similaires */
  similaires.slice(0, 3).forEach(function(bien) {
    container.innerHTML += `
      <a href="detail.html?id=${bien.id}" class="carte-similaire">
        <div class="similaire-image">
          <img src="${bien.images[0]}" alt="${bien.titre}"
               onerror="this.src='assets/images/placeholder.jpg'" />
          <div class="similaire-badge-type">${bien.typeAffiche}</div>
        </div>
        <div class="similaire-corps">
          <div class="similaire-type">${bien.typeAffiche}</div>
          <div class="similaire-titre">${bien.titre}</div>
          <div class="similaire-prix">
            ${bien.prixAffiche} <span>${bien.unite}</span>
          </div>
          <div class="similaire-lieu">
            <i class="fa-solid fa-location-dot"></i>
            ${bien.villeAffiche}, ${bien.quartier}
          </div>
        </div>
      </a>
    `;
  });
}
 
 
/* ============================================================
   5. FORMULAIRE DE CONTACT → WHATSAPP
   ============================================================ */
async function envoyerDemande(event) {
  event.preventDefault();

  /* Récupérer les valeurs */
  const prenom  = document.getElementById('contact-prenom').value;
  const nom     = document.getElementById('contact-nom').value;
  const tel     = document.getElementById('contact-tel').value;
  const message = document.getElementById('contact-message').value;
  const titreBien = document.getElementById('detailTitre').textContent;
  const lieu      = document.getElementById('detailLieu').textContent.trim();

  try {
    /* Sauvegarder dans Firebase */
    await addDoc(collection(db, 'contacts'), {
      prenom,
      nom,
      telephone : tel,
      message,
      bienTitre : titreBien,
      bienLieu  : lieu,
      statut    : 'non_lu',
      createdAt : new Date()
    });

  } catch (error) {
    console.error('Erreur sauvegarde contact :', error);
  }

  /* Rediriger vers WhatsApp */
  let msgWA = 'Bonjour Kaza237 !\n\n';
  msgWA += "Je suis intéressé(e) par : " + titreBien + '\n';
  msgWA += "Localisation : " + lieu + '\n\n';
  msgWA += "👤 Nom : " + prenom + ' ' + nom + '\n';
  msgWA += "📞 Téléphone : " + tel + '\n';
  if (message) msgWA += "💬 Message : " + message + '\n';

  window.open(
    'https://wa.me/237656155803?text=' + encodeURIComponent(msgWA),
    '_blank'
  );
}
 
  /* Récupérer les valeurs */
  const prenom  = document.getElementById('contact-prenom').value;
  const nom     = document.getElementById('contact-nom').value;
  const tel     = document.getElementById('contact-tel').value;
  const message = document.getElementById('contact-message').value;
 
  /* Récupérer le titre du bien */
  const titreBien = document.getElementById('detailTitre').textContent;
  const lieu      = document.getElementById('detailLieu').textContent.trim();
 
  /* Construire le message WhatsApp */
  let msgWA = 'Bonjour Kaza237 !\n\n';
  msgWA += "Je suis intéressé(e) par : " + titreBien + '\n';
  msgWA += "Localisation : " + lieu + '\n\n';
  msgWA += "👤 Nom : " + prenom + ' ' + nom + '\n';
  msgWA += "📞 Téléphone : " + tel + '\n';
  if (message) msgWA += "💬 Message : " + message + '\n';
 
  /* Rediriger vers WhatsApp */
  window.open(
    'https://wa.me/237656155803?text=' + encodeURIComponent(msgWA),
    '_blank'
  );

/* ============================================================
   6. INITIALISATION DU SLIDER SWIPER
   ============================================================ */
function initialiserSlider() {
  new Swiper('.swiper-detail', {
    slidesPerView  : 1,
    spaceBetween   : 0,
    loop           : true,
 
    /* Défilement automatique toutes les 3 secondes */
    autoplay: {
      delay               : 3000,
      disableOnInteraction: false,
    },
 
    pagination: {
      el       : '.swiper-detail .swiper-pagination',
      clickable: true,
    },
 
    navigation: {
      nextEl: '.swiper-detail .swiper-button-next',
      prevEl: '.swiper-detail .swiper-button-prev',
    },
  });
}
 
 
/* ============================================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* Récupérer l'ID dans l'URL */
  const id = getIdDepuisURL();

  if (id) {
    chargerBien(id);
  }

  /* Initialiser le slider après un court délai */
  setTimeout(function() {
    initialiserSlider();
  }, 300);

  /* Gérer le lien "retour" selon la page d'origine */
  const lienRetour = document.getElementById('lienRetour');
  const referrer   = document.referrer;

  if (referrer.includes('reservations')) {
    lienRetour.textContent = 'Réservations';
    lienRetour.href        = 'reservations.html';
  } else if (referrer.includes('annonces')) {
    lienRetour.textContent = 'Annonces';
    lienRetour.href        = 'annonces/index.html';
  } else {
    lienRetour.textContent = 'Accueil';
    lienRetour.href        = 'index.html';
  }

});
