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
    const [statusRows] = await pool.query(
      'SELECT status, COUNT(*) as count FROM feedback GROUP BY status'
    );
    const [recentRows] = await pool.query(
      'SELECT * FROM feedback ORDER BY created_at DESC LIMIT 5'
    );
    const [trendRows] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM feedback
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json({
      total: totalRows[0].total,
      byCategory: categoryRows,
      byStatus: statusRows,
      recent: recentRows,
      trend: trendRows,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};

const VALID_STATUSES = ['received', 'in_progress', 'resolved'];

// PATCH /api/feedback/:id/status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const [result]: any = await pool.query(
      'UPDATE feedback SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ id: Number(id), status });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

