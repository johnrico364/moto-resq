import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../modules/user/user.model.js";
import Technician from "../modules/technician/technician.model.js";
import ServiceRequest from "../modules/service_request/service_request.model.js";
import Chat from "../modules/chat/chat.model.js";
import Review from "../modules/review/review.model.js";

dotenv.config();

const PROBLEM_TYPES = [
  "Flat Tire",
  "Battery",
  "Engine",
  "Electrical",
  "Towing",
  "Brakes",
  "Other",
];

const REQUEST_STATUSES = [
  "Pending",
  "Accepted",
  "On the Way",
  "Arrived",
  "In Progress",
  "Completed",
];

const EXPERTISE_POOL = [
  "Battery",
  "Towing",
  "Flat Tire",
  "Engine",
  "Electrical",
  "Brakes",
  "Other",
];

function padNumber(value, size) {
  return String(value).padStart(size, "0");
}

function getSample(array, index) {
  return array[index % array.length];
}

function createExpertise(index) {
  return [
    getSample(EXPERTISE_POOL, index),
    getSample(EXPERTISE_POOL, index + 2),
  ];
}

function createUsers(hashedPassword) {
  const users = [];

  for (let i = 1; i <= 30; i += 1) {
    const firstVehicleType = i % 2 === 0 ? "Car" : "Motorcycle";
    users.push({
      role: "user",
      name: `Seed User ${i}`,
      email: `seed.user${i}@example.com`,
      password: hashedPassword,
      phone: `0917${padNumber(i, 7)}`,
      status: "active",
      vehicles: [
        {
          type: firstVehicleType,
          brand: firstVehicleType === "Car" ? "Toyota" : "Honda",
          model: firstVehicleType === "Car" ? `Vios ${i}` : `Click ${i}`,
          plate_number: `SEED-U${padNumber(i, 3)}`,
        },
        {
          type: "Motorcycle",
          brand: "Yamaha",
          model: `Mio ${i}`,
          plate_number: `SEED-M${padNumber(i, 3)}`,
        },
      ],
    });
  }

  return users;
}

function createTechnicians(hashedPassword) {
  const technicians = [];

  for (let i = 1; i <= 15; i += 1) {
    technicians.push({
      name: `Seed Technician ${i}`,
      email: `seed.tech${i}@example.com`,
      phone: `0998${padNumber(i, 7)}`,
      password: hashedPassword,
      expertise: createExpertise(i),
      is_available: i % 2 === 0,
      is_verified: true,
      location: {
        lat: 14.55 + i * 0.01,
        lng: 120.95 + i * 0.01,
      },
      rating: 0,
      total_reviews: 0,
    });
  }

  return technicians;
}

async function seed() {
  const mongoUri = process.env.MONGO_DB_URI;
  if (!mongoUri) {
    throw new Error("MONGO_DB_URI is missing in environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  try {
    await Review.deleteMany({});
    await Chat.deleteMany({});
    await ServiceRequest.deleteMany({});
    await Technician.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("Seed123!", 10);

    const users = await User.insertMany(createUsers(hashedPassword));
    const technicians = await Technician.insertMany(
      createTechnicians(hashedPassword),
    );

    const serviceRequestPayloads = [];
    for (let i = 0; i < 60; i += 1) {
      const user = users[i % users.length];
      const technician = technicians[i % technicians.length];
      const vehicle = user.vehicles[i % user.vehicles.length];
      const status = getSample(REQUEST_STATUSES, i);
      const isCompleted = status === "Completed";

      serviceRequestPayloads.push({
        user_id: user._id,
        technician_id: technician._id,
        vehicle_id: vehicle._id,
        problem_type: getSample(PROBLEM_TYPES, i),
        notes: `Seed request #${i + 1}`,
        location: {
          lat: 14.5 + i * 0.002,
          lng: 120.9 + i * 0.002,
        },
        status,
        eta_minutes: isCompleted ? 10 : 5 + (i % 30),
        completed_at: isCompleted ? new Date() : null,
      });
    }

    const serviceRequests = await ServiceRequest.insertMany(serviceRequestPayloads);

    const chats = serviceRequests.map((request, index) => {
      const user = users[index % users.length];
      const technician = technicians[index % technicians.length];
      return {
        request_id: request._id,
        messages: [
          {
            sender_id: user._id,
            sender_type: "user",
            message: `Hello, this is request ${index + 1}.`,
          },
          {
            sender_id: technician._id,
            sender_type: "technician",
            message: "Received. Heading to your location.",
          },
        ],
      };
    });
    await Chat.insertMany(chats);

    const reviewsToInsert = serviceRequests
      .map((request, index) => {
        if (request.status !== "Completed") return null;
        const user = users[index % users.length];
        const technician = technicians[index % technicians.length];
        return {
          request_id: request._id,
          user_id: user._id,
          technician_id: technician._id,
          rating: (index % 5) + 1,
          comment: `Seed review for completed request ${index + 1}.`,
          is_deleted: false,
        };
      })
      .filter(Boolean);

    const reviews = await Review.insertMany(reviewsToInsert);

    const techRatingMap = new Map();
    for (const review of reviews) {
      const key = String(review.technician_id);
      const current = techRatingMap.get(key) || { total: 0, count: 0 };
      current.total += review.rating;
      current.count += 1;
      techRatingMap.set(key, current);
    }

    const ratingUpdates = [];
    for (const [technicianId, data] of techRatingMap.entries()) {
      ratingUpdates.push(
        Technician.findByIdAndUpdate(technicianId, {
          rating: Math.round((data.total / data.count) * 10) / 10,
          total_reviews: data.count,
        }),
      );
    }
    await Promise.all(ratingUpdates);

    console.log("Database seeded successfully.");
    console.log(`Users: ${users.length}`);
    console.log(`Technicians: ${technicians.length}`);
    console.log(`Service Requests: ${serviceRequests.length}`);
    console.log(`Chats: ${chats.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log("Seed user password for all accounts: Seed123!");
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
});
