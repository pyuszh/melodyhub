const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    
    const { username, email, password, role= "user" } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ 
        $or: [
            { username },
            { email }
        ]
     });

     

     if(isUserAlreadyExist) {
        return res.status(400).json({ message: "Username already exists" });
     }

     const hash = await bcrypt.hash(password, 10);

        const user = new userModel({
            username,
            email,
            password: hash,
            role
        });

        await user.save();

        const token = jwt.sign({ 
            id: user._id,
            role: user.role },
            process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
});

        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
         });
}

async function loginUser(req, res) {
    const {username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
     })
        if(!user) {
            return res.status(401).json({ message: "Invalid username or email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
});
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            } 
        })
        

}

async function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: "User logged out successfully" }); 
}

module.exports = {
    registerUser, loginUser, logoutUser 
}