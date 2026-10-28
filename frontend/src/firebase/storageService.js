// Local Storage service — handles file uploads via Express backend to bypass billing issues with Firebase Storage.
import { getBackendUrl } from "../utils/backendConfig";

const BACKEND_URL = getBackendUrl();

// Uploads a File/Blob and returns a publicly accessible download URL.
export const uploadFile = async (file, type, year = "") => {
  if (!BACKEND_URL) {
    throw new Error("The backend is not configured. Start the API server or set VITE_BACKEND_URL to a valid live backend.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const queryParams = new URLSearchParams();
  if (type) queryParams.append("type", type);
  if (year) queryParams.append("year", year);

  const res = await fetch(`${BACKEND_URL}/api/upload?${queryParams.toString()}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.url;
};

// Convenience helper that builds a storage path for a paper PDF.
export const uploadPaperFile = (file, year) =>
  uploadFile(file, "paper", year);

// Convenience helper that builds a storage path for a video file.
export const uploadVideoFile = (file) =>
  uploadFile(file, "video");
