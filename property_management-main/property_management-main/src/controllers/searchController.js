import Property from "../models/property.js"; // Importing the Property model

// GET /api/properties/search?location=Delhi&priceMin=50000&priceMax=200000&type=Apartment
export const searchAndFilterProperties = async (req, res) => {
  try {
    const {
      propertyType,
      listingType,
      priceMin,
      priceMax,
      bedrooms,
      bathrooms,
      areaMin,
      areaMax,
      status,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    // Filtering by Property Type
    if (propertyType) {
      filters.propertyType = { $regex: new RegExp(propertyType, "i") };
    }

    // Filtering by Listing Type (Sale / Rent)
    if (listingType) {
      filters.listingType = listingType;
    }

    // Filtering by Price Range
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = parseInt(priceMin);
      if (priceMax) filters.price.$lte = parseInt(priceMax);
    }

    // Filtering by Bedrooms
    if (bedrooms) {
      filters["features.bedrooms"] = parseInt(bedrooms);
    }

    // Filtering by Bathrooms
    if (bathrooms) {
      filters["features.bathrooms"] = parseInt(bathrooms);
    }

    // Filtering by Area Range
    if (areaMin || areaMax) {
      filters["features.area"] = {};
      if (areaMin) filters["features.area"].$gte = parseInt(areaMin);
      if (areaMax) filters["features.area"].$lte = parseInt(areaMax);
    }

    // Filtering by Status (Available, Sold, Rented, Pending)
    if (status) {
      filters.status = status;
    }

    // Sorting (price, date added, ratings)
    let sortOptions = {};
    if (sortBy) {
      const sortField = sortBy === "date" ? "createdAt" : sortBy;
      sortOptions[sortField] = order === "desc" ? -1 : 1;
    } else {
      // Default sorting by newest properties
      sortOptions["createdAt"] = -1;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch properties
    const properties = await Property.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCount = await Property.countDocuments(filters);
    console.log("Filters Applied:", filters);

    res.status(200).json({
      success: true,
      count: properties.length,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
