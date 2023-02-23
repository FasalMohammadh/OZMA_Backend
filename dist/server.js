import express from 'express';
import cors from 'cors';
import userRoutes from './Routers/userRouter.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.listen(process.env.PORT ?? 5000);
