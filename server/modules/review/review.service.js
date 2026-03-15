import Review from "./review.model.js";

export const ReviewService = {
  // CREATE REVIEW =============================================
  async createReview(data) {
    const requestReviewed = await Review.findOne({ request_id: data?.request_id });

    if (requestReviewed) {
      throw new Error("This service request is already reviewed");
    }
    const review = await Review.create(data);
    return review;
  },

};
