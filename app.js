import express from 'express';
import cors from 'cors';
import { SERVER_PORT } from './config/env.js';
import connectToDatabase from './database/sql.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import userRouter from './routes/user.routes.js';
const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/user', userRouter);



app.get('/', (req, res) => {
  res.send("welcome....");
});

app.listen(SERVER_PORT, async () => {
  console.log(`Caab running on http://localhost:${SERVER_PORT}`);
  await connectToDatabase();
});

export default app;
