import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Target directory for uploads is the root documents directory
// src/routes -> src -> backend -> S-learn-project- -> s-learn 2.1/documents
const documentsDir = path.join(__dirname, "../../../../documents");

// Ensure the base directory exists
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let targetSubdir = "";
    const type = req.query.type; // 'paper' or 'video'
    if (type === "video") {
      targetSubdir = "videos";
    } else if (type === "paper") {
      const year = req.query.year || "unknown";
      targetSubdir = path.join("papers", year);
    } else if (type === "avatar") {
      targetSubdir = "avatars";
    }
    const finalDir = path.join(documentsDir, targetSubdir);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    cb(null, finalDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${cleanName}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const type = req.query.type;
  let relativePath = "";
  if (type === "video") {
    relativePath = `videos/${req.file.filename}`;
  } else if (type === "paper") {
    const year = req.query.year || "unknown";
    relativePath = `papers/${year}/${req.file.filename}`;
  } else if (type === "avatar") {
    relativePath = `avatars/${req.file.filename}`;
  } else {
    relativePath = req.file.filename;
  }


  // Replace backslashes with forward slashes for URL path compatibility
  const webPath = relativePath.split(path.sep).join("/");
  const fileUrl = `${req.protocol}://${req.get("host")}/documents/${webPath}`;
  res.json({ url: fileUrl });
});

export default router;
