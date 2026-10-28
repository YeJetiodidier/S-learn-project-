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
  updateDoc,
  deleteDoc,
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
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.status === "approved" || !p.status);
};

export const getPendingPapers = async () => {
  const q = query(collection(db, "papers"), orderBy("year", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.status === "pending");
};

export const addPaper = async (paper) => {
  const payload = {
    ...paper,
    status: paper.status || "pending",
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "papers"), payload);
  return { id: ref.id, ...payload };
};

export const approvePaper = async (id, adminUid = null) => {
  const ref = doc(db, "papers", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { id, alreadyApproved: false, status: null };
  }

  const current = snap.data() || {};
  if (current.status === "approved") {
    return { id, alreadyApproved: true, status: "approved" };
  }

  const updateData = {
    status: "approved",
    approvedAt: serverTimestamp(),
  };

  if (adminUid) {
    updateData.approvedBy = adminUid;
  }

  await updateDoc(ref, updateData);
  return { id, alreadyApproved: false, status: "approved" };
};

export const deletePaper = async (id) => {
  const ref = doc(db, "papers", id);
  await deleteDoc(ref);
};

/* ───────────── VIDEOS ───────────── */
export const getVideos = async () => {
  const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((v) => v.status === "approved" || !v.status);
};

export const getPendingVideos = async () => {
  const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((v) => v.status === "pending");
};

export const addVideo = async (video) => {
  const payload = {
    ...video,
    status: video.status || "pending",
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "videos"), payload);
  return { id: ref.id, ...payload };
};

export const approveVideo = async (id, adminUid = null) => {
  const ref = doc(db, "videos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { id, alreadyApproved: false, status: null };
  }

  const current = snap.data() || {};
  if (current.status === "approved") {
    return { id, alreadyApproved: true, status: "approved" };
  }

  const updateData = {
    status: "approved",
    approvedAt: serverTimestamp(),
  };

  if (adminUid) {
    updateData.approvedBy = adminUid;
  }

  await updateDoc(ref, updateData);
  return { id, alreadyApproved: false, status: "approved" };
};

export const deleteVideo = async (id) => {
  const ref = doc(db, "videos", id);
  await deleteDoc(ref);
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

const PAPER_STOPWORDS = new Set([
  "the", "and", "for", "with", "from", "into", "paper", "papers", "exam",
  "test", "question", "questions", "year", "marking", "scheme", "revision",
  "study", "sample", "past", "final", "mock", "section", "semester"
]);

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractConceptsFromPapers = (papers, subject, topic) => {
  const candidateStrings = papers
    .filter((paper) => {
      const haystack = [
        paper.subject,
        paper.specialty,
        paper.level,
        paper.paper_name,
        paper.title,
        paper.name,
        paper.topic,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const subjectMatch = !subject || !paper.subject || String(paper.subject).toLowerCase().includes(String(subject).toLowerCase());
      const topicMatch = !topic || !paper.topic || String(paper.topic).toLowerCase().includes(String(topic).toLowerCase()) || haystack.includes(String(topic).toLowerCase());

      return subjectMatch && (topicMatch || !topic);
    })
    .map((paper) => [
      paper.subject,
      paper.specialty,
      paper.level,
      paper.paper_name,
      paper.title,
      paper.name,
      paper.topic,
    ].join(" "))
    .join(" ");

  const words = normalizeText(candidateStrings)
    .split(" ")
    .filter((word) => word.length > 3 && !PAPER_STOPWORDS.has(word));

  const counts = {};
  for (const word of words) {
    counts[word] = (counts[word] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 12);
};

const makePaperQuestion = (subject, topic, concept, index) => {
  const templates = [
    {
      question_text: `Using knowledge from past papers in ${subject}, explain the main idea of ${concept} and why it matters in ${topic || subject}.`,
      options: [
        `It helps learners connect a key concept in ${subject} to real exam conditions and applications.`,
        `It is only useful for memorising unrelated general facts.`,
        `It should be ignored because past papers are always outdated.`,
        `It has no connection with the study of ${topic || subject}.`,
      ],
    },
    {
      question_text: `In a past-paper context for ${subject}, which statement best describes the role of ${concept}?`,
      options: [
        `It represents a core idea that is repeatedly examined and tested in ${topic || subject}.`,
        `It is a random word unrelated to the subject topic.`,
        `It only applies to one isolated textbook chapter without any practical use.`,
        `It replaces the need for revision and preparation.`,
      ],
    },
    {
      question_text: `A learner reviews several past papers for ${subject}. Which answer best reflects how ${concept} should be understood in ${topic || subject}?`,
      options: [
        `As a core principle that supports deeper understanding and better application in exam questions.`,
        `As a hidden rule that should never be discussed in class.`,
        `As a mistake to avoid in every practice paper.`,
        `As a topic that is irrelevant to the rest of the syllabus.`,
      ],
    },
    {
      question_text: `Which approach is most appropriate when preparing for questions on ${concept} in ${subject}?`,
      options: [
        `Review the main concepts, definitions, and practical examples connected to ${topic || subject}.`,
        `Skip the topic and answer only from memory without studying.`,
        `Guess without considering the paper theme or topic.`,
        `Ignore the subject and focus only on unrelated examples.`,
      ],
    },
  ];

  const template = templates[index % templates.length];
  return {
    id: `paper-${Date.now()}-${index}`,
    question_text: template.question_text.replace("concept", concept),
    options: template.options,
    answer: template.options[0],
  };
};

export const generateSmartExamFromPapers = async ({ subject, topic, count, papers = null }) => {
  const paperList = papers || (await getPapers());
  if (!paperList || !paperList.length) return [];

  const concepts = extractConceptsFromPapers(paperList, subject, topic);
  if (!concepts.length) return [];

  const questions = [];
  const safeCount = Math.max(1, Number(count) || 5);

  for (let i = 0; i < safeCount; i++) {
    const concept = concepts[i % concepts.length] || "core principles";
    questions.push(makePaperQuestion(subject, topic, concept, i));
  }

  return questions;
};

export const addQuestion = async (question) => {
  const ref = await addDoc(collection(db, "questions"), question);
  return { id: ref.id, ...question };
};
