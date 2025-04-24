import prisma from "../../../db/index.js";

export const getCustomers = async (req, res) => {
  try {
    // Get customers with Prisma
    const customers = await prisma.customer.findMany({
      select: {
        customer_id: true,
        project_id: true
      },
      orderBy: {
        customer_id: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: customers
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer data",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



export const getCustomerById = async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Validate customer_id
    if (!customer_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Customer ID is required" 
      });
    }

    // Find customer using Prisma
    const customer = await prisma.customer.findUnique({
      where: { customer_id }
    });

    // Handle not found
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: "Customer not found" 
      });
    }

    // Return successful response
    return res.status(200).json({ 
      success: true, 
      data: customer 
    });

  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deleteCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customer = await prisma.customer.delete({
      where: { customer_id }
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete customer"
    });
  }
};


