import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    sender_id: { type: Schema.Types.ObjectId, required: true }, // user or technician _id
    sender_type: { type: String, enum: ["user", "technician"], required: true },
    message: { type: String, required: true, trim: true },
  },
);

const ChatSchema = new Schema(
  {
    request_id: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true, // one chat thread per service request
    },
    messages: [MessageSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Chat", ChatSchema);
