import prisma from "../../db/index.js";

export const addNewInstallmentPlan = async(req, res) => {
    try {
        const { plan_name, no_of_installments } = req.body;

        if (!plan_name || !no_of_installments) {
            return res.status(400).json({ success: false, message: "Plan name and number of installments are required." });
        }

        // Check if plan already exists
        const existingPlan = await prisma.installmentPlan.findUnique({
            where: { plan_name }
        });

        if (existingPlan) {
            return res.status(400).json({ 
                success: false, 
                message: "An installment plan with this name already exists. Please choose a different name." 
            });
        }

        const newPlan = await prisma.installmentPlan.create({
            data: {
                plan_name,
                no_of_installments: parseInt(no_of_installments)
            }
        });

        res.status(201).json({ success: true, data: newPlan });
    } catch (error) {
        console.log("Error creating plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const addInstallmentDetails = async (req, res) => {
    try {
        const { plan_name, installment_number, amount, percentage, due_after_days, due_date } = req.body;

        if (!plan_name || !installment_number) {
            return res.status(400).json({ success: false, message: "Plan name and installment numbers are required." });
        }

        // Check if plan exists
        const plan = await prisma.installmentPlan.findUnique({
            where: { plan_name }
        });

        if (!plan) {
            return res.status(404).json({ success: false, message: "Installment plan not found." });
        }

        // Create installment details for each installment
        const details = await Promise.all(
            installment_number.map((_, index) => {
                // Ensure we have a valid date
                let finalDueDate = new Date(due_date[index]);
                if (!(finalDueDate instanceof Date) || isNaN(finalDueDate)) {
                    // If no valid date, calculate from due_after_days
                    const days = due_after_days[index] || 0;
                    finalDueDate = new Date();
                    finalDueDate.setDate(finalDueDate.getDate() + days);
                }

                const data = {
                    installment_number: installment_number[index],
                    amount: amount[index] || 0,
                    percentage: percentage[index] || 0,
                    due_after_days: due_after_days[index] || 0,
                    due_date: finalDueDate,
                    installment_plan: {
                        connect: {
                            plan_name: plan_name
                        }
                    }
                };

                return prisma.installmentDetails.create({
                    data
                });
            })
        );

        res.status(201).json({ success: true, data: details });
    } catch (error) {
        console.error("Error adding installment details:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getInstallmentPlans = async (req, res) => {
    try {
        const plans = await prisma.installmentPlan.findMany({
            include: {
                installment_details: true
            }
        });

        return res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error("Error fetching installment plans:", error);
        return res.status(500).json({ success: false, message: "Database query failed" });
    }
};

export const getInstallmentPlanByName = async (req, res) => {
    try {
        const { plan_name } = req.params;
        if (!plan_name) {
            return res.status(400).json({ success: false, message: "Plan name is required." });
        }

        const plan = await prisma.installmentPlan.findUnique({
            where: { plan_name },
            include: {
                installment_details: true
            }
        });

        if (!plan) {
            return res.status(404).json({ success: false, message: "Installment plan not found." });
        }
        res.status(200).json({ success: true, data: plan });
    }
    catch (error) {
        console.error("Error fetching installment plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const updateInstallmentPlan = async (req, res) => {
    try {
        const { plan_name } = req.params;
        const { no_of_installments, installment_details } = req.body;

        if (!plan_name) {
            return res.status(400).json({ success: false, message: "Plan name is required." });
        }

        // First update the plan
        const updatedPlan = await prisma.installmentPlan.update({
            where: { plan_name },
            data: { 
                no_of_installments: no_of_installments ? parseInt(no_of_installments) : undefined
            }
        }); 

        if (!updatedPlan) {
            return res.status(404).json({ success: false, message: "Installment plan not found." });
        }

        // If installment details are provided, update them
        if (installment_details && Array.isArray(installment_details)) {
            // First delete existing details
            await prisma.installmentDetails.deleteMany({
                where: { plan_name }
            });

            // Then create new details
            const details = await Promise.all(
                installment_details.map(detail => {
                    let finalDueDate = new Date(detail.due_date);
                    if (!(finalDueDate instanceof Date) || isNaN(finalDueDate)) {
                        const days = detail.due_after_days || 0;
                        finalDueDate = new Date();
                        finalDueDate.setDate(finalDueDate.getDate() + days);
                    }

                    // Handle null/undefined values for amount and percentage
                    let amount = detail.amount === null || detail.amount === undefined ? null : detail.amount;
                    let percentage = detail.percentage === null || detail.percentage === undefined ? null : detail.percentage;

                    // Set explicitly to 0 only when needed
                    if (amount === null && percentage !== null) {
                        amount = 0;
                    } else if (percentage === null && amount !== null) {
                        percentage = 0;
                    }

                    return prisma.installmentDetails.create({
                        data: {
                            installment_number: detail.installment_number,
                            amount: amount,
                            percentage: percentage,
                            due_after_days: detail.due_after_days || 0,
                            due_date: finalDueDate,
                            installment_plan: {
                                connect: {
                                    plan_name: plan_name
                                }
                            }
                        }
                    });
                })
            );

            // Get the updated plan with details
            const updatedPlanWithDetails = await prisma.installmentPlan.findUnique({
                where: { plan_name },
                include: {
                    installment_details: true
                }
            });

            return res.status(200).json({ 
                success: true, 
                data: updatedPlanWithDetails,
                message: "Installment plan and details updated successfully"
            });
        }

        res.status(200).json({ 
            success: true, 
            data: updatedPlan,
            message: "Installment plan updated successfully"
        });  
        
    } catch (error) {
        console.error("Error updating installment plan:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteInstallmentPlan = async (req, res) => {
    try {
        const { plan_name } = req.params;

        if (!plan_name) {
            return res.status(400).json({
                success: false,
                message: "Plan name is required"
            });
        }

        // First, check if the plan exists
        const existingPlan = await prisma.installmentPlan.findUnique({
            where: { plan_name }
        });

        if (!existingPlan) {
            return res.status(404).json({
                success: false,
                message: "Installment plan not found"
            });
        }

        // First delete all related installment details
        await prisma.installmentDetails.deleteMany({
            where: { plan_name }
        });

        // Then delete the installment plan
        await prisma.installmentPlan.delete({
            where: { plan_name }
        });

        return res.status(200).json({
            success: true,
            message: "Installment plan and related details deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteInstallmentPlan:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting installment plan",
            error: error.message
        });
    }
};
