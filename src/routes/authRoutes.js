import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Đăng ký
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: "Tài khoản đã tồn tại" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });
        res.json({ message: "Đăng ký thành công", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.json({ message: "Đăng nhập thành công", token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
