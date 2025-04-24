import prisma from "../../db/index.js";

// Add Bank
export const addBank = async (req, res) => {
    try {
        // Check database connection
        try {
            await prisma.$connect();
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            return res.status(500).json({
                success: false,
                message: "Database connection error",
                error: dbError.message
            });
        }

        const { bank_name, ifsc_code, bank_branch } = req.body;

        console.log("Received bank data:", { bank_name, ifsc_code, bank_branch });

        // Validate required fields
        if (!bank_name || !ifsc_code || !bank_branch) {
            console.log("Missing required fields:", { bank_name, ifsc_code, bank_branch });
            return res.status(400).json({
                success: false,
                message: "Bank name, IFSC code, and branch are required."
            });
        }

        // Check for existing bank with same IFSC
        const existingBank = await prisma.leanBank.findUnique({
            where: { ifsc_code: ifsc_code.trim().toUpperCase() }
        });

        if (existingBank) {
            console.log("Bank with IFSC already exists:", existingBank);
            return res.status(400).json({
                success: false,
                message: "Bank with this IFSC code already exists."
            });
        }

        // Create new bank
        const bankData = {
            bank_name: bank_name.trim(),
            ifsc_code: ifsc_code.trim().toUpperCase(),
            bank_branch: bank_branch.trim()
        };

        console.log("Creating bank with data:", bankData);

        const newBank = await prisma.leanBank.create({
            data: bankData
        });

        console.log("Bank created successfully:", newBank);

        return res.status(201).json({
            success: true,
            data: newBank,
            message: "Bank added successfully"
        });

    } catch (error) {
        console.error("Detailed error adding bank:", {
            error: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(400).json({
                success: false,
                message: "A bank with this IFSC code already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add bank",
            error: error.message
        });
    } finally {
        // Disconnect from database
        try {
            await prisma.$disconnect();
        } catch (disconnectError) {
            console.error("Error disconnecting from database:", disconnectError);
        }
    }
};

//  Get All Banks
export const getBanks = async (req, res) => {
    try {
        const banks = await prisma.leanBank.findMany();
        res.json({ success: true, data: banks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve banks",
            error: error.message
        });
    }
};

//  Get Bank by ID
export const getBankById = async (req, res) => {
    try {
        const { id } = req.params;

        const bank = await prisma.leanBank.findUnique({
            where: { id: parseInt(id) }
        });

        if (!bank) {
            return res.status(404).json({
                success: false,
                message: "Bank not found"
            });
        }

        res.json({ success: true, data: bank });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching bank",
            error: error.message
        });
    }
};

//  Update Bank
export const updateBank = async (req, res) => {
    try {
        const { id } = req.params;
        const { bank_name, ifsc_code, bank_branch } = req.body;

        const bank = await prisma.leanBank.findUnique({
            where: { id: parseInt(id) }
        });

        if (!bank) {
            return res.status(404).json({
                success: false,
                message: "Bank not found"
            });
        }

        // If IFSC code is being updated, check for duplicates
        if (ifsc_code && ifsc_code !== bank.ifsc_code) {
            const ifscExists = await prisma.leanBank.findUnique({
                where: { ifsc_code }
            });

            if (ifscExists) {
                return res.status(400).json({
                    success: false,
                    message: "IFSC code already exists."
                });
            }
        }

        const updatedBank = await prisma.leanBank.update({
            where: { id: parseInt(id) },
            data: { bank_name, ifsc_code, bank_branch }
        });

        res.json({ success: true, data: updatedBank });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update bank",
            error: error.message
        });
    }
};

//  Delete Bank
export const deleteBank = async (req, res) => {
    try {
        const { id } = req.params;

        const bank = await prisma.leanBank.findUnique({
            where: { id: parseInt(id) }
        });

        if (!bank) {
            return res.status(404).json({
                success: false,
                message: "Bank not found"
            });
        }

        await prisma.leanBank.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: "Bank deleted successfully" });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete bank",
            error: error.message
        });
    }
};
