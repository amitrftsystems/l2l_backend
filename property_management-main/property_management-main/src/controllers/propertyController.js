import Property from "../models/property.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const addProperty = async (req, res) => {
  try {
    console.log(req.body);
    // Handle file uploads correctly
    // const images = req.files?.images
    //   ? req.files.images.map((file) => file.path)
    //   : [];
    // const videos = req.files?.videos
    //   ? req.files.videos.map((file) => file.path)
    //   : [];
    // const layoutPlan = req.files?.layoutPlan
    //   ? req.files.layoutPlan.map((file) => file.path)
    //   : [];
    // const agentProfilePhoto = req.files?.agentProfilePhoto
    //   ? req.files.agentProfilePhoto[0].path
    //   : null;

    // Ensure proper data types
    const price = Number(req.body.expectedPrice) || 0;
    const expectedDeposit = Number(req.body.expectedDeposit) || 0;
    const pricePerSqFt = Number(req.body.pricePerSqFt) || 0;
    const areaDetails = Number(req.body.areaDetails) || 0;
    const totalFloors = Number(req.body.totalFloors) || 0;
    const floor =
      req.body.floor === "Ground" ? 0 : Number(req.body.floor) || null;

    const newProperty = new Property({
      ...req.body,
      price,
      expectedDeposit,
      pricePerSqFt,
      areaDetails,
      totalFloors,
      // images,
      // videos,
      floor,
      // layoutPlan,
    });

    // Save to database
    const savedProperty = await newProperty.save();

    res.status(201).json({
      message: "Property added successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("Error saving property:", error);
    res.status(400).json({ message: error.message });
  }
};

// export const getAllProperty = async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllProperty = asyncHandler(async (req, res) => {
  // Get pagination parameters from query string, with defaults
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Query total count of properties
  const total = await Property.countDocuments();

  // Fetch paginated properties
  const properties = await Property.find().skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: properties,
  });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the property ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid property ID");
  }

  const property = await Property.findById(id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

export const updatePropertyById = async (req, res) => {
  try {
    const updateProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updateProperty)
      return res.status(404).json({ message: "Property not updated " });
  } catch (error) {}
};

export const deletePropertyById = async (req, res) => {
  try {
    const deleteProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deleteProperty)
      return res.status(404).json({ message: "Property not found!" });

    deleteProperty.images.forEach(async (url) => {
      const publicId = url.split("/").pop().split(".")[0];
      await CloudinaryStorage.uploader.destory(publicId);
    });

    if (deleteProperty.videos) {
      const publicId = deleteProperty.videos.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
    await deleteProperty.deleteOne();
    res.status(200).json({ message: "Property deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
