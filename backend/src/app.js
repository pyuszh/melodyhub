const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");

const app = express();

const corsOptions = {
    origin: [
        "https://melodyhub-phi.vercel.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

// VERY IMPORTANT
app.use(cors(corsOptions));

// VERY VERY IMPORTANT
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/music", musicRoutes);

module.exports = app;