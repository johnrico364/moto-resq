import mongoose from "mongoose";
const { Schema } = mongoose;

const ServiceCategorySchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    serviceName: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ServiceCategory", ServiceCategorySchema);
