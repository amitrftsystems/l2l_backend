import prisma from "../../db/index.js";

export const getProperties = async (req, res) => {
  try {
    const { property_type, customer_id } = req.query;

    const whereClause = {};
    if (property_type) whereClause.property_type = property_type;
    if (customer_id) whereClause.customer_id = parseInt(customer_id);

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            customer_id: true,
            name: true
          }
        }
      },
      orderBy: {
        property_id: 'desc'
      }
    });

    const formatted = properties.map(p => ({
      property_id: p.property_id,
      property_type: p.property_type,
      size: p.size,
      allotment_date: p.allotment_date,
      remark: p.remark,
      customer_id: p.customer?.customer_id || null,
      customer_name: p.customer?.name || null
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message
    });
  }
};


export const createProperty = async (req, res) => {
    try {
      const { property_id, property_type, size, customer_id, allotment_date, remark } = req.body;
  
      // Validate required fields
      if (!property_id || !property_type || size === undefined) {
        return res.status(400).json({
          success: false,
          message: "Property ID, type, and size are required"
        });
      }

      // Convert size to integer
      const processedSize = parseInt(size);
      if (isNaN(processedSize)) {
        return res.status(400).json({
          success: false,
          message: "Size must be a valid number"
        });
      }
  
      const newProperty = await prisma.property.create({
        data: {
          property_id: parseInt(property_id),
          property_type,
          size: processedSize,
          customer_id: customer_id ? parseInt(customer_id) : null,
          allotment_date: allotment_date ? new Date(allotment_date) : null,
          remark: remark || null
        }
      });
  
      return res.status(201).json({
        success: true,
        data: newProperty,
        message: "Property created successfully"
      });
  
    } catch (error) {
      console.error("Create error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create property",
        error: error.message
      });
    }
  };
  


export const updateProperty = async (req, res) => {
    const { property_id } = req.params;
    const { property_type, size, customer_id, allotment_date, remark } = req.body;
  
    try {
      const updatedProperty = await prisma.property.update({
        where: { property_id: parseInt(property_id) },
        data: {
          property_type,
          size,
          customer_id,
          allotment_date,
          remark
        }
      });
  
      return res.status(200).json({
        success: true,
        data: updatedProperty,
        message: "Property updated successfully"
      });
  
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }
  
      console.error("Update error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update property",
        error: error.message
      });
    }
  };

  
export const deleteProperty = async (req, res) => {
    const { property_id } = req.params;
  
    try {
      const deleted = await prisma.property.delete({
        where: { property_id: parseInt(property_id) }
      });
  
      return res.status(200).json({
        success: true,
        data: { property_id: deleted.property_id },
        message: "Property deleted successfully"
      });
  
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: "Property not found"
        });
      }
  
      console.error("Delete error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete property",
        error: error.message
      });
    }
  };
  

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    const property = await prisma.property.findUnique({
      where: { property_id: parseInt(id) }
    });

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    res.status(200).json({ success: true, data: property });

  } catch (error) {
    console.error("Error fetching property by ID:", error);
    res.status(500).json({ success: false, message: "Server error while fetching property by ID." });
  }
};

