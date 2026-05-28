/* ================================================================
   KAZA237 — JavaScript de la page Annonces
   Fichier : js/annonces.js
   VERSION ALTERNATIVE — Plus robuste, gère les erreurs d'imports
   ================================================================ */

/* ============================================================
   IMPORTS — Gestion des erreurs
   ============================================================ */
let toggleMenu = window.toggleMenu; // Depuis app.js
let db = null;

// Essayer de charger Firebase
try {
  // Importer la config Firebase
  import('./firebase-config.js').then(module => {
    db = module.db;
    console.log('Firebase chargé avec succès');
  }).catch(error => {
    console.warn('Impossible de charger Firebase:', error);
    console.warn('Utilisation des données de démonstration');
  });
} catch (error) {
  console.warn('Erreur lors de l\'import Firebase:', error);
}

// Importer Firestore si ce n'est pas déjà fait
let collection, getDocs, query, orderBy, where;
try {
  import("https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js").then(module => {
    collection = module.collection;
    getDocs = module.getDocs;
    query = module.query;
    orderBy = module.orderBy;
    where = module.where;
  });
} catch (error) {
  console.warn('Firestore non disponible:', error);
}

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
  
  if (!selectVille || !selectQuartier) return;
  
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

  if (!container) {
    console.error('Conteneur biensList non trouvé');
    return;
  }

  container.innerHTML = '';

  if (biens.length === 0) {
    if (aucunResultat) aucunResultat.style.display = 'flex';
    if (voirPlusWrap) voirPlusWrap.style.display  = 'none';
    if (compteur) compteur.textContent = '0 bien trouvé';
    return;
  }

  if (aucunResultat) aucunResultat.style.display = 'none';

  const total = biens.length;
  if (compteur) {
    compteur.textContent = total + ' bien' + (total > 1 ? 's' : '') + ' trouvé' + (total > 1 ? 's' : '');
  }

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
            <a href="../details/details.html?id=${bien.id}" class="btn-voir-details">
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

  if (voirPlusWrap) {
    voirPlusWrap.style.display = nombreAafficher >= total ? 'none' : 'block';
  }
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
   4. CHARGER DEPUIS FIREBASE (avec fallback démo)
   ============================================================ */
async function chargerBiensFirebase() {
  try {
    // Si Firebase n'est pas prêt, utiliser les données de démo
    if (!db || !collection || !getDocs || !query || !orderBy) {
      console.warn('Firebase non disponible, affichage des données de démo');
      afficherBiens(biensDemoData, biensAffichesCount);
      return;
    }

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
    console.error('Erreur chargement biens :', error);
    /* En cas d'erreur → données de démo */
    afficherBiens(biensDemoData, biensAffichesCount);
  }
}


/* ============================================================
   5. FILTRER LES BIENS (filtre avancé)
   ============================================================ */
