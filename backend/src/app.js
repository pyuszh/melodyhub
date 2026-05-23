const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/music", musicRoutes);

module.exports = app;