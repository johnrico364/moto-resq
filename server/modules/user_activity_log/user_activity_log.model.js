import mongoose from "mongoose";
const { Schema } = mongoose;

const UserActivityLogSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.model("UserActivityLog", UserActivityLogSchema);
