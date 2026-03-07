import mongoose from "mongoose";
const { Schema } = mongoose;

const VehicleSchema = new Schema({
  type: { type: String, required: true, enum: ["Motorcycle", "Car"] },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  plate_number: { type: String, required: true },
});

const UserSchema = new Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    profile_image: { type: String, required: false },
    vehicles: { type: [VehicleSchema], required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("User", UserSchema);