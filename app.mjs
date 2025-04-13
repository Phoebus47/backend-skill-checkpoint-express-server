import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/questions", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query("SELECT * FROM questions");
  } catch {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
  return res.status(200).json({ data: result.rows });
});

app.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  let result;
  try {
    result = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
  } catch {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
  return res.status(200).json({ data: result.rows[0] });
});

app.post("/questions", async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  try {
    await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *",
      [title, description, category]
    );
  } catch {
    return res.status(500).json({ message: "Unable to create question." });
  }
  return res.status(201).json({ message: "Question created successfully." });
});

app.put("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  let result;
  try {
    result = await connectionPool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *",
      [title, description, category, questionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
  } catch {
    return res.status(500).json({ message: "Unable to fetch question." });
  }
  return res.status(200).json({ message: "Question updated successfully." });
});

app.delete("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  let result;
  try {
    result = await connectionPool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
  } catch {
    return res.status(500).json({ message: "Unable to delete question." });
  }
  return res
    .status(200)
    .json({ message: "Question post has been deleted successfully." });
});

app.get("/questions/search", async (req, res) => {
  const categoryParam = req.query.category ? `%${req.query.category}%` : null;
  const titleParam = req.query.title ? `%${req.query.title}%` : null;
  try {
    if (!categoryParam && !titleParam) {
      return res.status(400).json({ message: "Invalid search parameters." });
    }
    const result = await connectionPool.query(
      "SELECT * FROM questions WHERE ($1::text IS NULL OR category ILIKE $1) AND ($2::text IS NULL OR title ILIKE $2)",
      [categoryParam, titleParam]
    );
    return res.status(200).json({ data: result.rows });
  } catch {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

app.post("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Invalid request data." });
  }
  try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
      [questionId, content]
    );
    return res.status(201).json({ message: "Answer created successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to create answer." });
  }
});

app.get("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    const result = await connectionPool.query(
      "SELECT id, content FROM answers WHERE question_id = $1",
      [questionId]
    );
    return res.status(200).json({ data: result.rows });
  } catch {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

app.delete("/questions/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query(
      "DELETE FROM answers WHERE question_id = $1",
      [questionId]
    );
    return res
      .status(200)
      .json({ message: "All answers for the question have been deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

app.post("/questions/:questionId/vote", async (req, res) => {
  const { questionId } = req.params;
  const { vote } = req.body;
  if (vote !== 1 && vote !== -1) {
    return res.status(400).json({ message: "Invalid vote value." });
  }
  try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query(
      "INSERT INTO question_votes (question_id, vote) VALUES ($1, $2)",
      [questionId, vote]
    );
    return res
      .status(200)
      .json({ message: "Vote on the question has been recorded successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to vote question." });
  }
});

app.post("/answers/:answerId/vote", async (req, res) => {
  const { answerId } = req.params;
  const { vote } = req.body;
  if (vote !== 1 && vote !== -1) {
    return res.status(400).json({ message: "Invalid vote value." });
  }
  try {
    const answerCheck = await connectionPool.query(
      "SELECT id FROM answers WHERE id = $1",
      [answerId]
    );
    if (answerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }
    await connectionPool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );
    return res
      .status(200)
      .json({ message: "Vote on the answer has been recorded successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to vote answer." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
