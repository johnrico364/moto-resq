import mongoose from "mongoose";
const { Schema } = mongoose;

const TechnicianActivityLogSchema = new Schema(
  {
    technician_id: { type: Schema.Types.ObjectId, ref: "Technician", required: true },
    action: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

export default mongoose.model("TechnicianActivityLog", TechnicianActivityLogSchema);
