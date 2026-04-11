import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost");
const useSSL = process.env.DATABASE_URL && !isLocal ? { rejectUnauthorized: false } : false;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL
});

const connectDB = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is not set in .env. Running without a database connection.");
        return;
    }

    // Simple test query on startup
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error("PostgreSQL connection failed:", err.message);
        } else {
            console.log("PostgreSQL connected successfully ✅");
        }
    });
};

export { pool };
export default connectDB;