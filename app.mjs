import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swaggerConfig.mjs";
import questionRouter from "./routers/questionsRouter.mjs";
import answerRouter from "./routers/answersRouter.mjs";
import voteRouter from "./routers/voteRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.use("/questions", questionRouter);
app.use("/questions", answerRouter);
app.use("/", voteRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
