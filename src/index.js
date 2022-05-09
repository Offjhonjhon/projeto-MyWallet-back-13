import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/authRouter.js';
import registersRouter from './routes/registersRouter.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(registersRouter);


app.listen(process.env.PORT);
