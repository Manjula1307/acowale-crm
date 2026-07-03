import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from '../db/pool';

dotenv.config();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD missing in .env');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await pool.query(
    'INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
    [email, passwordHash, passwordHash]
  );

  console.log(`Admin seeded: ${email}`);
  process.exit(0);
}

seedAdmin();