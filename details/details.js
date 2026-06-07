/* ================================================================
   KAZA237 — JavaScript de la page Détail d'un bien
   VERSION SIMPLE ET ROBUSTE — Débogée avec console.log
   ================================================================ */

import { db } from '../js/firebase-config.js';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

console.log('✅ details.js chargé');

/* ============================================================
   EXTENSIONS DES IMAGES
   ============================================================ */
const EXTENSIONS = ['png', 'png', 'jpg', 'jpg', 'png', 'jpg', 'png', 'jpg'];

function genererNomImage(index) {
  const ext = EXTENSIONS[index] || 'png';
  return `/assets/images/bien${index + 1}.${ext}`;
}

/* ============================================================
   RÉCUPÉRER L'ID DE L'URL
   ============================================================ */
function getIdDepuisURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  console.log('🔍 ID depuis URL:', id);
  return id;
}

/* ============================================================
   CHARGER LE BIEN DEPUIS FIREBASE
   ============================================================ */
async function chargerBienFirebase(id) {
  try {
    console.log('📥 Chargement du bien ID:', id);

    // Récupérer le bien spécifique
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error('❌ Bien non trouvé:', id);
      alert('Bien non trouvé');
      return;
    }

    const bien = { id: docSnap.id, ...docSnap.data() };
    console.log('✅ Bien trouvé:', bien);

    // Récupérer TOUS les biens pour trouver l'index
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    let tousLesBiens = [];

    snapshot.forEach(doc => {
      tousLesBiens.push({ id: doc.id, ...doc.data() });
    });

    console.log('📊 Total biens dans Firebase:', tousLesBiens.length);

    // Trouver l'index
    const indexActuel = tousLesBiens.findIndex(b => b.id === id);
    console.log('🔢 Index du bien:', indexActuel);

    // Ajouter les images
    bien.image = genererNomImage(indexActuel);
    bien.images = [
      genererNomImage(indexActuel),
      genererNomImage((indexActuel + 1) % tousLesBiens.length),
      genererNomImage((indexActuel + 2) % tousLesBiens.length)
    ];

    console.log('🖼️ Images générées:', bien.images);

    // AFFICHER LES DONNÉES
    afficherDonnesBien(bien);

    // CHARGER LES SIMILAIRES
    chargerBiensSimilaires(bien.type, id, indexActuel, tousLesBiens);

  } catch (error) {
    console.error('❌ Erreur Firebase:', error);
  }
}

/* ============================================================
   AFFICHER LES DONNÉES DU BIEN
   ============================================================ */
function afficherDonnesBien(bien) {
  console.log('📋 Affichage du bien:', bien.typeAffiche);

  // Title
  document.title = bien.typeAffiche + ' — Kaza237';

  // Fil d'ariane
  const filArianeTitre = document.getElementById('filArianeTitre');
  if (filArianeTitre) {
    filArianeTitre.textContent = bien.typeAffiche;
    console.log('✅ Fil d\'ariane mis à jour');
  }

  // Type
  const detailType = document.getElementById('detailType');
  if (detailType) {
    detailType.textContent = bien.typeAffiche;
    console.log('✅ Type mis à jour:', bien.typeAffiche);
  }

  // Titre
  const detailTitre = document.getElementById('detailTitre');
  if (detailTitre) {
    detailTitre.textContent = bien.typeAffiche;
    console.log('✅ Titre mis à jour');
  }

  // Lieu
  const detailLieu = document.getElementById('detailLieu');
  if (detailLieu) {
    detailLieu.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + 
      bien.villeAffiche + ', ' + bien.quartier;
    console.log('✅ Lieu mis à jour:', bien.villeAffiche + ', ' + bien.quartier);
  }

  // Prix
  const detailPrix = document.getElementById('detailPrix');
  if (detailPrix) {
    detailPrix.innerHTML = bien.prixAffiche + ' <span>' + bien.unite + '</span>';
    console.log('✅ Prix mis à jour:', bien.prixAffiche);
  }

  // Description
  const detailDescription = document.getElementById('detailDescription');
  if (detailDescription) {
    detailDescription.textContent = bien.description || 'Pas de description';
    console.log('✅ Description mise à jour');
  }

  // Mettre à jour le slider
  mettreAJourSlider(bien.images);
}

