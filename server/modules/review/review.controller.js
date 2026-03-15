import { ReviewService } from "./review.service.js";

export const createReview = async (req, res) => {
  try {
    const reviewData = req.body;
    const review = await ReviewService.createReview(reviewData);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
