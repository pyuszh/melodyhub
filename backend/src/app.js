const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://melodyhub-blush.vercel.app',
    'https://melodyhub-phi.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/music', musicRoutes);

module.exports = app;