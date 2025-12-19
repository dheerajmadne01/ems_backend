import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export const config = {
  database: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT || 4000, 
    ssl: {
      ca: fs.readFileSync("/etc/ssl/certs/ca-certificates.crt"),
    },
  },
};
