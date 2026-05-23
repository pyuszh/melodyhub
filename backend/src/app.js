const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");

const app = express();

const corsOptions = {
    origin: function (origin, callback) {

        const allowed =
            !origin ||
            origin === "http://localhost:5173" ||
            /^https:\/\/melodyhub.*\.vercel\.app$/.test(origin);

        if (allowed) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/music", musicRoutes);

module.exports = app;