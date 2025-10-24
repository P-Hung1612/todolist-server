export const createTodo = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id; // ✅ Lấy từ middleware xác thực
        const newTodo = await Todo.create({ text, userId });
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
