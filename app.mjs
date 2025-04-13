import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/questions", async (req, res) => {
  const { title, category } = req.query;
  const result = await connectionPool.query(
    `SELECT * FROM questions WHERE (title = $1 OR $1 IS NULL OR $1 = '') AND (category = $2 OR $2 IS NULL OR $2 = '')`,
    [title, category]
  );
  return res.status(200).json({ data: result.rows });
});

app.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const result = await connectionPool.query(
    "SELECT * FROM questions WHERE id = $1",
    [questionId]
  );
  return res.status(200).json({ data: result.rows[0] });
});

app.post("/questions", async (req, res) => {
  const { title, description, category } = req.body;
  await connectionPool.query(
    "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *",
    [title, description, category]
  );
  return res.status(201).json({ message: "Question created successfully." });
});

app.put("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;
  await connectionPool.query(
    "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *",
    [title, description, category, questionId]
  );
  return res.status(200).json({ message: "Question updated successfully." });
});

app.delete("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  await connectionPool.query("DELETE FROM questions WHERE id = $1", [
    questionId,
  ]);
  return res
    .status(200)
    .json({ message: "Question post has been deleted successfully." });
});

app.post("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;
  await connectionPool.query(
    "INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *",
    [questionId, content]
  );
  return res.status(201).json({ message: "Answer created successfully." });
});

app.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const result = await connectionPool.query(
    "SELECT * FROM answers WHERE question_id = $1",
    [questionId]
  );
  return res.status(200).json({ data: result.rows });
});

app.delete("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
    questionId,
  ]);
  return res
    .status(200)
    .json({
      message: "All answers for the question have been deleted successfully.",
    });
});

app.post("/questions/:questionId/vote", async (req, res) => {
  const { questionId } = req.params;
  const { vote } = req.body;
  await connectionPool.query(
    "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
    [questionId, vote]
  );
  return res
    .status(200)
    .json({ message: "Vote on the question has been recorded successfully." });
});

app.post("/answers/:answerId/vote", async (req, res) => {
  const { answerId } = req.params;
  const { vote } = req.body;
  await connectionPool.query(
    "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
    [answerId, vote]
  );
  return res
    .status(200)
    .json({ message: "Vote on the answer has been recorded successfully." });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
