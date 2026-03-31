import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

let pool = null;

const connectDB = () => {
    if (!process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is not set in .env. Running without a database connection.");
        return;
    }

    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Required for most online providers
        });

        // Test the connection
        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error("PostgreSQL connection failed:", err.message);
            } else {
                console.log("PostgreSQL connected successfully ✅");
            }
        });
    } catch(err) {
        console.error("Failed to initialize PostgreSQL pool:", err.message);
    }
};

export { pool };
export default connectDB;