import mongoose from "mongoose";
const { Schema } = mongoose;

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const DocumentsSchema = new Schema(
  {
    id_url: { type: String },
    certificate_url: { type: String },
  },
  { _id: false }
);

const TechnicianSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profile_image: { type: String, required: false, default: "default.png" },
    expertise: {
      type: [String],
      enum: ["Battery", "Towing", "Flat Tire", "Engine", "Electrical", "Brakes", "Other"],
      default: [],
    },
    is_available: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },   // admin approves technician
    location: { type: LocationSchema, default: null },
    documents: { type: DocumentsSchema, default: {} },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    total_reviews: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Technician", TechnicianSchema);