/* ================================================================
   KAZA237 — JavaScript de la page Annonces
   Fichier : js/annonces.js
   ================================================================
   CE FICHIER CONTIENT :
   1. Les quartiers par ville (pour le filtre dynamique)
   2. La logique de filtrage des biens
   3. Le chargement depuis Firebase (à activer quand Firebase est prêt)
   4. Le bouton "Voir plus" (pagination)
   5. Le menu de catégories (onglets)
   ================================================================
   COMMENT MODIFIER :
   - Pour changer les quartiers → section "QUARTIERS PAR VILLE"
   - Pour activer Firebase → décommente la section "FIREBASE"
   - Pour changer le nombre de biens affichés → modifie BIENS_PAR_PAGE
   ================================================================ */


/* ============================================================
   1. QUARTIERS PAR VILLE
   Quand l'utilisateur choisit une ville, les quartiers s'adaptent.
   MODIFIE LES QUARTIERS ICI si tu veux en ajouter ou supprimer.
   ============================================================ */
const quartierParVille = {

  /* Quartiers de Douala */
  douala: [
    'Akwa',
    'Bonanjo',
    'Bonapriso',
    'Bonamoussadi',
    'Kotto',
    'Makepe',
    'Ndokoti',
    'Bali',
    'Deïdo',
    'Logbessou',
  ],

  /* Quartiers de Yaoundé */
  yaounde: [
    'Bastos',
    'Centre-ville',
    'Melen',
    'Essos',
    'Biyem-Assi',
    'Emana',
    'Nlongkak',
    'Omnisports',
    'Tsinga',
    'Nkolbisson',
  ],

};

/* ============================================================
   FONCTION : Charger les quartiers selon la ville choisie
   Appelée automatiquement quand l'utilisateur change la ville
   ============================================================ */
function chargerQuartiers() {
  const selectVille    = document.getElementById('filtre-ville');
  const selectQuartier = document.getElementById('filtre-quartier');
  const villeChoisie   = selectVille.value;

  /* Vider les quartiers actuels */
  selectQuartier.innerHTML = '<option value="">Tous les quartiers</option>';

  /* Si une ville est choisie, ajouter ses quartiers */
  if (villeChoisie && quartierParVille[villeChoisie]) {
    quartierParVille[villeChoisie].forEach(function(quartier) {
      const option = document.createElement('option');
      option.value = quartier.toLowerCase().replace(/\s+/g, '-');
      option.textContent = quartier;
      selectQuartier.appendChild(option);
    });
  }
}


/* ============================================================
   2. DONNÉES DE TEST (biens statiques)
   Ces données seront remplacées par Firebase plus tard.
   STRUCTURE d'un bien : copie ce modèle pour en ajouter un.
   ============================================================ */
const biensDemoData = [
  {
    id: '1',
    title: 'Villa 4 chambres avec piscine',
    type: 'maison-villa',
    price: 180000000,
    prixAffiche: '180 000 000',
    unite: 'FCFA',
    city: 'douala',
    quartier: 'Bonapriso',
    featured: true,
    image: '../assets/images/bien1.jpg',
    description: 'Belle villa sécurisée avec piscine, jardin et parking. Idéale pour famille.',
    whatsapp: 'Je suis intéressé(e) par la Villa 4 chambres avec piscine à Douala Bonapriso.',
  },
  {
    id: '2',
    title: 'Appartement 3 pièces standing',
    type: 'appartement',
    price: 85000000,
    prixAffiche: '85 000 000',
    unite: 'FCFA',
    city: 'yaounde',
    quartier: 'Bastos',
    featured: true,
    image: '../assets/images/bien2.jpg',
    description: 'Appartement moderne avec balcon, sécurité 24h et parking souterrain.',
    whatsapp: "Je suis intéressé(e) par l'Appartement 3 pièces à Yaoundé Bastos.",
  },
  {
    id: '3',
    title: 'Studio moderne tout équipé',
    type: 'studio-moderne',
    price: 120000,
    prixAffiche: '120 000',
    unite: 'FCFA / mois',
    city: 'douala',
    quartier: 'Akwa',
    featured: true,
    image: '../assets/images/bien3.jpg',
    description: 'Studio entièrement meublé, climatisé, internet inclus. Disponible immédiatement.',
    whatsapp: 'Je suis intéressé(e) par le Studio moderne à Douala Akwa.',
  },
  {
    id: '4',
    title: 'Terrain vue mer, titre foncier',
    type: 'terrain',
    price: 45000000,
    prixAffiche: '45 000 000',
    unite: 'FCFA',
    city: 'douala',
    quartier: 'Bord de mer',
    featured: false,
    image: '../assets/images/bien4.jpg',
    description: '600 m² avec titre foncier en règle, bord de mer, idéal pour construction.',
    whatsapp: 'Je suis intéressé(e) par le Terrain vue mer à Kribi.',
  },
  {
    id: '5',
    title: 'Plateau open space avec parking',
    type: 'bureau',
    price: 300000,
    prixAffiche: '300 000',
    unite: 'FCFA / mois',
    city: 'yaounde',
    quartier: 'Centre-ville',
    featured: false,
    image: '../assets/images/bien5.jpg',
    description: '80 m² en plein centre ville, parking inclus, fibre optique disponible.',
    whatsapp: 'Je suis intéressé(e) par le Bureau open space à Yaoundé Centre.',
  },
  {
    id: '6',
    title: 'Appartement moderne à Bonamoussadi',
    type: 'appartement',
    price: 150000,
    prixAffiche: '150 000',
    unite: 'FCFA / mois',
    city: 'douala',
    quartier: 'Bonamoussadi',
    featured: true,
    image: '../assets/images/bien6.jpg',
    description: 'Appartement sécurisé avec parking, gardiennage 24h et générateur.',
    whatsapp: "Je suis intéressé(e) par l'Appartement à Douala Bonamoussadi.",
  },
];

