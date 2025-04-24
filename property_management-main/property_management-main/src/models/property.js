import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    propertyType: {
      type: String,
      index: true,
    },
    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      required: false,
      index: true,
    },
    propertyName: {
      type: String,
    },
    propertyDescription: {
      type: String,
    },
    availabilityDate: {
      type: Date,
    },
    price: {
      type: Number,
      index: true,
    },
    pricePerSqFt: {
      type: Number,
    },
    expectedDeposit: {
      type: Number,
    },
    monthlyMaintenance: {
      type: String,
    },
    taxExcluded: {
      type: Boolean,
    },
    priceNegotiable: {
      type: Boolean,
    },
    preLeased: {
      type: String,
    },
    currency: {
      type: String,
      enum: ["USD", "INR", "EUR"],
      default: "INR",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Rented", "Pending"],
      default: "Available",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    areaDetails: {
      type: Number,
      required: true,
    },
    areaUnit: {
      type: String,
      required: true,
    },
    bhkType: {
      type: String,
    },
    floor: {
      type: Number,
      required: false,
    },
    totalFloors: {
      type: Number,
    },
    propertyAge: {
      type: String,
    },
    furnishing: {
      type: String,
    },
    preferredTenants: {
      type: [String],
    },
    lengthOfPlot: {
      type: Number,
    },
    breadthOfPlot: {
      type: Number,
    },
    widthOfFacingRoad: {
      type: Number,
    },
    noOfOpenSides: {
      type: Number,
    },
    constructionDone: {
      type: String,
    },
    propertyFacing: {
      type: String,
    },
    possessionBy: {
      type: String,
    },
    bedrooms: {
      type: Number,
      required: false,
      index: true,
    },
    bathrooms: {
      type: Number,
      required: false,
      index: true,
    },
    balconies: {
      type: Number,
    },
    kitchens: {
      type: Number,
    },
    furnished: {
      type: Boolean,
    },
    nonVegAllowed: {
      type: String,
    },
    amenities: {
      type: [String],
    },
    images: {
      type: [String],
    },
    videos: {
      type: [String],
    },
    ownership: {
      type: String,
    },
    propertyAuthority: {
      type: String,
    },
    areaUnit: {
      type: String,
    },
    agentName: {
      type: String,
    },
    teamName: {
      type: String,
    },
    contactInfo: {
      phone1: {
        type: String,
      },
      phone2: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    agentProfilePhoto: {
      type: String,
    },
    availability: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    availableAllDay: {
      type: Boolean,
    },
    layouts: {
      type: [String],
    },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    address: {
      street: { type: String, index: true },
      city: { type: String, index: true },
      state: { type: String, index: true },
      country: { type: String, index: true },
      zipcode: { type: String, index: true },
    },
    industryType: {
      type: String,
    },
    propertyUnique: {
      type: String,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
