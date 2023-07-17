const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel } = require("../model/userModel");
const userRoute = express.Router();
require("dotenv").config();

userRoute.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(200).json({ msg: "User exist, please login" })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(400).json({ err: err.message })
            } else {
                const newUser = await new userModel({ ...req.body, password: hash });
                await newUser.save();
                res.status(200).json({ msg: "user registered", user: req.body })
            }
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.secretKey)
                    res.status(200).json({ msg: "login successful", token });
                } else {
                    res.status(400).json({ error: "wrong credentials" });
                }
            })
        } else {
            res.status(400).json({ error: "user not exist" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = { userRoute }