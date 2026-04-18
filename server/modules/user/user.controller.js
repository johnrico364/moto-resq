import { UserService } from "./user.service.js";

export const signupUser = async (req, res) => {
  try {
    const userData = JSON.parse(req?.body?.data);
    const userImg = req.file?.filename;

    const user = await UserService.signupUser(userData, userImg);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user, token } = await UserService.loginUser(req?.body);
    res.status(200).json({ success: true, data: user, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req?.params?.id;

    const user = await UserService.logoutUser(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req?.params?.id;

    const user = await UserService.getUserById(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const userData = JSON.parse(req?.body?.data);
    const profile_image = req.file?.filename;

    const user = await UserService.updateUser(userId, {
      ...userData,
      profile_image,
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserVehicles = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const vehicles = await UserService.getUserVehicles(userId);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addUserVehicle = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const vehicleData = req?.body;
    const vehicle = await UserService.addUserVehicle(userId, vehicleData);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateUserVehicle = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const vehicleId = req?.params?.vehicleId;
    const vehicleData = req?.body;
    

    const vehicle = await UserService.updateUserVehicle(userId, vehicleId, vehicleData);
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUserVehicle = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const vehicleId = req?.params?.vehicleId;
    await UserService.deleteUserVehicle(userId, vehicleId);
    res.status(200).json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
