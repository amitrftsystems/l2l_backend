import prisma from "../../db/index.js";

export const addBroker = async (req, res) => {
  try {
    const {
      project_id,
      name,
      address,
      mobile,
      email,
      phone,
      fax,
      income_tax_ward_no,
      dist_no,
      pan_no,
      net_commission_rate
    } = req.body;

    // Validate required fields
    if (!project_id || !name) {
      return res.status(400).json({
        success: false,
        message: "Project ID and name are required"
      });
    }

    // Check if project exists and get project details
    const project = await prisma.project.findUnique({
      where: { project_id: parseInt(project_id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Create the broker with project details
    const newBroker = await prisma.broker.create({ 
      data: {
        name,
        address,
        mobile,
        email,
        phone,
        fax,
        income_tax_ward_no,
        dist_no,
        pan_no,
        net_commission_rate: parseFloat(net_commission_rate) || 0,
        project_name: project.project_name,
        project_id: project.project_id,
        associated_projects: {
          connect: {
            project_id: parseInt(project_id)
          }
        }
      },
      include: {
        associated_projects: true
      }
    });

    // Transform the response
    const transformedBroker = {
      ...newBroker,
      project: newBroker.associated_projects[0] || null,
      associated_projects: undefined
    };

    return res.status(201).json({
      success: true,
      data: transformedBroker,
      message: "Broker added successfully"
    });

  } catch (error) {
    console.error("Error adding broker:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const editBroker = async (req, res) => {
  try {
    if (typeof req.body !== "object") {
      return res.status(400).json({ success: false, message: "Invalid JSON format." });
    }

    const { 
      broker_id, project_ids, name, address, mobile, email, phone, 
      fax, income_tax_ward_no, dist_no, pan_no, net_commission_rate 
    } = req.body;

    // Required field check
    if (!broker_id) {
      return res.status(400).json({ success: false, message: "broker_id is required for updating." });
    }

    // Validations
    if (pan_no && pan_no.length !== 10) {
      return res.status(400).json({ success: false, message: "PAN number must be exactly 10 characters." });
    }

    if (mobile && !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile number. It must be 10 digits." });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    if (net_commission_rate !== undefined && net_commission_rate < 0) {
      return res.status(400).json({ success: false, message: "Net commission rate cannot be negative." });
    }

    // Create update object dynamically
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (fax !== undefined) updateData.fax = fax;
    if (income_tax_ward_no !== undefined) updateData.income_tax_ward_no = income_tax_ward_no;
    if (dist_no !== undefined) updateData.dist_no = dist_no;
    if (pan_no !== undefined) updateData.pan_no = pan_no;
    if (net_commission_rate !== undefined) updateData.net_commission_rate = net_commission_rate;

    if (Object.keys(updateData).length === 0 && !project_ids) {
      return res.status(400).json({ success: false, message: "No fields provided for update." });
    }

    // First, disconnect all existing project associations
    await prisma.broker.update({
      where: { broker_id: parseInt(broker_id) },
      data: {
        associated_projects: {
          set: []
        }
      }
    });

    // Then update the broker with new data and project associations
    const updatedBroker = await prisma.broker.update({
      where: { broker_id: parseInt(broker_id) },
      data: {
        ...updateData,
        associated_projects: project_ids ? {
          connect: project_ids.map(id => ({ project_id: parseInt(id) }))
        } : undefined
      },
      include: {
        associated_projects: true
      }
    });

    // Transform the response
    const transformedBroker = {
      ...updatedBroker,
      project: updatedBroker.associated_projects[0] || null,
      associated_projects: undefined
    };

    res.status(200).json({ success: true, data: transformedBroker });

  } catch (error) {
    console.error("Error updating broker:", error);

    // If broker not found
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: "Broker not found." });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBroker = async (req, res) => {
  try {
    const { broker_id, name } = req.query;

    // Build dynamic Prisma `where` clause
    const filters = {};

    if (broker_id) filters.broker_id = parseInt(broker_id);
    if (name) filters.name = { contains: name, mode: 'insensitive' };

    const brokers = await prisma.broker.findMany({
      where: filters,
      orderBy: {
        broker_id: 'desc'
      },
      include: {
        associated_projects: true
      }
    });

    // Transform the response to include project information
    const transformedBrokers = brokers.map(broker => ({
      ...broker,
      project: broker.associated_projects[0] || null,
      associated_projects: undefined
    }));

    res.status(200).json({
      success: true,
      data: transformedBrokers,
      message: "Brokers retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching brokers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getBrokerById = async (req, res) => {
  try {
    const { id } = req.params;
    const broker = await prisma.broker.findUnique({
      where: { broker_id: parseInt(id) },
      include: {
        associated_projects: true
      }
    });

    if (!broker) {
      return res.status(404).json({ success: false, message: "Broker not found." });
    }

    // Transform the response
    const transformedBroker = {
      ...broker,
      project: broker.associated_projects[0] || null,
      associated_projects: undefined
    };

    res.status(200).json({ success: true, data: transformedBroker });

  } catch (error) {
    console.error("Error fetching broker by ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error", 
      error: error.message
    });
  }
};

export const deleteBroker = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid broker ID is required" 
      });
    }

    const brokerId = parseInt(id);
    
    // First check if broker exists
    const existingBroker = await prisma.broker.findUnique({
      where: { broker_id: brokerId }
    });

    if (!existingBroker) {
      return res.status(404).json({ 
        success: false, 
        message: "Broker not found" 
      });
    }

    // Delete the broker
    await prisma.broker.delete({
      where: { broker_id: brokerId }
    });

    res.status(200).json({ 
      success: true, 
      message: "Broker deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting broker:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting broker." 
    });
  }
};



