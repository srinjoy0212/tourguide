import Tour from "../models/Tour.js";

// Get all tours with pagination
const getAllTours = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const tours = await Tour.find()
      .sort({ createdAt: -1 })
      .populate("reviews")
      .skip(page * 12)
      .limit(12);

    res.status(200).json({ success: true, data: tours, count: tours.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single tour by ID
const getSingleTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findById(tourId).populate("reviews");

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json({
      success: true,
      data: tour,
      message: "Data received successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new tour
const createTour = async (req, res) => {
  try {
    const {
      title,
      city,
      maxGroupSize,
      photo,
      address,
      price,
      distance,
      schedule, // Including schedule
      includedInPackage,
      excludedInPackage,
      importantInfo,
      featured, // Add featured field
    } = req.body;

    const newTour = new Tour({
      title,
      city,
      photo,
      maxGroupSize,
      address,
      price,
      distance,
      schedule,
      includedInPackage,
      excludedInPackage,
      importantInfo,
      featured, // Add featured field
    });

    await newTour.save();
    res
      .status(201)
      .json({ message: "Tour created successfully", data: newTour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update an existing tour
const updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const {
      title,
      city,
      desc,
      maxGroupSize,
      photo,
      address,
      price,
      distance,
      schedule, // Including schedule
      includedInPackage,
      excludedInPackage,
      importantInfo,
      featured, // Add featured field
    } = req.body;

    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      {
        title,
        city,
        desc,
        photo,
        maxGroupSize,
        address,
        price,
        distance,
        schedule,
        includedInPackage,
        excludedInPackage,
        importantInfo,
        featured, // Add featured field
      },
      { new: true }
    );

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res
      .status(200)
      .json({ message: "Tour updated successfully", data: updatedTour });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Delete a tour
const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search for tours by criteria
const getTourBySearch = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);

    const searchCriteria = {};

    if (searchTerm) {
      searchCriteria.$or = [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { city: { $regex: new RegExp(searchTerm, "i") } },
      ];
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      searchCriteria.price = { $gte: minPrice, $lte: maxPrice };
    }

    const matchingTours = await Tour.find(searchCriteria).populate("reviews");

    res.status(200).json({
      success: true,
      data: matchingTours,
      count: matchingTours.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get featured tours
// const getFeaturedTour = async (req, res) => {
//   try {
//     const featuredTours = await Tour.find({ featured: true })
//       .sort({ reviews: -1 })
//       .populate("reviews")
//       .limit(12);

//     res.status(200).json({
//       success: true,
//       data: featuredTours,
//       count: featuredTours.length,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Get featured tours
const getFeaturedTour = async (req, res) => {
  try {
    // Fetch the most recent 4 tours marked as featured
    const featuredTours = await Tour.find({ featured: true })
      .sort({ updatedAt: -1 }) // Sort by most recently updated (descending order)
      .limit(4); // Limit to 4 results

    res.status(200).json({
      success: true,
      data: featuredTours,
      count: featuredTours.length,
    });
  } catch (error) {
    console.error("Error fetching featured tours:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

// Get the total count of tours
const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.countDocuments();
    res.status(200).json({ success: true, data: tourCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
};
