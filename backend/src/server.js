import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import paperRoutes from "./routes/papers.js";
import profileRoutes from "./routes/profile.js";
import videoRoutes from "./routes/videos.js";
import settingsRoutes from "./routes/settings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
 const PORT=process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Serve static documents from the papers folder
app.use("/documents", express.static(path.join(__dirname, "../../../documents")));

app.use("/api/papers", paperRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/",(req,res)=>{
    res.send("server is running");
})
connectDB();
app.listen(PORT,()=>{   
    console.log("Server is running on port ",PORT);
})