/* ============================================================
   METTRE À JOUR LE SLIDER
   ============================================================ */
function mettreAJourSlider(images) {
  console.log('🎬 Mise à jour du slider avec', images.length, 'images');

  const swiperWrapper = document.querySelector('.swiper-detail .swiper-wrapper');
  if (!swiperWrapper) {
    console.warn('⚠️ Swiper wrapper non trouvé');
    return;
  }

  swiperWrapper.innerHTML = '';

  images.forEach(function(src, index) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="detail-slide">
        <img src="${src}" alt="Photo ${index + 1}" 
             onerror="this.src='/assets/images/bien1.png'" 
             style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    `;
    swiperWrapper.appendChild(slide);
  });

  console.log('✅ Slider HTML mis à jour');

  // Réinitialiser Swiper
  setTimeout(initialiserSlider, 200);
}

/* ============================================================
   CHARGER LES BIENS SIMILAIRES
   ============================================================ */
async function chargerBiensSimilaires(type, idActuel, indexActuel, tousLesBiens) {
  console.log('🔄 Chargement des biens similaires de type:', type);

  const loader = document.getElementById('loaderSimilaires');
  const container = document.getElementById('similairesList');

  if (!container) {
    console.warn('⚠️ Container similaires non trouvé');
    return;
  }

  try {
    const similaires = tousLesBiens
      .filter(b => b.typeAffiche === typeAffiche && b.id !== idActuel)
      .slice(0, 3);

    console.log('📊 Biens similaires trouvés:', similaires.length);

    if (loader) loader.style.display = 'none';

    if (similaires.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Aucun bien similaire.</p>';
      return;
    }

    container.innerHTML = '';

    similaires.forEach(function(bien) {
      const indexBien = tousLesBiens.findIndex(b => b.id === bien.id);
      const imageBien = genererNomImage(indexBien);

      const carte = document.createElement('a');
      carte.href = './details.html?id=' + bien.id;
      carte.className = 'carte-similaire';
      carte.innerHTML = `
        <div class="similaire-image">
          <img src="${imageBien}" alt="${bien.typeAffiche}" 
               onerror="this.src='/assets/images/bien1.png'" 
               style="width: 100%; height: 100%; object-fit: cover;" />
          <div class="similaire-badge-type">${bien.typeAffiche}</div>
        </div>
        <div class="similaire-corps">
          <div class="similaire-type">${bien.typeAffiche}</div>
          <div class="similaire-titre">${bien.typeAffiche}</div>
          <div class="similaire-prix">${bien.prixAffiche} <span>${bien.unite}</span></div>
          <div class="similaire-lieu">
            <i class="fa-solid fa-location-dot"></i> ${bien.villeAffiche}, ${bien.quartier}
          </div>
        </div>
      `;
      container.appendChild(carte);
    });

    console.log('✅ Biens similaires affichés');

  } catch (error) {
    console.error('❌ Erreur biens similaires:', error);
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
    console.warn('⚠️ Swiper non disponible');
    return;
  }

  try {
    // Détruire l'ancien Swiper s'il existe
    const swiperElement = document.querySelector('.swiper-detail');
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy();
    }

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
    console.log('✅ Swiper initialisé');
  } catch (error) {
    console.warn('⚠️ Erreur Swiper:', error);
  }
}

/* ============================================================
   INITIALISATION AU CHARGEMENT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Page détails prête');

  const id = getIdDepuisURL();

  if (id) {
    chargerBienFirebase(id);
  } else {
    console.error('❌ Pas d\'ID dans l\'URL');
    alert('Bien non trouvé');
  }

  // Lien de retour
  const lienRetour = document.getElementById('lienRetour');
  if (lienRetour) {
    const referrer = document.referrer;
    if (referrer.includes('reservations')) {
      lienRetour.href = '../réservations/index.html';
    } else {
      lienRetour.href = '../annonces/index.html';
    }
  }
});

/* ============================================================
   RENDRE LES FONCTIONS ACCESSIBLES
   ============================================================ */
window.envoyerDemande = envoyerDemande;

console.log('✅ details.js complètement chargé');