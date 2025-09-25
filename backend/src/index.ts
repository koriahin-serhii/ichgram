import express, { Application, Request, Response } from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouters from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import searchRouters from './routes/searchRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API root!');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouters);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/search', searchRouters);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port: http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
