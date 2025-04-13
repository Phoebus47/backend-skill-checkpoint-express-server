import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const voteRouter = Router();

voteRouter.post("/questions/:questionId/vote", async (req, res) => {
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
      .json({
        message: "Vote on the question has been recorded successfully.",
      });
  } catch {
    return res.status(500).json({ message: "Unable to vote question." });
  }
});

voteRouter.post("/answers/:answerId/vote", async (req, res) => {
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

export default voteRouter;
