const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");

const app = express();

app.use(cors({
    origin: "https://melodyhub-phi.vercel.app",
    credentials: true
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/music", musicRoutes);

module.exports = app;