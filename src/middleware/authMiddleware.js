import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Thiếu token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // gắn thông tin user vào request
        next();
    } catch (err) {
        res.status(403).json({ error: "Token không hợp lệ" });
    }
};
