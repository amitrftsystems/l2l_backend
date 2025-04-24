import express from "express";
import {
  addProperty,
  getAllProperty,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
} from "../controllers/propertyController.js";
import { searchAndFilterProperties } from "../controllers/searchController.js";
import upload from "../utils/upload.js";
const router = express.Router();

router.post(
  "/addProperty",
  upload.fields([
    // { name: "images", maxCount: 5 },
    // { name: "videos", maxCount: 1 },
    // { name: "layoutPlan", maxCount: 1 },
    // { name: "agentProfilePhoto", maxCount: 1 },
  ]),
  addProperty
);
router.get("/getAllProperty", getAllProperty);
router.get("/getPropertyById/:id", getPropertyById);
router.put("/updatePropertyById/:id", updatePropertyById);
router.delete("/deletePropertyById/:id", deletePropertyById);
router.get("/search", searchAndFilterProperties);

export default router;
