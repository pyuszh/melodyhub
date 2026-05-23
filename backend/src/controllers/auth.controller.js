const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {

    try {

        const {
            username,
            email,
            password,
            role = "user"
        } = req.body;

        const isUserAlreadyExist =
            await userModel.findOne({
                $or: [
                    { username },
                    { email }
                ]
            });

        if (isUserAlreadyExist) {

            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const hash = await bcrypt.hash(
            password,
            10
        );

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        // COOKIE
        res.cookie("token", token);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function loginUser(req, res) {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        const user =
            await userModel.findOne({
                $or: [
                    { username },
                    { email }
                ]
            });

        if (!user) {

            return res.status(401).json({
                message: "Invalid username or email"
            });
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {

            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        // COOKIE
        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function logoutUser(req, res) {

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};