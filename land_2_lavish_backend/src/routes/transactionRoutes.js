<<<<<<< HEAD
// import express from "express";
// const router = express.Router();


// // import { 
// //     createBooking,
// //     getBookings,
// //     getBookingById,
// //     updateBooking,
// //     deleteBooking,
// //     checkCustomerBookings
// //  } from "../controllers/trasactionController/booking.js";


// const {
//     createAllotment,
//     getAllotments,
//     getAllotmentById,
//     updateAllotment,
//     deleteAllotment,
//     checkPropertyAllotment
//   } = require("../controllers/trasactionController/allotment.js");
  




//  router.post("/booking", createBooking);
//  router.get("/booking", getBookings);
//  router.get("/booking/:booking_id", getBookingById);
//  router.put("/booking/:booking_id", updateBooking);
//  router.delete("/booking/:booking_id", deleteBooking);
//  router.get("/booking/check-customer-bookings/:customer_id", checkCustomerBookings);


 
// // Allotment routes
// router.post("/allotment", createAllotment);
// router.get("/allotment", getAllotments);
// router.get("/allotment/:allotment_id", getAllotmentById);
// router.put("/allotment/:allotment_id", updateAllotment);
// router.delete("/allotment/:allotment_id", deleteAllotment);
// router.get("/allotment/check-property/:property_id", checkPropertyAllotment);
=======
import express from "express";
import { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } from "../controllers/trasactionController/booking.js";

const router = express.Router();

// booking
router.post("/booking", createBooking);
router.get("/bookings", getBookings);
router.get("/booking/:booking_id", getBookingById);
router.put("/booking/:booking_id", updateBooking);
router.delete("/booking/:booking_id", deleteBooking);
>>>>>>> 3c817385caf74fa1c62a3fba098baf4ca8b18a0c

// export default router;

