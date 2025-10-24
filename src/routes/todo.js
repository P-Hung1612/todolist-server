import express from "express";
import Todo from "../models/Todo.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Lấy todos của user hiện tại
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // lấy từ JWT
        const todos = await Todo.find({ userId }); // lọc theo user
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

// ✅ Thêm todo cho user hiện tại
router.post("/", verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text là bắt buộc" });

        const todo = new Todo({ text, userId: req.user.id });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

// ✅ Cập nhật todo (chỉ nếu thuộc user)
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const todo = await Todo.findOneAndUpdate(
            { _id: id, userId: req.user.id }, // chỉ update nếu thuộc user
            updates,
            { new: true }
        );

        if (!todo) return res.status(404).json({ error: "Không tìm thấy todo" });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

// ✅ Xóa todo (chỉ nếu thuộc user)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!todo) return res.status(404).json({ error: "Không tìm thấy todo" });
        res.json({ message: "Todo đã bị xóa" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

export default router;
