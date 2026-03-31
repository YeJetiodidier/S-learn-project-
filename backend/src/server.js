import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import paperRoutes from "./routes/papers.js";
import profileRoutes from "./routes/profile.js";
import videoRoutes from "./routes/videos.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
 const PORT=process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

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