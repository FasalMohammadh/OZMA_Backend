import express from 'express';
import cors from 'cors';

import userRoutes from './Routers/userRouter.js';
import testRouter from './Routers/testRouter.js';


const app = express();
// app.all('*', function (req, res) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
//   );
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
// });

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/get', testRouter);


app.listen(process.env.PORT ?? 5000);
