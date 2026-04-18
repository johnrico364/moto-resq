import mongoose from "mongoose";
import Review from "./review.model.js";

async function updateTechnicianRating(technicianId) {
  const ReviewModel = mongoose.model("Review");
  const Technician = mongoose.model("Technician");

  const stats = await ReviewModel.aggregate([
    { $match: { technician_id: technicianId, is_deleted: { $ne: true } } },
    {
      $group: {
        _id: "$technician_id",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Technician.findByIdAndUpdate(technicianId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      total_reviews: stats[0].count,
    });
  } else {
    await Technician.findByIdAndUpdate(technicianId, {
      rating: 0,
      total_reviews: 0,
    });
  }
}

export const ReviewService = {
  // CREATE REVIEW =============================================
  async createReview(data) {
    const requestReviewed = await Review.findOne({
      request_id: data?.request_id,
    });

    if (requestReviewed) {
      throw new Error("This service request is already reviewed");
    }
    const review = await Review.create(data);
    await updateTechnicianRating(review.technician_id);
    return review;
  },
  //   GET REVIEWS BY TECHNICIAN =======================================
  async getReviewsByTechnician(id) {
    const reviews = await Review.find({ technician_id: id });
    return reviews;
  },
  //   GET REVIEWS BY USER =======================================
  async getReviewsByUser(id) {
    const reviews = await Review.find({ user_id: id });
    return reviews;
  },
  //   UPDATE REVIEW ==============================================
  async updateReview(id, data) {
    const review = await Review.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }

    // Prevent updating request_id as it's unique
    if (data.request_id && data.request_id !== review.request_id.toString()) {
      throw new Error("Cannot change the service request for a review");
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true },
    );
    await updateTechnicianRating(updatedReview.technician_id);
    return updatedReview;
  },
//   SOFT DELETE REVIEW ==============================================
  async softDeleteReview(id) {
    const review = await Review.findOne({
      _id: id,
      is_deleted: { $ne: true },
    });
    if (!review) {
      throw new Error("Review not found or already deleted");
    }

    await Review.findByIdAndUpdate(id, {
      $set: { is_deleted: true, deleted_at: new Date() },
    });
    await updateTechnicianRating(review.technician_id);
    return { message: "Review deleted successfully" };
  },
};
