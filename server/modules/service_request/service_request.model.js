import mongoose from "mongoose";
const { Schema } = mongoose;

const ServiceRequestSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    technician_id: {
      type: Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },
    vehicle_id: { type: Schema.Types.ObjectId, required: true }, // subdoc ref from user.vehicles
    problem_type: {
      type: String,
      enum: [
        "Flat Tire",
        "Battery",
        "Engine",
        "Electrical",
        "Towing",
        "Brakes",
        "Other",
      ],
      required: true,
    },
    notes: { type: String, default: "no notes" },
    image: { type: String, default: 'default.png' }, // array of image URLs
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "On the Way",
        "Arrived",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    eta_minutes: { type: Number, default: null },
    completed_at: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceRequest", ServiceRequestSchema);
