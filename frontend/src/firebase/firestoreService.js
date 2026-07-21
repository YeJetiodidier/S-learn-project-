// Firestore service layer — replaces all PostgreSQL CRUD operations.
// Collections:
//   users/{uid}      -> profile (username, role, avatar_url, bio, level, specialty, ...)
//   settings/{uid}   -> appearance / notifications / privacy preferences
//   papers           -> shared past-paper records
//   videos           -> shared Science Lab videos
//   questions        -> exam question bank
import { db } from "./config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

/* ───────────── PROFILE ───────────── */
export const getProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateProfile = async (uid, data) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
  return data;
};

/* ───────────── SETTINGS ───────────── */
export const getSettings = async (uid) => {
  const snap = await getDoc(doc(db, "settings", uid));
  return snap.exists() ? snap.data() : {};
};

export const updateSettings = async (uid, data) => {
  const ref = doc(db, "settings", uid);
  await setDoc(ref, data, { merge: true });
  return data;
};

/* ───────────── PAPERS ───────────── */
export const getPapers = async () => {
  const q = query(collection(db, "papers"), orderBy("year", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addPaper = async (paper) => {
  const ref = await addDoc(collection(db, "papers"), {
    ...paper,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...paper };
};

/* ───────────── VIDEOS ───────────── */
export const getVideos = async () => {
  const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addVideo = async (video) => {
  const ref = await addDoc(collection(db, "videos"), {
    ...video,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...video };
};

/* ───────────── QUESTIONS / EXAM ───────────── */
// Distinct topics for a subject (Firestore has no DISTINCT, so we derive it client-side).
export const getTopics = async (subject) => {
  const q = query(collection(db, "questions"), where("subject", "==", subject));
  const snap = await getDocs(q);
  const topics = new Set();
  snap.docs.forEach((d) => {
    const t = d.data().topic;
    if (t) topics.add(t);
  });
  return Array.from(topics).sort();
};

// Fetch up to `count` random questions for a subject + topic.
export const getQuestions = async (subject, topic, count) => {
  const q = query(
    collection(db, "questions"),
    where("subject", "==", subject),
    where("topic", "==", topic)
  );
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Fisher–Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, count);
};

export const addQuestion = async (question) => {
  const ref = await addDoc(collection(db, "questions"), question);
  return { id: ref.id, ...question };
};
