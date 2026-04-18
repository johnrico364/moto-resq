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

export const getReviewsByTechnician = async (req, res) => {
  try {
    const technician_id = req?.params?.technician_id;
    const review = await ReviewService.getReviewsByTechnician(technician_id);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const user_id = req?.params?.user_id;
    const review = await ReviewService.getReviewsByUser(user_id);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updateData = req.body;
    const updatedReview = await ReviewService.updateReview(reviewId, updateData);

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const softDeleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const result = await ReviewService.softDeleteReview(reviewId);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
