import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const voteRouter = Router();

/**
 * @swagger
 * /questions/{questionId}/vote:
 *   post:
 *     summary: Vote on a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to vote on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *             required:
 *               - vote
 *           examples:
 *             example1:
 *               value:
 *                 vote: 1
 *     responses:
 *       200:
 *         description: Vote on the question has been recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               example1:
 *                 value:
 *                   message: "Vote on the question has been recorded successfully."
 *       400:
 *         description: Invalid vote value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unable to vote question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

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

/**
 * @swagger
 * /answers/{answerId}/vote:
 *   post:
 *     summary: Vote on an answer
 *     parameters:
 *       - name: answerId
 *         in: path
 *         required: true
 *         description: The ID of the answer to vote on
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: integer
 *                 enum: [1, -1]
 *             required:
 *               - vote
 *           examples:
 *             example1:
 *               value:
 *                 vote: -1
 *     responses:
 *       200:
 *         description: Vote on the answer has been recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               example1:
 *                 value:
 *                   message: "Vote on the answer has been recorded successfully."
 *       400:
 *         description: Invalid vote value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Answer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unable to vote answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

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
