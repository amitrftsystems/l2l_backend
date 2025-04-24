<<<<<<< HEAD
// // controllers/bookingController.js
// const db = require("../../config/db");

// // Create a new booking
// const createBooking = async (req, res) => {
//   try {
//     const {
//       customer_id,
//       booking_date,
//       property_desc
//     } = req.body;

//     // Check if customer exists
//     const customerCheck = await db.query(
//       "SELECT 1 FROM customer WHERE customer_id = $1",
//       [customer_id]
//     );

//     if (customerCheck.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found"
//       });
//     }

//     // Insert new booking
//     const result = await db.query(
//       `INSERT INTO booking (
//         customer_id,
//         booking_date,
//         property_desc
//       ) VALUES ($1, $2, $3)
//       RETURNING *`,
//       [
//         customer_id,
//         booking_date || new Date(),
//         property_desc || null
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       data: result.rows[0],
//       message: "Booking created successfully"
//     });

//   } catch (error) {
//     console.error("Create booking error:", error);

//     const errorResponse = {
//       success: false,
//       message: "Failed to create booking",
//       error: error.message
//     };

//     if (error.code === '23503') {
//       errorResponse.message = "Invalid customer reference";
//       res.status(400).json(errorResponse);
//     } else if (error.code === '23505') {
//       errorResponse.message = "Booking already exists";
//       res.status(409).json(errorResponse);
//     } else {
//       res.status(500).json(errorResponse);
//     }
//   }
// };

// // Get all bookings
// const getBookings = async (req, res) => {
//   try {
//     const { customer_id, date_from, date_to } = req.query;
    
//     let query = `
//       SELECT b.*, c.name as customer_name 
//       FROM booking b
//       JOIN customer c ON b.customer_id = c.customer_id
//     `;
//     const params = [];
//     let whereClauses = [];

//     if (customer_id) {
//       params.push(customer_id);
//       whereClauses.push(`b.customer_id = $${params.length}`);
//     }

//     if (date_from) {
//       params.push(date_from);
//       whereClauses.push(`b.booking_date >= $${params.length}`);
//     }

//     if (date_to) {
//       params.push(date_to);
//       whereClauses.push(`b.booking_date <= $${params.length}`);
//     }

//     if (whereClauses.length > 0) {
//       query += ` WHERE ${whereClauses.join(' AND ')}`;
//     }

//     query += " ORDER BY b.booking_date DESC";

//     const result = await db.query(query, params);

//     res.json({
//       success: true,
//       data: result.rows,
//       message: "Bookings retrieved successfully"
//     });

//   } catch (error) {
//     console.error("Get bookings error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve bookings",
//       error: error.message
//     });
//   }
// };

// // Get booking by ID
// const getBookingById = async (req, res) => {
//   try {
//     const { booking_id } = req.params;

//     const result = await db.query(
//       `SELECT b.*, c.name as customer_name, c.permanent_address as customer_address
//        FROM booking b
//        JOIN customer c ON b.customer_id = c.customer_id
//        WHERE b.booking_id = $1`,
//       [booking_id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: result.rows[0],
//       message: "Booking retrieved successfully"
//     });

//   } catch (error) {
//     console.error("Get booking by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve booking",
//       error: error.message
//     });
//   }
// };

// // Update booking
// const updateBooking = async (req, res) => {
//   try {
//     const { booking_id } = req.params;
//     const {
//       customer_id,
//       booking_date,
//       property_desc
//     } = req.body;

//     // Check if customer exists if being updated
//     if (customer_id) {
//       const customerCheck = await db.query(
//         "SELECT 1 FROM customer WHERE customer_id = $1",
//         [customer_id]
//       );

//       if (customerCheck.rowCount === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Customer not found"
//         });
//       }
//     }

//     const result = await db.query(
//       `UPDATE booking SET
//         customer_id = COALESCE($1, customer_id),
//         booking_date = COALESCE($2, booking_date),
//         property_desc = COALESCE($3, property_desc),
//         updated_at = NOW()
//       WHERE booking_id = $4
//       RETURNING *`,
//       [
//         customer_id || null,
//         booking_date || null,
//         property_desc || null,
//         booking_id
//       ]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: result.rows[0],
//       message: "Booking updated successfully"
//     });

