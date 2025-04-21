import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALmbcFtrclIqDo2KsDazhxIyVKjWV8kuI",
  authDomain: "pcpro-3faad.firebaseapp.com",
  projectId: "pcpro-3faad",
  storageBucket: "pcpro-3faad.firebasestorage.app",
  messagingSenderId: "391189413145",
  appId: "1:391189413145:web:adc837267820937e8a9988",
  measurementId: "G-H1K5851RT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 