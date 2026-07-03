import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import feedbackRoutes from './routes/feedbackRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});