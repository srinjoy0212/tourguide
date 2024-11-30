import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    schedule: [
      {
        day: {
          type: String, // Example: "Day 1", "Day 2", etc.
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
      },
    ],
    includedInPackage: [
      {
        type: String, // Example: "Accommodation", "Meals", "Guided Tours"
        
      },
    ],
    excludedInPackage: [
      {
        type: String, // Example: "Airfare", "Travel Insurance", "Personal Expenses"
        
      },
    ],
    importantInfo: {
      type: String, // Example: "Carry a valid ID card", "Follow COVID-19 protocols"
      
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
