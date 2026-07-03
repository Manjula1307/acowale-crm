import { Request, Response } from 'express';
import { pool } from '../db/pool';

// POST /api/feedback
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { category, comment, email } = req.body;

    if (!category || !comment) {
      return res.status(400).json({ error: 'category and comment are required' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO feedback (category, comment, email) VALUES (?, ?, ?)',
      [category, comment, email || null]
    );

    res.status(201).json({
      id: result.insertId,
      category,
      comment,
      email: email || null,
      status: 'received',
    });
  } catch (err) {
    console.error('submitFeedback error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// GET /api/feedback?category=Product&search=slow&page=1&limit=10
export const getFeedback = async (req: Request, res: Response) => {
  try {
    const { category, search, page = '1', limit = '10' } = req.query;

    let query = 'SELECT * FROM feedback WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND comment LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const limitNum = parseInt(limit as string, 10);
    const offset = (parseInt(page as string, 10) - 1) * limitNum;
    params.push(limitNum, offset);

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('getFeedback error:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// GET /api/feedback/summary
export const getSummary = async (req: Request, res: Response) => {
  try {
    const [totalRows]: any = await pool.query('SELECT COUNT(*) as total FROM feedback');
    const [categoryRows] = await pool.query(
      'SELECT category, COUNT(*) as count FROM feedback GROUP BY category'
    );
    const [recentRows] = await pool.query(
      'SELECT * FROM feedback ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      total: totalRows[0].total,
      byCategory: categoryRows,
      recent: recentRows,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};