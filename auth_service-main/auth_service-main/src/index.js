import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize, connectDB } from "../configs/db.js";
import authRouter from "./routes/authRoute.js";
import { limiter } from "../utils/rateLimiter.js";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

const PORT = process.env.PORT || 8080;

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to JSON
const serviceAccountPath = path.join(
  __dirname,
  "../configs/firebaseServiceAccountKey.json"
);

// Read JSON file correctly
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.json());
app.use("/api", limiter);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// const allowedOrigins =
//   process.env.NODE_ENV === "development"
//     ? ["http://localhost:5173"] // Local frontend
//     : ["https://your-production-domain.com"]; // Replace with your actual frontend domain

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // Allow credentials (cookies, authorization headers)
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
//   })
// );

app.use(cors());

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(
//     JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
//   ),
// });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com",
});

// routers
app.use("/api", authRouter);

// Function to start server
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database first
    console.log("✅ Database connected!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // Sync Database Models (use cautiously in production)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synced successfully!");
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(" Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
