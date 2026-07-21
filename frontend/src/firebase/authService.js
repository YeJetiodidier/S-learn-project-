// Firebase Authentication service layer.
// Replaces the old Express/PostgreSQL auth routes with Firebase Auth.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  verifyPasswordResetCode,
  confirmPasswordReset,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

// Register a new user: creates the Firebase Auth account AND a Firestore
// profile document under users/{uid}.
export const registerUser = async (name, email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    username: name,
    email: user.email,
    role: "Student",
    avatar_url: "",
    bio: "",
    level: "",
    specialty: "",
    lessons_completed: 0,
    topics_studied: 0,
    createdAt: new Date().toISOString(),
  });
  return user;
};

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      username: user.displayName || user.email.split("@")[0],
      email: user.email,
      role: "Student",
      avatar_url: user.photoURL || "",
      bio: "",
      level: "",
      specialty: "",
      lessons_completed: 0,
      topics_studied: 0,
      createdAt: new Date().toISOString(),
    });
  }
  return user;
};

export const logoutUser = () => signOut(auth);

// Password reset via Firebase email link (replaces the old phone/OTP flow).
export const sendResetEmail = (email) => sendPasswordResetEmail(auth, email);

// Used by the ResetPassword page when the user lands with an oobCode in the URL.
export const confirmResetPassword = async (oobCode, newPassword) => {
  await verifyPasswordResetCode(auth, oobCode);
  return confirmPasswordReset(auth, oobCode, newPassword);
};

// Change password: requires re-authentication with the current password.
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

// Delete account: removes the Firestore profile + settings docs, then the Auth user.
export const deleteAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  await deleteDoc(doc(db, "users", user.uid));
  await deleteDoc(doc(db, "settings", user.uid));
  await deleteUser(user);
};

// Export the current user's data as a plain object (replaces /api/auth/export).
export const exportUserData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const settingsSnap = await getDoc(doc(db, "settings", user.uid));
  return {
    account: { uid: user.uid, email: user.email },
    user: userSnap.exists() ? userSnap.data() : null,
    settings: settingsSnap.exists() ? settingsSnap.data() : null,
    exportedAt: new Date().toISOString(),
  };
};

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
export const getCurrentUser = () => auth.currentUser;

// Maps Firebase Auth error codes to friendly messages.
export const mapAuthError = (err) => {
  // Debug: log the full error object to the console
  console.error("Firebase Auth Error Object:", err);
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/requires-recent-login":
      return "Please log in again before performing this action.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    default:
      return err?.message || "Authentication failed. Please try again.";
  }
};
