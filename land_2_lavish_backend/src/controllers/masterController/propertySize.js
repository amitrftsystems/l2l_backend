import prisma from "../../db/index.js";

export const addNewPropertySize = async (req, res) => {
  try {
    const { project_id, property_size, measuring_unit } = req.body;

    // Validate required fields
    if (!project_id || !property_size || !measuring_unit) {
      return res.status(400).json({
        success: false,
        message: "Project ID, property size, and measuring unit are required"
      });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { project_id: parseInt(project_id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Check if size already exists for this project
    const existingSize = await prisma.project.findFirst({
      where: {
        project_id: parseInt(project_id),
        size: parseInt(property_size)
      }
    });

    if (existingSize) {
      return res.status(400).json({
        success: false,
        message: "Property size already exists for this project"
      });
    }

    // Update the project with the new size and measuring unit
    const updatedProject = await prisma.project.update({
      where: { project_id: parseInt(project_id) },
      data: { 
        size: parseInt(property_size),
        measuring_unit: measuring_unit
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedProject,
      message: "Property size added successfully"
    });

  } catch (error) {
    console.error("Error adding property size:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getPropertySize = async (req, res) => {
  try {
    const propertySize = await prisma.property_size.findMany();
    res.status(200).json({ success: true, data: propertySize });
  } catch (error) {
    console.error("Error getting property size:", error);
    res.status(500).json({ success: false, message: "Server error while getting property size." });
  }
};



export const getPropertySizeById = async (req, res) => {
  try {
    const { property_size_id } = req.params;
    const propertySize = await prisma.property_size.findUnique({
      where: { property_size_id }
    });

    if (!propertySize) {
      return res.status(404).json({ success: false, message: "Property size not found." });
    }

    res.status(200).json({ success: true, data: propertySize });

  } catch (error) {
    console.error("Error getting property size by ID:", error);
    res.status(500).json({ success: false, message: "Server error while getting property size by ID." });
  }
};


export const updatePropertySize = async (req, res) => {
  try {
    const { property_size_id } = req.params;
    const { property_size } = req.body; 

    const updatedPropertySize = await prisma.property_size.update({
      where: { property_size_id },
      data: { property_size }
    });

    if (!updatedPropertySize) {
      return res.status(404).json({ success: false, message: "Property size not found." });
    }

    res.status(200).json({ success: true, data: updatedPropertySize });

  } catch (error) {
    console.error("Error updating property size:", error);
    res.status(500).json({ success: false, message: "Server error while updating property size." });
  }
};


export const deletePropertySize = async (req, res) => {
  try {
    const { property_size_id } = req.params;
    const deletedPropertySize = await prisma.property_size.delete({
      where: { property_size_id } 
    });

    if (!deletedPropertySize) {
      return res.status(404).json({ success: false, message: "Property size not found." });
    }

    res.status(200).json({ success: true, message: "Property size deleted successfully." });

  } catch (error) {
    console.error("Error deleting property size:", error);
    res.status(500).json({ success: false, message: "Server error while deleting property size." });
  }
};