async function filtrerBiens() {
  const filtre_ville    = document.getElementById('filtre-ville');
  const filtre_quartier = document.getElementById('filtre-quartier');
  const filtre_type     = document.getElementById('filtre-type');
  const filtre_prix     = document.getElementById('filtre-prix');

  if (!filtre_ville) {
    console.error('Filtres non trouvés');
    return;
  }

  const ville    = filtre_ville.value;
  const quartier = filtre_quartier ? filtre_quartier.value : '';
  const type     = filtre_type ? filtre_type.value : '';
  const prixMax  = filtre_prix ? parseInt(filtre_prix.value) : null;

  try {
    if (!db || !collection || !getDocs || !query) {
      // Filtrer les données de démo si Firebase n'est pas disponible
      let biens = [...biensDemoData];
      
      if (type) biens = biens.filter(b => b.type === type);
      if (ville) biens = biens.filter(b => b.ville === ville);
      if (prixMax) biens = biens.filter(b => b.prix <= prixMax);
      if (quartier) {
        biens = biens.filter(b => 
          b.quartier && b.quartier.toLowerCase().replace(/\s+/g, '-') === quartier
        );
      }

      biensFiltres = biens;
      biensAffichesCount = BIENS_PAR_PAGE;
      afficherBiens(biensFiltres, biensAffichesCount);
      return;
    }

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

  const sectionAnnonces = document.querySelector('.section-annonces');
  if (sectionAnnonces) {
    sectionAnnonces.scrollIntoView({ behavior: 'smooth' });
  }
}


/* ============================================================
   6. FILTRER PAR CATÉGORIE
   ============================================================ */
async function filtrerParCategorie(bouton, type) {
  // Mettre à jour le bouton actif
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  bouton.classList.add('actif');

  // Synchroniser avec le formulaire de filtrage avancé
  const filtre_type = document.getElementById('filtre-type');
  if (filtre_type) filtre_type.value = type;
  
  // Réinitialiser les autres filtres avancés
  const filtre_ville = document.getElementById('filtre-ville');
  const filtre_quartier = document.getElementById('filtre-quartier');
  const filtre_prix = document.getElementById('filtre-prix');
  
  if (filtre_ville) filtre_ville.value = '';
  if (filtre_quartier) filtre_quartier.value = '';
  if (filtre_prix) filtre_prix.value = '';
  
  chargerQuartiers();

  try {
    if (!db || !collection || !getDocs || !query) {
      // Utiliser les données de démo
      if (type === '') {
        biensFiltres = [...biensDemoData];
      } else {
        biensFiltres = biensDemoData.filter(b => b.type === type);
      }
      biensAffichesCount = BIENS_PAR_PAGE;
      afficherBiens(biensFiltres, biensAffichesCount);
      return;
    }

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
    if (type === '') {
      biensFiltres = [...biensDemoData];
    } else {
      biensFiltres = biensDemoData.filter(b => b.type === type);
    }
    biensAffichesCount = BIENS_PAR_PAGE;
    afficherBiens(biensFiltres, biensAffichesCount);
  }

  const sectionAnnonces = document.querySelector('.section-annonces');
  if (sectionAnnonces) {
    sectionAnnonces.scrollIntoView({ behavior: 'smooth' });
  }
}


/* ============================================================
   7. SYNCHRONISER LES CATÉGORIES AVEC LE FORMULAIRE
   ============================================================ */
function synchroniserCategories() {
  const filtre_type = document.getElementById('filtre-type');
  if (!filtre_type) return;
  
  const type = filtre_type.value;
  
  let boutonTrouve = false;
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    const onclickValue = btn.getAttribute('onclick');
    if (type === '' && onclickValue && onclickValue.includes("filtrerParCategorie(this, '')")) {
      btn.click();
      boutonTrouve = true;
    } else if (type !== '' && onclickValue && onclickValue.includes(`'${type}'`)) {
      btn.click();
      boutonTrouve = true;
    }
  });

  if (!boutonTrouve && type !== '') {
    document.querySelectorAll('.btn-categorie').forEach(function(btn) {
      btn.classList.remove('actif');
    });
  }
}


/* ============================================================
   8. RÉINITIALISER
   ============================================================ */
function reinitialiserFiltres() {
  const filtre_ville = document.getElementById('filtre-ville');
  const filtre_quartier = document.getElementById('filtre-quartier');
  const filtre_type = document.getElementById('filtre-type');
  const filtre_prix = document.getElementById('filtre-prix');

  if (filtre_ville) filtre_ville.value = '';
  if (filtre_quartier) filtre_quartier.value = '';
  if (filtre_type) filtre_type.value = '';
  if (filtre_prix) filtre_prix.value = '';

  chargerQuartiers();

  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  
  const premierBouton = document.querySelector('.btn-categorie');
  if (premierBouton) premierBouton.classList.add('actif');

  biensFiltres       = [...biensDemoData];
  biensAffichesCount = BIENS_PAR_PAGE;
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   9. VOIR PLUS
   ============================================================ */
function chargerPlusDeBiens() {
  biensAffichesCount += BIENS_PAR_PAGE;
  afficherBiens(biensFiltres, biensAffichesCount);
}


/* ============================================================
   10. INITIALISATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  const params     = new URLSearchParams(window.location.search);
  const villeParam = params.get('ville');

  if (villeParam) {
    const filtre_ville = document.getElementById('filtre-ville');
    if (filtre_ville) {
      filtre_ville.value = villeParam;
      chargerQuartiers();
    }
  }

  /* Charger les biens immédiatement */
  chargerBiensFirebase();
});


/* ============================================================
   11. RENDRE LES FONCTIONS ACCESSIBLES DEPUIS LE HTML
   ============================================================ */
window.toggleMenu              = window.toggleMenu || toggleMenu;
window.chargerQuartiers        = chargerQuartiers;
window.filtrerBiens            = filtrerBiens;
window.filtrerParCategorie     = filtrerParCategorie;
window.synchroniserCategories  = synchroniserCategories;
window.reinitialiserFiltres    = reinitialiserFiltres;
window.chargerPlusDeBiens      = chargerPlusDeBiens;