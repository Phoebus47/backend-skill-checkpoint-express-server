import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     responses:
 *       200:
 *         description: A list of questions
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
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *             examples:
 *               example1:
 *                 value:
 *                   data:
 *                     - id: 1
 *                       title: "What is Node.js?"
 *                       description: "A question about Node.js."
 *                       category: "Programming"
 *                     - id: 2
 *                       title: "What is Express?"
 *                       description: "A question about Express framework."
 *                       category: "Web Development"
 */
/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single question object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *               - category
 *           examples:
 *             example1:
 *               value:
 *                 title: "What is Node.js?"
 *                 description: "A question about Node.js."
 *                 category: "Programming"
 *     responses:
 *       201:
 *         description: Question created successfully
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
 *                   message: "Question created successfully"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Unable to create question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     summary: Update a question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *               - category
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to fetch question
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete a question by ID
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question and related answers deleted successfully
 *       404:
 *         description: Question not found
 *       500:
 *         description: Unable to delete question
 */

/**
 * @swagger
 * /questions/search:
 *   get:
 *     summary: Search for questions by category or title
 *     parameters:
 *       - name: category
 *         in: query
 *         required: false
 *         description: The category to search for
 *         schema:
 *           type: string
 *       - name: title
 *         in: query
 *         required: false
 *         description: The title to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of matching questions
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
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *       400:
 *         description: Invalid search parameters
 *       500:
 *         description: Unable to fetch questions
 */

// แก้ไข search route
questionRouter.get("/search", async (req, res, next) => {
  try {
    const { title, category } = req.query;
    
    console.log("Search request received:", { title, category });
    
    let query = "SELECT * FROM questions WHERE 1=1";
    const values = [];
    let paramCounter = 1;

    // ถ้ามี title หรือ category เหมือนกัน ให้ค้นหาทั้งสองแบบ (OR condition)
    if (title && category && title === category) {
      query += ` AND (title ILIKE $${paramCounter} OR category ILIKE $${paramCounter + 1})`;
      values.push(`%${title}%`);
      values.push(`%${category}%`);
      paramCounter += 2;
    } else {
      // ถ้าแยกกันให้ใช้ AND condition
      if (title) {
        query += ` AND title ILIKE $${paramCounter}`;
        values.push(`%${title}%`);
        paramCounter++;
      }

      if (category) {
        query += ` AND category ILIKE $${paramCounter}`;
        values.push(`%${category}%`);
        paramCounter++;
      }
    }

    query += " ORDER BY created_at DESC";

    console.log("SQL Query:", query, "Values:", values);

    const result = await connectionPool.query(query, values);

    return res.json({
      message: "Search completed successfully",
      data: result.rows
    });
  } catch (error) {
    console.error("Search error:", error);
    next(error);
  }
});

// GET all questions
questionRouter.get("/", async (req, res) => {
  let result;
  try {
    console.log("Attempting to fetch questions...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

    result = await connectionPool.query(
      "SELECT * FROM questions ORDER BY created_at DESC"
    );
    console.log("Query result:", result.rows.length, "questions found");
  } catch (error) {
    console.error("Database error:", error.message);
    console.error("Error code:", error.code);
    return res.status(500).json({
      message: "Unable to fetch questions.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
  return res.status(200).json({ data: result.rows });
});

// GET single question - ต้องมาหลัง /search
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

// POST new question
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

// PUT update question
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

// DELETE question
questionRouter.delete("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    await connectionPool.query("BEGIN");
    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);
    const result = await connectionPool.query(
      "DELETE FROM questions WHERE id = $1 RETURNING *",
      [questionId]
    );
    if (result.rowCount === 0) {
      await connectionPool.query("ROLLBACK");
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query("COMMIT");
    return res
      .status(200)
      .json({ message: "Question and related answers deleted successfully." });
  } catch (error) {
    await connectionPool.query("ROLLBACK");
    return res.status(500).json({ message: "Unable to delete question." });
  }
});

export default questionRouter;