/* Combien de biens afficher au départ */
const BIENS_PAR_PAGE = 6;

/* Compteur de biens actuellement affichés */
let biensAffichesCount = BIENS_PAR_PAGE;

/* Liste des biens actuellement filtrés */
let biensFiltres = [...biensDemoData];


/* ============================================================
   3. AFFICHER LES CARTES DE BIENS
   Cette fonction construit le HTML de chaque carte et l'insère.
   ============================================================ */
function afficherBiens(biens, nombreAafficher) {
  const container       = document.getElementById('biensList');
  const compteur        = document.getElementById('compteurResultats');
  const aucunResultat   = document.getElementById('aucunResultat');
  const voirPlusWrap    = document.getElementById('voirPlusWrap');

  /* Vider la liste actuelle */
  container.innerHTML = '';

  /* Si aucun résultat */
  if (biens.length === 0) {
    aucunResultat.style.display = 'flex';
    voirPlusWrap.style.display  = 'none';
    compteur.textContent        = '0 bien trouvé';
    return;
  }

  /* Cacher le message "aucun résultat" */
  aucunResultat.style.display = 'none';

  /* Mettre à jour le compteur */
  const total = biens.length;
  const affiches = Math.min(nombreAafficher, total);
  compteur.textContent = total + ' bien' + (total > 1 ? 's' : '') + ' trouvé' + (total > 1 ? 's' : '');

  /* Afficher seulement les N premiers biens */
  const biensAMontrer = biens.slice(0, nombreAafficher);

  biensAMontrer.forEach(function(bien) {

    /* Construire le badge "Disponible" si featured = true */
    const badgeDisponible = bien.featured
      ? `<div class="badge-disponible">
           <i class="fa-solid fa-circle-check"></i> Disponible
         </div>`
      : '';

    /* Construire le message WhatsApp encodé */
    const msgWA = encodeURIComponent(
      'Bonjour Kaza237, ' + bien.whatsapp
    );

    /* Construire le HTML de la carte */
    const carteHTML = `
      <div class="carte-bien">

        <div class="carte-image">
          <img src="${bien.image}"
               alt="${bien.title}"
               onerror="this.src='../assets/images/placeholder.jpg'" />
          ${badgeDisponible}
          <div class="badge-type">${formaterType(bien.type)}</div>
        </div>

        <div class="carte-corps">
          <div class="carte-type">${formaterType(bien.type)}</div>
          <h3 class="carte-titre">${bien.title}</h3>
          <div class="carte-prix">
            ${bien.prixAffiche} <span>${bien.unite}</span>
          </div>
          <div class="carte-lieu">
            <i class="fa-solid fa-location-dot"></i>
            ${capitaliser(bien.city)}, ${bien.quartier}
          </div>
          <div class="carte-actions">
            <a href="detail.html?id=${bien.id}" class="btn-voir-details">
              <i class="fa-solid fa-eye"></i> Voir détails
            </a>
            <a href="https://wa.me/237656155803?text=${msgWA}"
               target="_blank" class="btn-whatsapp-carte">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

      </div>
    `;

    container.innerHTML += carteHTML;
  });

  /* Afficher ou cacher le bouton "Voir plus" */
  if (nombreAafficher >= total) {
    voirPlusWrap.style.display = 'none'; /* Tous les biens sont affichés */
  } else {
    voirPlusWrap.style.display = 'block'; /* Il reste des biens à charger */
  }
}


/* ============================================================
   FONCTIONS UTILITAIRES
   ============================================================ */

/* Convertit "maison-villa" → "Maison / Villa" */
function formaterType(type) {
  const types = {
    'appartement'     : 'Appartement',
    'studio-moderne'  : 'Studio moderne',
    'chambre-moderne' : 'Chambre moderne',
    'terrain'         : 'Terrain à vendre',
    'maison-villa'    : 'Maison / Villa',
    'bureau'          : 'Bureau',
    'commerce'        : 'Commerce',
  };
  return types[type] || type;
}

/* Met une majuscule à la première lettre */
function capitaliser(texte) {
  if (!texte) return '';
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}


