import dotenv from 'dotenv';
// โหลด .env.local แทน .env
dotenv.config({ path: '.env.local' });

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swaggerConfig.mjs";
import questionRouter from "./routers/questionsRouter.mjs";
import answerRouter from "./routers/answersRouter.mjs";
import voteRouter from "./routers/voteRouter.mjs";
import errorHandler from "./middlewares/errorHandler.mjs";

const app = express();
const port = process.env.PORT || 4000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  return res.json("Quora Mock API is working 🚀");
});

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);

app.use(errorHandler);

// Export app for Vercel
export default app;

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}