//   } catch (error) {
//     console.error("Update booking error:", error);

//     const errorResponse = {
//       success: false,
//       message: "Failed to update booking",
//       error: error.message
//     };

//     if (error.code === '23503') {
//       errorResponse.message = "Invalid customer reference";
//       res.status(400).json(errorResponse);
//     } else {
//       res.status(500).json(errorResponse);
//     }
//   }
// };

// // Delete booking
// const deleteBooking = async (req, res) => {
//   try {
//     const { booking_id } = req.params;

//     const result = await db.query(
//       `DELETE FROM booking 
//        WHERE booking_id = $1
//        RETURNING *`,
//       [booking_id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: result.rows[0],
//       message: "Booking deleted successfully"
//     });

//   } catch (error) {
//     console.error("Delete booking error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete booking",
//       error: error.message
//     });
//   }
// };

// // Check if customer has any bookings
// const checkCustomerBookings = async (req, res) => {
//   try {
//     const { customer_id } = req.params; // Changed from req.query to req.params to match your route
    
//     // Check if customer exists first
//     const customerCheck = await db.query(
//       `SELECT customer_id, name FROM customer WHERE customer_id = $1`,
//       [customer_id]
//     );
    
//     if (customerCheck.rowCount === 0) {
//       return res.status(404).json({ 
//         exists: false,
//         hasBookings: false,
//         message: "Customer not found"
//       });
//     }

//     // Check if customer has any bookings
//     const bookingCheck = await db.query(
//       `SELECT 1 FROM booking WHERE customer_id = $1 LIMIT 1`,
//       [customer_id]
//     );

//     const hasBookings = bookingCheck.rowCount > 0;

//     res.json({ 
//       exists: true,
//       hasBookings: hasBookings,
//       customer: customerCheck.rows[0],
//       message: hasBookings ? "Customer has bookings" : "Customer has no bookings"
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       error: error.message,
//       message: "Error checking customer bookings"
//     });
//   }
// };

// module.exports = {
//   createBooking,
//   getBookings,
//   getBookingById,
//   updateBooking,
//   deleteBooking,
//   checkCustomerBookings
// };
=======
import prisma from "../../db/index.js";

export const createBooking = async (req, res) => {
  try {
    const { customer_id, booking_date, name, address, property_id } = req.body;

    // Validate required fields
    if (!customer_id || !booking_date || !name || !address || !property_id) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Check if customer exists
    const customerExists = await prisma.customer.findUnique({
      where: { customer_id: customer_id },
    });
    if (!customerExists) {
      return res.status(400).json({ success: false, message: `Customer ID ${customer_id} does not exist.` });
    }

    // Check if property exists
    const propertyExists = await prisma.property.findUnique({
      where: { property_id: parseInt(property_id) },
    });
    if (!propertyExists) {
      return res.status(400).json({ success: false, message: `Property ID ${property_id} does not exist.` });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customer_id: customer_id,
        booking_date: new Date(booking_date),
        name,
        address,
        property_id: parseInt(property_id),
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error in booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json({ success: true, data: bookings });
  } catch (error) { 
    console.error("Error in getting bookings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};  


export const getBookingById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { booking_id: parseInt(booking_id) },  
    });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, data: booking }); 
  } catch (error) {
    console.error("Error in getting booking by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};  


export const updateBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { customer_id, booking_date, name, address, property_id } = req.body; 

    const updatedBooking = await prisma.booking.update({
      where: { booking_id: parseInt(booking_id) },
      data: { customer_id, booking_date, name, address, property_id },
    }); 

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error in updating booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};      


export const deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const deletedBooking = await prisma.booking.delete({
      where: { booking_id: parseInt(booking_id) },  
    });
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Error in deleting booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};    






>>>>>>> 3c817385caf74fa1c62a3fba098baf4ca8b18a0c