/* ============================================================
   4. FILTRER LES BIENS
   Appelée quand on clique sur "Filtrer"
   ============================================================ */
function filtrerBiens() {
  const ville   = document.getElementById('filtre-ville').value;
  const quartier = document.getElementById('filtre-quartier').value;
  const type    = document.getElementById('filtre-type').value;
  const prixMax = parseInt(document.getElementById('filtre-prix').value) || null;

  /* Filtrer les biens selon les critères */
  biensFiltres = biensDemoData.filter(function(bien) {

    /* Filtre par ville */
    if (ville && bien.city !== ville) return false;

    /* Filtre par quartier */
    if (quartier) {
      const quartierBien = bien.quartier.toLowerCase().replace(/\s+/g, '-');
      if (quartierBien !== quartier) return false;
    }

    /* Filtre par type */
    if (type && bien.type !== type) return false;

    /* Filtre par prix maximum */
    if (prixMax && bien.price > prixMax) return false;

    return true; /* Le bien passe tous les filtres */
  });

  /* Remettre le compteur à la page 1 */
  biensAffichesCount = BIENS_PAR_PAGE;

  /* Afficher les résultats */
  afficherBiens(biensFiltres, biensAffichesCount);

  /* Faire défiler vers la liste des biens */
  document.querySelector('.section-annonces').scrollIntoView({
    behavior: 'smooth'
  });
}


/* ============================================================
   FILTRER PAR CATÉGORIE (onglets du menu)
   Appelée quand on clique sur un onglet de catégorie
   ============================================================ */
function filtrerParCategorie(bouton, type) {

  /* Mettre à jour l'onglet actif */
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  bouton.classList.add('actif');

  /* Mettre à jour le select de type dans les filtres */
  document.getElementById('filtre-type').value = type;

  /* Appliquer le filtre */
  filtrerBiens();
}


/* ============================================================
   RÉINITIALISER TOUS LES FILTRES
   ============================================================ */
function reinitialiserFiltres() {

  /* Vider tous les champs */
  document.getElementById('filtre-ville').value    = '';
  document.getElementById('filtre-quartier').value = '';
  document.getElementById('filtre-type').value     = '';
  document.getElementById('filtre-prix').value     = '';

  /* Remettre les quartiers à "tous" */
  chargerQuartiers();

  /* Remettre l'onglet "Tous" actif */
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  document.querySelector('.btn-categorie').classList.add('actif');

  /* Remettre tous les biens */
  biensFiltres = [...biensDemoData];
  biensAffichesCount = BIENS_PAR_PAGE;
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   5. BOUTON "VOIR PLUS" — charger plus de biens
   ============================================================ */
function chargerPlusDeBiens() {
  /* Ajouter 6 biens supplémentaires */
  biensAffichesCount += BIENS_PAR_PAGE;

  /* Réafficher avec le nouveau nombre */
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   INITIALISATION AU CHARGEMENT DE LA PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {

  /* Masquer le loader */
  const loader = document.getElementById('loaderWrap');

  /* Vider les cartes statiques (exemples HTML) et afficher les données JS */
  setTimeout(function() {
    /* Simuler un chargement de 600ms (sera remplacé par Firebase) */
    if (loader) loader.style.display = 'none';

    /* Afficher les biens */
    afficherBiens(biensFiltres, biensAffichesCount);

  }, 600);

  /* Lire les paramètres d'URL (ex: annonces.html?type=appartement) */
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const villeParam = params.get('ville');
  const modeParam = params.get('mode');

  if (typeParam) {
    document.getElementById('filtre-type').value = typeParam;
  }

  if (villeParam) {
    document.getElementById('filtre-ville').value = villeParam;
    chargerQuartiers();
  }

  /* Si on arrive depuis "Louer" ou "Acheter" */
  if (modeParam) {
    /* Pour une future extension Firebase */
    console.log('Mode sélectionné :', modeParam);
  }
});


/* ============================================================
   FIREBASE — À ACTIVER QUAND FIREBASE EST PRÊT
   ============================================================
   Décommente ce bloc et configure firebase-config.js
   pour charger les vrais biens depuis Firestore.

   import { db } from '../js/firebase-config.js';
   import {
     collection, getDocs, query,
     orderBy, limit, where
   } from 'firebase/firestore';

   async function chargerBiensFirebase() {
     const loader = document.getElementById('loaderWrap');
     if (loader) loader.style.display = 'flex';

     try {
       const q = query(
         collection(db, 'properties'),
         orderBy('createdAt', 'desc'),
         limit(9)
       );

       const snapshot = await getDocs(q);
       const biens = [];

       snapshot.forEach((doc) => {
         biens.push({ id: doc.id, ...doc.data() });
       });

       biensFiltres = biens;
       afficherBiens(biensFiltres, biensAffichesCount);

     } catch (error) {
       console.error('Erreur Firebase :', error);
     } finally {
       if (loader) loader.style.display = 'none';
     }
   }

   chargerBiensFirebase();
   ============================================================ */