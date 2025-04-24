import express from "express";
import { getBirthdayUsers } from "../controllers/utilitesController/birthdayController.js";

const router = express.Router();

router.get("/birthday-users", getBirthdayUsers);

export default router;
