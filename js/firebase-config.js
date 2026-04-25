/* ================================================================
   KAZA237 — Configuration Firebase
   Fichier : js/firebase-config.js
   ================================================================
   CE FICHIER CONTIENT :
   - La connexion à Firebase (base de données)
   - L'initialisation de Firestore (pour stocker les biens)
   - L'initialisation de Storage (pour les images)
 
   ⚠️ IMPORTANT :
   - Ne partage jamais ce fichier publiquement
   - Ne le pousse pas sur GitHub sans protection
   - Les règles de sécurité seront configurées plus tard
   ================================================================ */
 
 
/* ============================================================
   IMPORT DES MODULES FIREBASE
   On importe uniquement ce dont on a besoin
   ============================================================ */
import { initializeApp }       from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore }        from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
import { getStorage }          from "https://www.gstatic.com/firebasejs/12.12.1/firebase-storage.js";
import { getAnalytics }        from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
 
 
/* ============================================================
   CONFIGURATION FIREBASE
   Ces clés connectent ton site à ton projet Firebase
   ⚠️ Ne modifie pas ces valeurs
   ============================================================ */
const firebaseConfig = {
  apiKey           : "AIzaSyCo0ccCRNd8EDx1Byzd2TObAciqR48Ad50",
  authDomain       : "kaza237.firebaseapp.com",
  databaseURL      : "https://kaza237-default-rtdb.europe-west1.firebasedatabase.app",
  projectId        : "kaza237",
  storageBucket    : "kaza237.firebasestorage.app",
  messagingSenderId: "298677804911",
  appId            : "1:298677804911:web:f7875702b58b7bb0d0929a",
  measurementId    : "G-PXR728WWD0"
};
 
 
/* ============================================================
   INITIALISATION DE FIREBASE
   ============================================================ */
 
/* Initialise l'application Firebase */
const app = initializeApp(firebaseConfig);
 
/* Initialise Firestore — base de données pour les biens */
const db = getFirestore(app);
 
/* Initialise Storage — pour stocker les images des biens */
const storage = getStorage(app);
 
/* Initialise Analytics — pour les statistiques */
const analytics = getAnalytics(app);
 
 
/* ============================================================
   EXPORT — Permet d'utiliser db et storage dans les autres fichiers
   ============================================================ */
export { db, storage, analytics };
 
 
/* ============================================================
   STRUCTURE DE LA BASE DE DONNÉES FIRESTORE
   ============================================================
 
   📁 properties (collection des biens immobiliers)
      └── {id} (document d'un bien)
          ├── titre          : "Villa 4 chambres avec piscine"
          ├── type           : "maison-villa"
          ├── typeAffiche    : "Maison / Villa"
          ├── prix           : 180000000
          ├── prixAffiche    : "180 000 000"
          ├── unite          : "FCFA"
          ├── ville          : "douala"
          ├── villeAffiche   : "Douala"
          ├── quartier       : "Bonapriso"
          ├── statut         : "disponible" ou "occupe"
          ├── featured       : true ou false
          ├── vues           : 124
          ├── likes          : 32
          ├── datePublication: "01/04/2025"
          ├── description    : "Belle villa..."
          ├── images         : ["url1", "url2", "url3"]
          ├── caracteristiques: [{icone, label, valeur}]
          ├── equipements    : ["Wifi", "Clim", ...]
          └── createdAt      : timestamp
 
   📁 reservations (collection des réservations)
      └── {id} (document d'une réservation)
          ├── prenom     : "Natacha"
          ├── nom        : "Jerome"
          ├── telephone  : "+237 6XX XXX XXX"
          ├── type       : "Studio meublé"
          ├── dates      : "Du 01/05 au 05/05/2025"
          ├── budget     : 15000
          ├── message    : "..."
          ├── statut     : "en_attente"
          └── createdAt  : timestamp
 
   📁 contacts (collection des messages de contact)
      └── {id} (document d'un message)
          ├── prenom    : "Jean"
          ├── nom       : "Dupont"
          ├── telephone : "+237 6XX XXX XXX"
          ├── message   : "Je suis intéressé..."
          ├── bienId    : "1" (ID du bien concerné)
          ├── bienTitre : "Villa 4 chambres..."
          └── createdAt : timestamp
 
   ============================================================ */