import express, { Application, Request, Response } from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
