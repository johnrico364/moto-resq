import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    request_id: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true, // one review per service request
    },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    technician_id: {
      type: Schema.Types.ObjectId,
      ref: "Technician",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    is_deleted: { type: Boolean, required: true, default: false },
    deleted_at: { type: Date },
  },
  { timestamps: true },
);

// Auto-update technician's average rating after a review is saved
// Note: Rating updates are now handled manually in the service after create, update, and delete operations
// ReviewSchema.post("save", async function () {
//   const Review = mongoose.model("Review");
//   const Technician = mongoose.model("Technician");

//   const stats = await Review.aggregate([
//     { $match: { technician_id: this.technician_id, is_deleted: { $ne: true } } },
//     {
//       $group: {
//         _id: "$technician_id",
//         avgRating: { $avg: "$rating" },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   if (stats.length > 0) {
//     await Technician.findByIdAndUpdate(this.technician_id, {
//       rating: Math.round(stats[0].avgRating * 10) / 10,
//       total_reviews: stats[0].count,
//     });
//   } else {
//     // If no reviews left, reset to 0
//     await Technician.findByIdAndUpdate(this.technician_id, {
//       rating: 0,
//       total_reviews: 0,
//     });
//   }
// });

export default mongoose.model("Review", ReviewSchema);
