import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

// Read .env manually
const envPath = "./.env";
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  const papersSnap = await getDocs(collection(db, "papers"));
  console.log("=== PAPERS ===");
  papersSnap.forEach(d => {
    console.log(d.id, JSON.stringify(d.data()));
  });

  const videosSnap = await getDocs(collection(db, "videos"));
  console.log("=== VIDEOS ===");
  videosSnap.forEach(d => {
    console.log(d.id, JSON.stringify(d.data()));
  });
} catch (err) {
  console.error(err);
}
