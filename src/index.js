import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import todoRoutes from "./routes/todo.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ Cho phép frontend từ cả localhost và Vercel
const allowedOrigins = [
    "http://localhost:3000",
    "https://todolist-fe-wine.vercel.app",
    "https://todolist-mauve-delta.vercel.app",
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// ✅ Tạo server HTTP (Socket.io yêu cầu)
const server = http.createServer(app);

// ✅ Cấu hình socket.io
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
    },
});

// ✅ Lắng nghe kết nối socket
io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("todoUpdated", () => {
        console.log("🔁 Todo updated → broadcasting refreshTodos...");
        io.emit("refreshTodos");
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// ✅ Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log("🌐 Allowed origins:", allowedOrigins.join(", "));
        });
    })
    .catch((err) => console.error("❌ DB connection error:", err));
