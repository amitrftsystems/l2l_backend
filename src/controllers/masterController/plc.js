import prisma from "../../db/index.js";

export const addNewPLC = async (req, res) => {
  try {
    const { plc_name, value, is_percentage, remarks } = req.body;

    // Validate required fields
    if (!plc_name || value === undefined || value === null) {
      return res.status(400).json({ 
        success: false, 
        message: "PLC name and value are required." 
      });
    }

    // Check if PLC name already exists
    const existingPLC = await prisma.plc.findUnique({
      where: {
        plc_name: plc_name
      }
    });

    if (existingPLC) {
      return res.status(400).json({ 
        success: false, 
        message: "PLC name already exists." 
      });
    }

    // Insert new PLC
    const newPLC = await prisma.plc.create({
      data: {
        plc_name,
        value,
        is_percentage: is_percentage || false,
        remarks: remarks || null
      }
    });

    res.status(201).json({ 
      success: true, 
      data: newPLC,
      message: "PLC added successfully"
    });

  } catch (error) {
    console.error("Error adding PLC:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while adding PLC." 
    });
  }
};


export const getPLC = async (req, res) => {
  try {
    const plc = await prisma.plc.findMany();
    if (!plc) {
      return res.status(404).json({ success: false, message: "PLC not found." });
    }
    res.status(200).json({ success: true, data: plc });
  } catch (error) {
    console.error("Error getting PLC:", error);
    res.status(500).json({ success: false, message: "Server error while getting PLC." });
  }
};


export const getPLCById = async (req, res) => {
  try {
    const { plc_id } = req.params;
    const plc = await prisma.plc.findUnique({
      where: { plc_id }
    }); 
    if (!plc) {
      return res.status(404).json({ success: false, message: "PLC not found." });
    }
    res.status(200).json({ success: true, data: plc });
  } catch (error) {
    console.error("Error getting PLC:", error); 
    res.status(500).json({ success: false, message: "Server error while getting PLC." });
  }
};


export const updatePLC = async (req, res) => {
  try {
    const { plc_id } = req.params;
    const { plc_name, value, is_percentage, remarks } = req.body;

    const updatedPLC = await prisma.plc.update({
      where: { plc_id },
      data: { plc_name, value, is_percentage, remarks }
    });

    if (!updatedPLC) {
      return res.status(404).json({ success: false, message: "PLC not found." });
    }

    res.status(200).json({ success: true, data: updatedPLC });
  } catch (error) { 
    console.error("Error updating PLC:", error);
    res.status(500).json({ success: false, message: "Server error while updating PLC." });
  }
};


export const deletePLC = async (req, res) => {
  try {
    const { plc_id } = req.params;
    const deletedPLC = await prisma.plc.delete({
      where: { plc_id }
    }); 
    if (!deletedPLC) {
      return res.status(404).json({ success: false, message: "PLC not found." });
    }
    res.status(200).json({ success: true, message: "PLC deleted successfully." });
  } catch (error) {
    console.error("Error deleting PLC:", error);  
    res.status(500).json({ success: false, message: "Server error while deleting PLC." });
  }
};  



