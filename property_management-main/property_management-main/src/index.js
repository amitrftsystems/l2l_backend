import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { limiter } from "../utils/rateLimiter.js";
import propertyRouter from "./routes/propertyRoute.js";
import connectDB from "../configs/db.js";

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use("/api", limiter);
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   next();
// });

// const allowedOrigins =
//   process.env.NODE_ENV === "development"
//     ? ["http://localhost:5173"]
//     : ["https://your-production-domain.com"];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   })
// );

app.use(cors());

// routers
app.use("/api", propertyRouter);

// Function to start server
const startServer = async () => {
  try {
    connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // Sync Database Models (use cautiously in production)
    if (process.env.NODE_ENV === "development") {
    }
  } catch (error) {
    console.error("Failed to start server:", error);
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
