// Firebase Integration Service for GeoProspector
// Isolated per-user storage in Firestore & Google Authentication

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

let firebaseApp = null;
let auth = null;
let db = null;
let currentUser = null;
let configData = null;

export async function initFirebase() {
  try {
    const resp = await fetch('/firebase-applet-config.json');
    configData = await resp.json();
  } catch (err) {
    console.warn('Could not load /firebase-applet-config.json, using fallback config', err);
    configData = {
      projectId: "project-65e76674-5f87-4022-b14",
      appId: "1:666784549676:web:43b8468f76a893674e7a89",
      apiKey: "AIzaSyAD83vOdMtqJxUbPUaG9EibKf8VVTktp9c",
      authDomain: "project-65e76674-5f87-4022-b14.firebaseapp.com",
      firestoreDatabaseId: "ai-studio-mapeadorclientes-cbab7559-d0a8-42d5-b7ec-079d0b2b68d5",
      storageBucket: "project-65e76674-5f87-4022-b14.firebasestorage.app",
      messagingSenderId: "666784549676"
    };
  }

  const firebaseConfig = {
    apiKey: configData.apiKey,
    authDomain: configData.authDomain,
    projectId: configData.projectId,
    storageBucket: configData.storageBucket,
    messagingSenderId: configData.messagingSenderId,
    appId: configData.appId
  };

  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  
  // Connect to the specific database instance
  if (configData.firestoreDatabaseId && configData.firestoreDatabaseId !== '(default)') {
    db = getFirestore(firebaseApp, configData.firestoreDatabaseId);
  } else {
    db = getFirestore(firebaseApp);
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (e) {
    console.warn('Persistence warning:', e);
  }

  return { firebaseApp, auth, db };
}

export function subscribeAuthState(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
}

export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  currentUser = result.user;
  return result.user;
}

export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
  currentUser = null;
}

export function getCurrentUser() {
  return currentUser;
}

// ----------------------------------------------------
// PLACES / CRM OPERATIONS PER USER
// ----------------------------------------------------

export async function fetchUserPlaces(userId) {
  if (!db || !userId) return [];
  try {
    const placesCol = collection(db, 'users', userId, 'places');
    const snap = await getDocs(placesCol);
    if (snap.empty) {
      return [];
    }
    const places = [];
    snap.forEach(d => {
      places.push({ id: d.id, ...d.data() });
    });
    return places;
  } catch (err) {
    console.error('Error fetching user places from Firestore:', err);
    throw err;
  }
}

export async function saveUserPlace(userId, place) {
  if (!db || !userId || !place || !place.id) return;
  try {
    const placeRef = doc(db, 'users', userId, 'places', place.id);
    const cleanPlace = { ...place };
    delete cleanPlace.id; // doc id is place.id
    cleanPlace.updatedAt = Date.now();
    await setDoc(placeRef, cleanPlace, { merge: true });
  } catch (err) {
    console.error(`Error saving place ${place.id} to Firestore:`, err);
    throw err;
  }
}

export async function saveUserPlacesBatch(userId, placesList) {
  if (!db || !userId || !placesList || placesList.length === 0) return;
  try {
    // Firestore batch limit is 500
    const chunks = [];
    for (let i = 0; i < placesList.length; i += 400) {
      chunks.push(placesList.slice(i, i + 400));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const place of chunk) {
        if (!place.id) continue;
        const placeRef = doc(db, 'users', userId, 'places', place.id);
        const cleanPlace = { ...place };
        delete cleanPlace.id;
        cleanPlace.updatedAt = Date.now();
        batch.set(placeRef, cleanPlace, { merge: true });
      }
      await batch.commit();
    }
  } catch (err) {
    console.error('Error saving places batch to Firestore:', err);
    throw err;
  }
}

export async function deleteUserPlace(userId, placeId) {
  if (!db || !userId || !placeId) return;
  try {
    const placeRef = doc(db, 'users', userId, 'places', placeId);
    await deleteDoc(placeRef);
  } catch (err) {
    console.error(`Error deleting place ${placeId}:`, err);
    throw err;
  }
}

export async function clearAllUserPlaces(userId) {
  if (!db || !userId) return;
  try {
    const placesCol = collection(db, 'users', userId, 'places');
    const snap = await getDocs(placesCol);
    if (snap.empty) return;
    const batch = writeBatch(db);
    snap.forEach(d => {
      batch.delete(d.ref);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error clearing user places in Firestore:', err);
  }
}

// ----------------------------------------------------
// SAVED SEARCHES / LISTAS PER USER
// ----------------------------------------------------

export async function fetchUserSavedSearches(userId) {
  if (!db || !userId) return [];
  try {
    const searchesCol = collection(db, 'users', userId, 'saved_searches');
    const q = query(searchesCol, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const searches = [];
    snap.forEach(d => {
      searches.push({ id: d.id, ...d.data() });
    });
    return searches;
  } catch (err) {
    console.error('Error fetching saved searches:', err);
    // If index or order error, fallback without ordering
    try {
      const searchesCol = collection(db, 'users', userId, 'saved_searches');
      const snap = await getDocs(searchesCol);
      const searches = [];
      snap.forEach(d => searches.push({ id: d.id, ...d.data() }));
      return searches.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (e) {
      return [];
    }
  }
}

export async function saveUserSearch(userId, searchData) {
  if (!db || !userId || !searchData) return null;
  try {
    const searchId = searchData.id || `search_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const searchRef = doc(db, 'users', userId, 'saved_searches', searchId);
    
    const payload = {
      id: searchId,
      name: searchData.name || 'Búsqueda sin nombre',
      query: searchData.query || '',
      category: searchData.category || 'all',
      placeIds: searchData.placeIds || [],
      placesCount: searchData.placesCount || (searchData.placeIds ? searchData.placeIds.length : 0),
      createdAt: searchData.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    await setDoc(searchRef, payload, { merge: true });
    return payload;
  } catch (err) {
    console.error('Error saving user search:', err);
    throw err;
  }
}

export async function deleteUserSearch(userId, searchId) {
  if (!db || !userId || !searchId) return;
  try {
    const searchRef = doc(db, 'users', userId, 'saved_searches', searchId);
    await deleteDoc(searchRef);
  } catch (err) {
    console.error(`Error deleting search ${searchId}:`, err);
    throw err;
  }
}

// ----------------------------------------------------
// USER SETTINGS PER USER
// ----------------------------------------------------

export async function fetchUserSettings(userId) {
  if (!db || !userId) return null;
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'config');
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Error fetching user settings:', err);
    return null;
  }
}

export async function saveUserSettings(userId, settings) {
  if (!db || !userId || !settings) return;
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'config');
    await setDoc(settingsRef, { ...settings, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.error('Error saving user settings:', err);
    throw err;
  }
}
