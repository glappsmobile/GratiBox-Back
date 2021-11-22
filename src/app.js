import './setup.js';
import express from 'express';
import cors from 'cors';
import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import getUser from './controllers/getUser.js';
import subscribe from './controllers/subscribe.js';
import auth from './middlewares/auth.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

app.post('/sign-in', signIn);

app.post('/sign-up', signUp);

app.get('/user', auth, getUser);

app.post('/subscribe', auth, subscribe);

export default app;
