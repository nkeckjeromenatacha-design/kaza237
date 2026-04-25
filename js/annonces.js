/* ================================================================
   KAZA237 — JavaScript de la page Annonces
   Fichier : js/annonces.js
   ================================================================ */

/* ============================================================
   IMPORTS
   ============================================================ */
import { toggleMenu } from './app.js';
import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";


/* ============================================================
   1. QUARTIERS PAR VILLE
   ============================================================ */
const quartierParVille = {
  douala: [
    'Akwa', 'Bonanjo', 'Bonapriso', 'Bonamoussadi',
    'Kotto', 'Makepe', 'Ndokoti', 'Bali', 'Deïdo', 'Logbessou',
  ],
  yaounde: [
    'Bastos', 'Centre-ville', 'Melen', 'Essos',
    'Biyem-Assi', 'Emana', 'Nlongkak', 'Omnisports', 'Tsinga', 'Nkolbisson',
  ],
};

function chargerQuartiers() {
  const selectVille    = document.getElementById('filtre-ville');
  const selectQuartier = document.getElementById('filtre-quartier');
  const villeChoisie   = selectVille.value;

  selectQuartier.innerHTML = '<option value="">Tous les quartiers</option>';

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
   2. DONNÉES DE TEST
   ============================================================ */
const biensDemoData = [
  {
    id: '1',
    titre: 'Villa 4 chambres avec piscine',
    type: 'maison-villa',
    prix: 180000000,
    prixAffiche: '180 000 000',
    unite: 'FCFA',
    ville: 'douala',
    quartier: 'Bonapriso',
    featured: true,
    image: '../assets/images/bien1.jpg',
    whatsapp: 'Je suis intéressé(e) par la Villa 4 chambres avec piscine à Douala Bonapriso.',
  },
  {
    id: '2',
    titre: 'Appartement 3 pièces standing',
    type: 'appartement',
    prix: 85000000,
    prixAffiche: '85 000 000',
    unite: 'FCFA',
    ville: 'yaounde',
    quartier: 'Bastos',
    featured: true,
    image: '../assets/images/bien2.jpg',
    whatsapp: "Je suis intéressé(e) par l'Appartement 3 pièces à Yaoundé Bastos.",
  },
  {
    id: '3',
    titre: 'Studio moderne tout équipé',
    type: 'studio-moderne',
    prix: 120000,
    prixAffiche: '120 000',
    unite: 'FCFA / mois',
    ville: 'douala',
    quartier: 'Akwa',
    featured: true,
    image: '../assets/images/bien3.jpg',
    whatsapp: 'Je suis intéressé(e) par le Studio moderne à Douala Akwa.',
  },
  {
    id: '4',
    titre: 'Terrain vue mer, titre foncier',
    type: 'terrain',
    prix: 45000000,
    prixAffiche: '45 000 000',
    unite: 'FCFA',
    ville: 'douala',
    quartier: 'Bord de mer',
    featured: false,
    image: '../assets/images/bien4.jpg',
    whatsapp: 'Je suis intéressé(e) par le Terrain vue mer à Kribi.',
  },
  {
    id: '5',
    titre: 'Plateau open space avec parking',
    type: 'bureau',
    prix: 300000,
    prixAffiche: '300 000',
    unite: 'FCFA / mois',
    ville: 'yaounde',
    quartier: 'Centre-ville',
    featured: false,
    image: '../assets/images/bien5.jpg',
    whatsapp: 'Je suis intéressé(e) par le Bureau open space à Yaoundé Centre.',
  },
  {
    id: '6',
    titre: 'Appartement moderne à Bonamoussadi',
    type: 'appartement',
    prix: 150000,
    prixAffiche: '150 000',
    unite: 'FCFA / mois',
    ville: 'douala',
    quartier: 'Bonamoussadi',
    featured: true,
    image: '../assets/images/bien6.jpg',
    whatsapp: "Je suis intéressé(e) par l'Appartement à Douala Bonamoussadi.",
  },
];

const BIENS_PAR_PAGE   = 6;
let biensAffichesCount = BIENS_PAR_PAGE;
let biensFiltres       = [...biensDemoData];


/* ============================================================
   3. AFFICHER LES CARTES
   ============================================================ */
function afficherBiens(biens, nombreAafficher) {
  const container     = document.getElementById('biensList');
  const compteur      = document.getElementById('compteurResultats');
  const aucunResultat = document.getElementById('aucunResultat');
  const voirPlusWrap  = document.getElementById('voirPlusWrap');

  container.innerHTML = '';

  if (biens.length === 0) {
    aucunResultat.style.display = 'flex';
    voirPlusWrap.style.display  = 'none';
    compteur.textContent        = '0 bien trouvé';
    return;
  }

  aucunResultat.style.display = 'none';

  const total = biens.length;
  compteur.textContent = total + ' bien' + (total > 1 ? 's' : '') + ' trouvé' + (total > 1 ? 's' : '');

  biens.slice(0, nombreAafficher).forEach(function(bien) {

    const badgeDisponible = bien.featured
      ? `<div class="badge-disponible">
           <i class="fa-solid fa-circle-check"></i> Disponible
         </div>`
      : '';

    const msgWA = encodeURIComponent('Bonjour Kaza237, ' + bien.whatsapp);

    const carteHTML = `
      <div class="carte-bien">
        <div class="carte-image">
          <img src="${bien.image}"
               alt="${bien.titre}"
               onerror="this.src='../assets/images/placeholder.jpg'" />
          ${badgeDisponible}
          <div class="badge-type">${formaterType(bien.type)}</div>
        </div>
        <div class="carte-corps">
          <div class="carte-type">${formaterType(bien.type)}</div>
          <h3 class="carte-titre">${bien.titre}</h3>
          <div class="carte-prix">
            ${bien.prixAffiche} <span>${bien.unite}</span>
          </div>
          <div class="carte-lieu">
            <i class="fa-solid fa-location-dot"></i>
            ${capitaliser(bien.ville)}, ${bien.quartier}
          </div>
          <div class="carte-actions">
            <a href="../detail.html?id=${bien.id}" class="btn-voir-details">
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

  voirPlusWrap.style.display = nombreAafficher >= total ? 'none' : 'block';
}


/* ============================================================
   UTILITAIRES
   ============================================================ */
function formaterType(type) {
  const types = {
    'appartement'       : 'Appartement',
    'studio-moderne'    : 'Studio moderne',
    'chambre-moderne'   : 'Chambre moderne',
    'terrain'           : 'Terrain à vendre',
    'maison-villa'      : 'Maison / Villa',
    'bureau'            : 'Bureau',
    'commerce'          : 'Commerce',
    'studio-meuble'     : 'Studio meublé',
    'chambre-meuble'    : 'Chambre meublée',
    'appartement-meuble': 'Appartement meublé',
  };
  return types[type] || type;
}

function capitaliser(texte) {
  if (!texte) return '';
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}


/* ============================================================
   4. CHARGER DEPUIS FIREBASE
   ============================================================ */
async function chargerBiensFirebase() {
  try {
    const params    = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');

    let q;

    if (typeParam) {
      q = query(
        collection(db, 'properties'),
        where('type', '==', typeParam),
        orderBy('createdAt', 'desc')
      );

      document.getElementById('filtre-type').value = typeParam;
      document.querySelectorAll('.btn-categorie').forEach(function(btn) {
        btn.classList.remove('actif');
        if (btn.getAttribute('onclick') &&
            btn.getAttribute('onclick').includes(typeParam)) {
          btn.classList.add('actif');
        }
      });

    } else {
      q = query(
        collection(db, 'properties'),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    biensFiltres   = [];

    snapshot.forEach(function(doc) {
      biensFiltres.push({ id: doc.id, ...doc.data() });
    });

    /* Si Firebase vide → données de démo */
    if (biensFiltres.length === 0) {
      afficherBiens(biensDemoData, biensAffichesCount);
    } else {
      afficherBiens(biensFiltres, biensAffichesCount);
    }

  } catch (error) {
    console.error('Erreur Firebase :', error);
    /* En cas d'erreur → données de démo */
    afficherBiens(biensDemoData, biensAffichesCount);
  }
}


/* ============================================================
   5. FILTRER LES BIENS
   ============================================================ */
async function filtrerBiens() {
  const ville    = document.getElementById('filtre-ville').value;
  const quartier = document.getElementById('filtre-quartier').value;
  const type     = document.getElementById('filtre-type').value;
  const prixMax  = parseInt(document.getElementById('filtre-prix').value) || null;

  try {
    let conditions = [];
    if (type)  conditions.push(where('type',  '==', type));
    if (ville) conditions.push(where('ville', '==', ville));

    const q = conditions.length > 0
      ? query(collection(db, 'properties'), ...conditions, orderBy('createdAt', 'desc'))
      : query(collection(db, 'properties'), orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    biensFiltres   = [];

    snapshot.forEach(function(doc) {
      biensFiltres.push({ id: doc.id, ...doc.data() });
    });

    if (prixMax) {
      biensFiltres = biensFiltres.filter(function(b) {
        return b.prix <= prixMax;
      });
    }

    if (quartier) {
      biensFiltres = biensFiltres.filter(function(b) {
        return b.quartier &&
               b.quartier.toLowerCase().replace(/\s+/g, '-') === quartier;
      });
    }

    biensAffichesCount = BIENS_PAR_PAGE;
    afficherBiens(biensFiltres, biensAffichesCount);

  } catch (error) {
    console.error('Erreur filtre :', error);
  }

  document.querySelector('.section-annonces').scrollIntoView({ behavior: 'smooth' });
}


/* ============================================================
   FILTRER PAR CATÉGORIE
   ============================================================ */
async function filtrerParCategorie(bouton, type) {
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  bouton.classList.add('actif');
  document.getElementById('filtre-type').value = type;

  try {
    const q = type === ''
      ? query(collection(db, 'properties'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'properties'), where('type', '==', type), orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    biensFiltres   = [];

    snapshot.forEach(function(doc) {
      biensFiltres.push({ id: doc.id, ...doc.data() });
    });

    biensAffichesCount = BIENS_PAR_PAGE;
    afficherBiens(biensFiltres, biensAffichesCount);

  } catch (error) {
    console.error('Erreur catégorie :', error);
  }
}


/* ============================================================
   RÉINITIALISER
   ============================================================ */
function reinitialiserFiltres() {
  document.getElementById('filtre-ville').value    = '';
  document.getElementById('filtre-quartier').value = '';
  document.getElementById('filtre-type').value     = '';
  document.getElementById('filtre-prix').value     = '';

  chargerQuartiers();

  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  document.querySelector('.btn-categorie').classList.add('actif');

  biensFiltres       = [...biensDemoData];
  biensAffichesCount = BIENS_PAR_PAGE;
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   VOIR PLUS
   ============================================================ */
function chargerPlusDeBiens() {
  biensAffichesCount += BIENS_PAR_PAGE;
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   INITIALISATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  const params     = new URLSearchParams(window.location.search);
  const villeParam = params.get('ville');

  if (villeParam) {
    document.getElementById('filtre-ville').value = villeParam;
    chargerQuartiers();
  }

  /* Charger les biens immédiatement */
  chargerBiensFirebase();
});


/* ============================================================
   RENDRE LES FONCTIONS ACCESSIBLES DEPUIS LE HTML
   ============================================================ */
window.toggleMenu           = toggleMenu;
window.chargerQuartiers     = chargerQuartiers;
window.filtrerBiens         = filtrerBiens;
window.filtrerParCategorie  = filtrerParCategorie;
window.reinitialiserFiltres = reinitialiserFiltres;
window.chargerPlusDeBiens   = chargerPlusDeBiens;