    import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const [rows]: any = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    res.json({ token, email: admin.email });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};