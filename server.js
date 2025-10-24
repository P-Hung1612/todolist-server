import { Server } from "socket.io";
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("todoUpdated", () => {
        io.emit("refreshTodos");
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
