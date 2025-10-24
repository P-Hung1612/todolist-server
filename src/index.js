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
app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// ✅ Tạo server HTTP (Socket.io yêu cầu)
const server = http.createServer(app);

// ✅ Cấu hình socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Cho phép React app
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

// ✅ Lắng nghe kết nối từ client
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
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ DB connection error:", err));
