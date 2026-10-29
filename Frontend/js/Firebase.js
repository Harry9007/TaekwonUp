// ================================
// FIREBASE CONFIG
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBq9cWyVbNh7k7HaAaDUnQPadHz5GeMxFI",

    authDomain: "taek-wonup.firebaseapp.com",

    projectId: "taek-wonup",

    storageBucket: "taek-wonup.firebasestorage.app",

    messagingSenderId: "1006681664265",

    appId: "1:1006681664265:web:24429edc04c0c146d3c1d8"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };