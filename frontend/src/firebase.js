import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA1ymzGg_caHVcNQrxfxFJO3YLW3_7JJME",
  authDomain: "info-radar-13eb7.firebaseapp.com",
  projectId: "info-radar-13eb7",
  storageBucket: "info-radar-13eb7.appspot.com",
  messagingSenderId: "573126407527",
  appId: "1:573126407527:web:b75e72f4827ae345216bc2",
  measurementId: "G-G8FMP4XZBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
