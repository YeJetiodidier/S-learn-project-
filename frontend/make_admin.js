import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

const targetEmail = "yejetioyejetiodidier@gmail.com";

// Read .env manually
const envPath = "./.env";
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join("=").trim();
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
  const usersSnap = await getDocs(collection(db, "users"));
  const match = usersSnap.docs.find((userDoc) => {
    const email = (userDoc.data().email || "").toLowerCase();
    return email === targetEmail.toLowerCase();
  });

  if (!match) {
    console.error(`No user found with email: ${targetEmail}`);
    process.exit(1);
  }

  await updateDoc(doc(db, "users", match.id), { role: "Admin" });
  console.log(`=== ${targetEmail} elevated to Admin successfully! ===`);
  console.log(`Firestore document ID: ${match.id}`);
} catch (err) {
  console.error("Failed to update role:", err);
  process.exit(1);
}
