import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const answerRouter = Router();

/**
 * @swagger
 * /{questionId}/answers:
 *   post:
 *     summary: Create an answer for a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to answer
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 300
 *             required:
 *               - content
 *           examples:
 *             example1:
 *               value:
 *                 content: "This is an answer to the question."
 *     responses:
 *       201:
 *         description: Answer created successfully
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
 *                   message: "Answer created successfully"
 *       400:
 *         description: Invalid request data
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
 *         description: Unable to create answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
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

/**
 * @swagger
 * /{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to retrieve answers for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of answers for the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *             examples:
 *               example1:
 *                 value:
 *                   data:
 *                     - id: 1
 *                       content: "This is the first answer."
 *                     - id: 2
 *                       content: "This is the second answer."
 *       404:
 *         description: Question not found
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
 *                   message: "Question not found"
 *       500:
 *         description: Unable to fetch answers
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
 *                   message: "Unable to fetch answers"
 */
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

/**
 * @swagger
 * /{questionId}/answers:
 *   delete:
 *     summary: Delete all answers for a question
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to delete answers for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All answers for the question have been deleted successfully
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
 *                   message: "All answers for the question have been deleted successfully."
 *       404:
 *         description: Question not found
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
 *                   message: "Question not found"
 *       500:
 *         description: Unable to delete answers
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
 *                   message: "Unable to delete answers"
 */
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
