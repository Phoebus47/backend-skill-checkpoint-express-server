import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../utils/swaggerConfig.mjs";
import questionRouter from "../routers/questionsRouter.mjs";
import answerRouter from "../routers/answersRouter.mjs";
import voteRouter from "../routers/voteRouter.mjs";
import errorHandler from "../middlewares/errorHandler.mjs";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// โหลด environment variables สำหรับ production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);

// Health check
app.get("/api/health", (req, res) => {
  return res.json({ message: "Quora Mock API is working 🚀", status: "healthy" });
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling
app.use(errorHandler);

export default app;