import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ================================================================
   KAZA237 — JavaScript de la page Réservations
   Fichier : js/reservations.js
   ================================================================
   CE FICHIER CONTIENT :
   1. Les données des logements (en attendant Firebase)
   2. Le filtrage des logements
   3. Le formulaire de réservation → WhatsApp
   4. L'affichage dynamique des dates selon le type
   5. La sauvegarde dans Firebase (à activer)
   ================================================================ */
 
 
/* ============================================================
   1. DONNÉES DES LOGEMENTS (exemples — seront remplacés par Firebase)
   MODIFIE CES DONNÉES pour changer les logements affichés
   ============================================================ */
const logementsData = [
  {
    id: 'studio1',
    titre: 'Studio moderne tout équipé',
    type: 'studio-meuble',
    prix: 15000,
    prixAffiche: '15 000',
    ville: 'douala',
    quartier: 'Akwa',
    statut: 'disponible', /* "disponible" ou "occupe" */
    image: 'assets/images/studio1.jpg',
    equipements: ['Wifi', 'Clim', 'TV', 'Groupe élec.'],
    numero: '#001',
    whatsapp: 'Studio moderne tout équipé à Douala Akwa',
  },
  {
    id: 'chambre1',
    titre: 'Chambre haut standing Bastos',
    type: 'chambre-meuble',
    prix: 10000,
    prixAffiche: '10 000',
    ville: 'yaounde',
    quartier: 'Bastos',
    statut: 'disponible',
    image: 'assets/images/studio2.jpg',
    equipements: ['Wifi', 'Clim', 'Salle de bain'],
    numero: '#002',
    whatsapp: 'Chambre haut standing à Yaoundé Bastos',
  },
  {
    id: 'appt1',
    titre: 'Appartement haut standing Bonapriso',
    type: 'appartement-meuble',
    prix: 35000,
    prixAffiche: '35 000',
    ville: 'douala',
    quartier: 'Bonapriso',
    statut: 'occupe', /* Déjà occupé */
    image: 'assets/images/appt1.jpg',
    equipements: ['Wifi', 'Clim', 'TV', 'Parking'],
    numero: '#003',
    whatsapp: 'Appartement haut standing à Douala Bonapriso',
  },
  {
    id: 'studio3',
    titre: 'Studio cosy Omnisports',
    type: 'studio-meuble',
    prix: 12000,
    prixAffiche: '12 000',
    ville: 'yaounde',
    quartier: 'Omnisports',
    statut: 'disponible',
    image: 'assets/images/studio3.jpg',
    equipements: ['Wifi', 'Clim', 'Groupe élec.'],
    numero: '#004',
    whatsapp: 'Studio cosy à Yaoundé Omnisports',
  },
  {
    id: 'appt2',
    titre: 'Appartement moderne Bonamoussadi',
    type: 'appartement-meuble',
    prix: 25000,
    prixAffiche: '25 000',
    ville: 'douala',
    quartier: 'Bonamoussadi',
    statut: 'disponible',
    image: 'assets/images/appt2.jpg',
    equipements: ['Wifi', 'Clim', 'TV', 'Groupe élec.'],
    numero: '#005',
    whatsapp: "Appartement moderne à Douala Bonamoussadi",
  },
  {
    id: 'chambre2',
    titre: 'Chambre meublée Makepe',
    type: 'chambre-meuble',
    prix: 8000,
    prixAffiche: '8 000',
    ville: 'douala',
    quartier: 'Makepe',
    statut: 'disponible',
    image: 'assets/images/chambre1.jpg',
    equipements: ['Wifi', 'Clim', 'Salle de bain'],
    numero: '#006',
    whatsapp: 'Chambre meublée à Douala Makepe',
  },
];
 
/* Nombre de logements affichés par page */
const LOGEMENTS_PAR_PAGE = 6;
let logementsAffiches = LOGEMENTS_PAR_PAGE;
let logementsFiltres = [...logementsData];
 
 
/* ============================================================
   2. AFFICHER LES CARTES DE LOGEMENTS
   ============================================================ */
