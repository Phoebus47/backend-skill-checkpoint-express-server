import { Router } from "express";
import { connectionPool } from "../db.js";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query("SELECT * FROM questions");
  } catch {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
  return res.status(200).json({ data: result.rows });
});

questionRouter.get("/:questionId", async (req, res) => {
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

questionRouter.post("/", async (req, res) => {
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

questionRouter.put("/:questionId", async (req, res) => {
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

questionRouter.delete("/:questionId", async (req, res) => {
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

questionRouter.get("/search", async (req, res) => {
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

export default questionRouter;
