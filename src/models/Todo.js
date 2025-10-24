import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        done: { type: Boolean, default: false },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        deadline: { type: Date, default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