function afficherLogements(logements, nombre) {
  const container     = document.getElementById('logementsList');
  const compteur      = document.getElementById('compteurResa');
  const aucunResultat = document.getElementById('aucunResultatResa');
  const voirPlusWrap  = document.getElementById('voirPlusResaWrap');
 
  container.innerHTML = '';
 
  if (logements.length === 0) {
    aucunResultat.style.display = 'flex';
    voirPlusWrap.style.display  = 'none';
    compteur.textContent        = '0 logement trouvé';
    return;
  }
 
  aucunResultat.style.display = 'none';
 
  const total    = logements.length;
  const affiches = Math.min(nombre, total);
  compteur.textContent = total + ' logement' + (total > 1 ? 's' : '') + ' trouvé' + (total > 1 ? 's' : '');
 
  logements.slice(0, nombre).forEach(function(logement) {
 
    /* Badge disponibilité */
    const estDisponible = logement.statut === 'disponible';
 
    const badgeDispo = estDisponible
      ? `<div class="badge-dispo disponible">
           <i class="fa-solid fa-circle-check"></i> Disponible
         </div>`
      : `<div class="badge-dispo occupe">
           <i class="fa-solid fa-circle-xmark"></i> Déjà occupé
         </div>`;
 
    /* Équipements */
    const equipements = logement.equipements.map(function(eq) {
      const icones = {
        'Wifi': 'fa-wifi', 'Clim': 'fa-wind', 'TV': 'fa-tv',
        'Groupe élec.': 'fa-plug', 'Parking': 'fa-car',
        'Salle de bain': 'fa-shower',
      };
      const icone = icones[eq] || 'fa-check';
      return `<span><i class="fa-solid ${icone}"></i> ${eq}</span>`;
    }).join('');
 
    /* Bouton réserver ou désactivé */
    const msgWA = encodeURIComponent(
      "J'aimerais faire une réservation pour le/la " + logement.whatsapp + '.'
    );
 
    const btnReserver = estDisponible
      ? `<a href="https://wa.me/237656155803?text=${msgWA}"
            target="_blank" class="btn-reserver">
           <i class="fa-solid fa-calendar-check"></i> Réserver
         </a>`
      : `<button class="btn-reserver desactive" disabled>
           <i class="fa-solid fa-ban"></i> Déjà occupé
         </button>`;
 
    /* Type formaté */
    const typesFormats = {
      'studio-meuble'      : 'Studio meublé',
      'chambre-meuble'     : 'Chambre meublée',
      'appartement-meuble' : 'Appartement meublé',
    };
    const typeAffiche = typesFormats[logement.type] || logement.type;
 
    /* Ville formatée */
    const villeAffiche = logement.ville === 'douala' ? 'Douala' : 'Yaoundé';
 
    container.innerHTML += `
      <div class="carte-logement">
        <div class="carte-logement-image">
          <img src="${logement.image}" alt="${logement.titre}"
               onerror="this.src='assets/images/placeholder.jpg'" />
          ${badgeDispo}
          <div class="badge-type-logement">${typeAffiche}</div>
          <div class="badge-numero">${logement.numero}</div>
        </div>
        <div class="carte-logement-corps">
          <div class="logement-type">${typeAffiche}</div>
          <h3 class="logement-titre">${logement.titre}</h3>
          <div class="logement-prix">
            ${logement.prixAffiche} <span>FCFA / nuit</span>
          </div>
          <div class="logement-lieu">
            <i class="fa-solid fa-location-dot"></i>
            ${villeAffiche}, ${logement.quartier}
          </div>
          <div class="logement-equipements">${equipements}</div>
          <div class="logement-actions">
            ${btnReserver}
            <a href="detail.html?id=${logement.id}" class="btn-voir-logement">
              <i class="fa-solid fa-eye"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  });
 
  voirPlusWrap.style.display = nombre >= total ? 'none' : 'block';
}
 
 
/* ============================================================
   3. FILTRER LES LOGEMENTS
   ============================================================ */
function filtrerReservations() {
  const ville  = document.getElementById('resa-ville').value;
  const type   = document.getElementById('resa-type').value;
  const prix   = parseInt(document.getElementById('resa-prix').value) || null;
 
  logementsFiltres = logementsData.filter(function(logement) {
    if (ville && logement.ville !== ville) return false;
    if (type  && logement.type  !== type)  return false;
    if (prix  && logement.prix  > prix)    return false;
    return true;
  });
 
  logementsAffiches = LOGEMENTS_PAR_PAGE;
  afficherLogements(logementsFiltres, logementsAffiches);
 
  document.querySelector('.section-reservations').scrollIntoView({
    behavior: 'smooth'
  });
}
 
/* Filtrer par catégorie (onglets) */
function filtrerParCategorieResa(bouton, type) {
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  bouton.classList.add('actif');
 
  document.getElementById('resa-type').value = type;
  filtrerReservations();
}
 
/* Réinitialiser les filtres */
function reinitialiserFiltresResa() {
  document.getElementById('resa-ville').value = '';
  document.getElementById('resa-type').value  = '';
  document.getElementById('resa-prix').value  = '';
 
  document.querySelectorAll('.btn-categorie').forEach(function(btn) {
    btn.classList.remove('actif');
  });
  document.querySelector('.btn-categorie').classList.add('actif');
 
  logementsFiltres  = [...logementsData];
  logementsAffiches = LOGEMENTS_PAR_PAGE;
  afficherLogements(logementsFiltres, logementsAffiches);
}
 
/* Voir plus de logements */
function chargerPlusDeLogements() {
  logementsAffiches += LOGEMENTS_PAR_PAGE;
  afficherLogements(logementsFiltres, logementsAffiches);
}
 
 
/* ============================================================
   4. AFFICHER LES CHAMPS DE DATES SELON LE TYPE
   Studios/Chambres → calendrier (par nuit)
   Appartements     → champ texte (par mois)
   ============================================================ */
function afficherChampsDates() {
  const type       = document.getElementById('resa-type-form').value;
  const datesNuit  = document.getElementById('dates-nuit');
  const datesMois  = document.getElementById('dates-mois');
 
  /* Cacher les deux d'abord */
  datesNuit.style.display = 'none';
  datesMois.style.display = 'none';
 
  if (type === 'Studio meublé' || type === 'Chambre meublée') {
    /* Calendrier pour studios et chambres */
    datesNuit.style.display = 'grid';
  } else if (type === 'Appartement meublé') {
    /* Champ texte pour appartements */
    datesMois.style.display = 'block';
  }
}

/* ============================================================
   PRÉ-REMPLIR LE FORMULAIRE ET DÉFILER VERS LUI
   ============================================================ */
function preRemplirFormulaire(titre, type, prix) {

  /* Remplir le type de logement */
  const selectType = document.getElementById('resa-type-form');
  if (selectType) selectType.value = type;

  /* Afficher les champs de dates selon le type */
  afficherChampsDates();

  /* Remplir le budget */
  const inputBudget = document.getElementById('resa-budget');
  if (inputBudget) inputBudget.value = prix;

  /* Remplir le message avec le titre du bien */
  const inputMessage = document.getElementById('resa-message');
  if (inputMessage) {
    inputMessage.value = "Je souhaite réserver : " + titre;
  }

  /* Défiler automatiquement vers le formulaire */
  document.querySelector('.section-formulaire-resa').scrollIntoView({
    behavior: 'smooth'
  });
}
 
/* ============================================================
   5. SOUMETTRE LE FORMULAIRE → WHATSAPP
   ============================================================ */
function soumettreReservation(event) {
  event.preventDefault(); /* Empêche le rechargement de la page */
 
  /* Récupérer les valeurs du formulaire */
  const prenom    = document.getElementById('resa-prenom').value;
  const nom       = document.getElementById('resa-nom').value;
  const telephone = document.getElementById('resa-telephone').value;
  const type      = document.getElementById('resa-type-form').value;
  const budget    = document.getElementById('resa-budget').value;
  const message   = document.getElementById('resa-message').value;
 
  /* Récupérer les dates selon le type */
  let dates = '';
  if (type === 'Studio meublé' || type === 'Chambre meublée') {
    const arrivee = document.getElementById('resa-date-arrivee').value;
    const depart  = document.getElementById('resa-date-depart').value;
    if (arrivee && depart) {
      dates = 'Du ' + formaterDate(arrivee) + ' au ' + formaterDate(depart);
    }
  } else {
    dates = document.getElementById('resa-periode').value;
  }
 
  /* Construire le message WhatsApp */
  let msgWA = "J'aimerais faire une réservation.\n\n";
  msgWA += "👤 Nom complet : " + prenom + ' ' + nom + '\n';
  msgWA += "📞 Téléphone : " + telephone + '\n';
  msgWA += "🏠 Type de logement : " + type + '\n';
  if (dates)   msgWA += "📅 Période : " + dates + '\n';
  if (budget)  msgWA += "💰 Budget / nuit : " + budget + ' FCFA\n';
  if (message) msgWA += "💬 Message : " + message + '\n';
 
async function soumettreReservation(event) {
  try {
    /* Sauvegarder dans Firebase */
    await addDoc(collection(db, 'reservations'), {
      prenom,
      nom,
      telephone,
      type,
      dates,
      budget,
      message,
      statut    : 'en_attente',
      createdAt : new Date()
    });
  } catch (error) {
    console.error('Erreur sauvegarde réservation :', error);
  }

  /* Rediriger vers WhatsApp */
  const urlWA = 'https://wa.me/237656155803?text=' + encodeURIComponent(msgWA);
  window.open(urlWA, '_blank');
}
 
/* Formater une date (2025-05-01 → 01/05/2025) */
function formaterDate(dateStr) {
  if (!dateStr) return '';
  const [annee, mois, jour] = dateStr.split('-');
  return jour + '/' + mois + '/' + annee;
}
 
 
/* ============================================================
   INITIALISATION AU CHARGEMENT
   ============================================================ */
   async function chargerLogementsFirebase() {
  const loader = document.getElementById('loaderResaWrap');
  if (loader) loader.style.display = 'flex';

  try {
    const q = query(
      collection(db, 'properties'),
      where('type', 'in', [
        'studio-meuble',
        'chambre-meuble',
        'appartement-meuble'
      ]),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    logementsFiltres = [];

    snapshot.forEach(function(doc) {
      logementsFiltres.push({ id: doc.id, ...doc.data() });
    });

    afficherLogements(logementsFiltres, logementsAffiches);

  } catch (error) {
    console.error('Erreur Firebase :', error);
    afficherLogements(logementsData, logementsAffiches);

  } finally {
    if (loader) loader.style.display = 'none';
  }
}
document.addEventListener('DOMContentLoaded', function() {
 
  /* Masquer le loader et afficher les logements */
  const loader = document.getElementById('loaderResaWrap');
 
  chargerLogementsFirebase();
 
  /* Définir la date minimum = aujourd'hui pour les calendriers */
  const aujourd_hui = new Date().toISOString().split('T')[0];
  const inputArrivee = document.getElementById('resa-date-arrivee');
  const inputDepart  = document.getElementById('resa-date-depart');
 
  if (inputArrivee) inputArrivee.min = aujourd_hui;
  if (inputDepart)  inputDepart.min  = aujourd_hui;
 
  /* Quand la date d'arrivée change, le départ minimum = arrivée */
  if (inputArrivee) {
    inputArrivee.addEventListener('change', function() {
      if (inputDepart) inputDepart.min = this.value;
    });
  }
 
});
}

/* Rendre toggleMenu accessible depuis le HTML */
window.toggleMenu = toggleMenu;