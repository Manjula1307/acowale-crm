import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    multipleStatements: true,
  });

  console.log('Connected successfully. Creating database...');
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  await connection.query(`USE ${process.env.DB_NAME}`);

  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  await connection.query(schema);

  console.log('Schema applied successfully.');

  const [tables]: any = await connection.query('SHOW TABLES');
  console.log('Tables:', tables);

  await connection.end();
}

runSchema().catch((err) => {
  console.error('Failed to run schema:', err.message);
  process.exit(1);
});