const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");
const { postModel } = require("../model/postModel");
const postRoute = express.Router();


postRoute.post("/add", authMiddleware, async (req, res) => {
    try {
        const { title, body, device } = req.body;

        const post = await postModel.create({ title, body, device, userId: req.userId, userName: req.userName });

        return res.status(200).json({ msg: "post uploaded" })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})

postRoute.get("/", authMiddleware, async (req, res) => {
    const { device } = req.query;
    let obj = { userId: req.userID };
    if (device) {
        obj.device = device;
    }
    try {
        const posts = await postModel.find(obj);
        if (posts) {
            res.status(200).json({ posts });
        } else {
            res.status(400).json({ msg: "posts not available" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

postRoute.patch("/update/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const posts = await postModel.findOne({ _id: id })
    try {
        if (req.userId === posts.userId) {
            await postModel.findByIdAndUpdate({ _id: id }, req.body)
            res.status(200).json({ msg: "post updated" });
        } else {
            res.status(400).json({ msg: "user not authorized" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

postRoute.delete("/delete/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const posts = await postModel.findOne({ _id: id })
    try {
        if (req.userId === posts.userId) {
            await postModel.findByIdAndDelete({ _id: id }, req.body)
            res.status(200).json({ msg: "post deleted" });
        } else {
            res.status(400).json({ msg: "user not authorized" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports={postRoute}