import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

const cleanup = async () => {
  try {
    // 1. Cleanup papers
    console.log("Cleaning up duplicate papers...");
    const papersRef = collection(db, "papers");
    const papersSnap = await getDocs(papersRef);
    const papers = papersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Group papers by key features to identify duplicates (excluding the dynamic link)
    const papersGroup = {};
    for (const paper of papers) {
      const key = `${paper.subject || ""}_${paper.paper_name || ""}_${paper.year || ""}_${paper.level || ""}`.toLowerCase();
      if (!papersGroup[key]) {
        papersGroup[key] = [];
      }
      papersGroup[key].push(paper);
    }

    let deletedPapers = 0;
    for (const key in papersGroup) {
      const group = papersGroup[key];
      if (group.length > 1) {
        // Keep the first one, delete the rest
        for (let i = 1; i < group.length; i++) {
          const docId = group[i].id;
          await deleteDoc(doc(db, "papers", docId));
          deletedPapers++;
          console.log(`Deleted duplicate paper Ref ID: ${docId} (Key: ${key})`);
        }
      }
    }
    console.log(`Finished papers cleanup. Deleted: ${deletedPapers}`);

    // 2. Cleanup videos
    console.log("Cleaning up duplicate videos...");
    const videosRef = collection(db, "videos");
    const videosSnap = await getDocs(videosRef);
    const videos = videosSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const videosGroup = {};
    for (const video of videos) {
      // Clean mock/empty fields
      const title = video.title || "";
      const subject = video.subject || "";
      const desc = video.description || "";
      const key = `${title}_${subject}_${desc}`.toLowerCase();
      if (!videosGroup[key]) {
        videosGroup[key] = [];
      }
      videosGroup[key].push(video);
    }

    let deletedVideos = 0;
    for (const key in videosGroup) {
      const group = videosGroup[key];
      if (group.length > 1) {
        // Keep the first one, delete the rest
        for (let i = 1; i < group.length; i++) {
          const docId = group[i].id;
          await deleteDoc(doc(db, "videos", docId));
          deletedVideos++;
          console.log(`Deleted duplicate video Ref ID: ${docId} (Key: ${key})`);
        }
      }
    }
    console.log(`Finished videos cleanup. Deleted: ${deletedVideos}`);

  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};

await cleanup();
