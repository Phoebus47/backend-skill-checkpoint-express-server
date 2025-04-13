import { Router } from "express";
import { connectionPool } from "../db.js";

const answerRouter = Router();

answerRouter.post("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;
  if (!content || content.length > 300) {
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

answerRouter.get("/:questionId/answers", async (req, res) => {
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

answerRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);
    return res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default answerRouter;
