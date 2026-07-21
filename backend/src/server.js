import express from "express";
import 'dotenv/config';
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import paperRoutes from "./routes/papers.js";
import profileRoutes from "./routes/profile.js";
import videoRoutes from "./routes/videos.js";
import settingsRoutes from "./routes/settings.js";
import authRoutes, { initDB } from "./routes/auth.js";
import resetPasswordRoutes from "./routes/resetPassword.js";
import examRoutes from "./routes/exam.js";
import uploadRoutes from "./routes/upload.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost in dev + any https production origin
    if (
      !origin ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /^https:\/\/.+/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Serve static documents from the /documents folder at the project root
// __dirname = .../S-learn-project-/backend/src  →  ../../../documents = .../s-learn 2.1/documents
app.use("/documents", express.static(path.join(__dirname, "../../../documents")));

app.use("/api/papers", paperRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/reset", resetPasswordRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/", (req, res) => {
  res.send("server is running");
});

connectDB();
initDB().catch((err) => console.error("Database initialization failed:", err.message));
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
