import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/index.js";
// import transactionRoutes from "./routes/transactionRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import utilitiesRoutes from "./routes/utlilitesRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import prisma from "./db/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/transactions", transactionRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/utilities", utilitiesRoutes);
app.use("/api/logs", logRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Test the server at http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
