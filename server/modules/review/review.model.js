import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    request_id: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true,       // one review per service request
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    technician_id: { type: Schema.Types.ObjectId, ref: "Technician", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Auto-update technician's average rating after a review is saved
ReviewSchema.post("save", async function () {
  const Review = mongoose.model("Review");
  const Technician = mongoose.model("Technician");

  const stats = await Review.aggregate([
    { $match: { technician_id: this.technician_id } },
    { $group: { _id: "$technician_id", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Technician.findByIdAndUpdate(this.technician_id, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      total_reviews: stats[0].count,
    });
  }
});

export default mongoose.model("Review", ReviewSchema);
