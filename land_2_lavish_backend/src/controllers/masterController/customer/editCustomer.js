import prisma from "../../../db/index.js";

export const editCustomer = async (req, res) => {
    try {
        console.log("Received request body for update:", req.body);

        const { customer_id } = req.params;
        const { 
            project_id, broker_id, property_type, booking_receipt_no, name, 
            father_husband_name, grandfather_name, allottee_dob, permanent_address, 
            full_postal_address, city, state, pincode, country, email, mobile, 
            std_isd_code, phone, fax, income_tax_ward_no, dist_no, pan_no, 
            aadhar_no, gstin, paid_100_percent, nominee_name, nominee_address 
        } = req.body;

        // Validation
        if (!customer_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Customer ID is required." 
            });
        }

        if (property_type && !['2bhk', '3bhk', 'restaurant', 'villa'].includes(property_type)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid property type." 
            });
        }

        if (pan_no && pan_no.length !== 10) {
            return res.status(400).json({ 
                success: false, 
                message: "PAN number must be exactly 10 characters." 
            });
        }

        if (aadhar_no && aadhar_no.length !== 12) {
            return res.status(400).json({ 
                success: false, 
                message: "Aadhar number must be exactly 12 digits." 
            });
        }

        if (mobile && !/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid mobile number. It must be 10 digits." 
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format." 
            });
        }

        // Transaction for all database operations
        const updatedCustomer = await prisma.$transaction(async (tx) => {
            // Check if customer exists
            const existingCustomer = await tx.customer.findUnique({
                where: { customer_id }
            });

            if (!existingCustomer) {
                throw { code: 'NOT_FOUND', message: "Customer not found." };
            }

            // Check if project exists if project_id is provided
            if (project_id) {
                const projectExists = await tx.project.findUnique({
                    where: { project_id }
                });

                if (!projectExists) {
                    throw { 
                        code: 'INVALID_PROJECT', 
                        message: `Invalid project_id: ${project_id}. No matching project found.` 
                    };
                }
            }

            // Check for unique constraints (email, mobile, pan_no, aadhar_no)
            if (email && email !== existingCustomer.email) {
                const emailExists = await tx.customer.findFirst({
                    where: { 
                        email,
                        NOT: { customer_id }
                    }
                });
                if (emailExists) {
                    throw { code: 'DUPLICATE_EMAIL' };
                }
            }

            if (mobile && mobile !== existingCustomer.mobile) {
                const mobileExists = await tx.customer.findFirst({
                    where: { 
                        mobile,
                        NOT: { customer_id }
                    }
                });
                if (mobileExists) {
                    throw { code: 'DUPLICATE_MOBILE' };
                }
            }

            if (pan_no && pan_no !== existingCustomer.pan_no) {
                const panExists = await tx.customer.findFirst({
                    where: { 
                        pan_no,
                        NOT: { customer_id }
                    }
                });
                if (panExists) {
                    throw { code: 'DUPLICATE_PAN' };
                }
            }

            if (aadhar_no && aadhar_no !== existingCustomer.aadhar_no) {
                const aadharExists = await tx.customer.findFirst({
                    where: { 
                        aadhar_no,
                        NOT: { customer_id }
                    }
                });
                if (aadharExists) {
                    throw { code: 'DUPLICATE_AADHAR' };
                }
            }

            // Update customer
            return await tx.customer.update({
                where: { customer_id },
                data: {
                    project_id: project_id !== undefined ? project_id : existingCustomer.project_id,
                    broker_id: broker_id !== undefined ? broker_id : existingCustomer.broker_id,
                    property_type: property_type !== undefined ? property_type : existingCustomer.property_type,
                    booking_receipt_no: booking_receipt_no !== undefined ? booking_receipt_no : existingCustomer.booking_receipt_no,
                    name: name !== undefined ? name : existingCustomer.name,
                    father_husband_name: father_husband_name !== undefined ? father_husband_name : existingCustomer.father_husband_name,
                    grandfather_name: grandfather_name !== undefined ? grandfather_name : existingCustomer.grandfather_name,
                    allottee_dob: allottee_dob !== undefined ? new Date(allottee_dob) : existingCustomer.allottee_dob,
                    permanent_address: permanent_address !== undefined ? permanent_address : existingCustomer.permanent_address,
                    full_postal_address: full_postal_address !== undefined ? full_postal_address : existingCustomer.full_postal_address,
                    city: city !== undefined ? city : existingCustomer.city,
                    state: state !== undefined ? state : existingCustomer.state,
                    pincode: pincode !== undefined ? pincode : existingCustomer.pincode,
                    country: country !== undefined ? country : existingCustomer.country,
                    email: email !== undefined ? email : existingCustomer.email,
                    mobile: mobile !== undefined ? mobile : existingCustomer.mobile,
                    std_isd_code: std_isd_code !== undefined ? std_isd_code : existingCustomer.std_isd_code,
                    phone: phone !== undefined ? phone : existingCustomer.phone,
                    fax: fax !== undefined ? fax : existingCustomer.fax,
                    income_tax_ward_no: income_tax_ward_no !== undefined ? income_tax_ward_no : existingCustomer.income_tax_ward_no,
                    dist_no: dist_no !== undefined ? dist_no : existingCustomer.dist_no,
                    pan_no: pan_no !== undefined ? pan_no : existingCustomer.pan_no,
                    aadhar_no: aadhar_no !== undefined ? aadhar_no : existingCustomer.aadhar_no,
                    gstin: gstin !== undefined ? gstin : existingCustomer.gstin,
                    paid_100_percent: paid_100_percent !== undefined ? paid_100_percent : existingCustomer.paid_100_percent,
                    nominee_name: nominee_name !== undefined ? nominee_name : existingCustomer.nominee_name,
                    nominee_address: nominee_address !== undefined ? nominee_address : existingCustomer.nominee_address
                }
            });
        });

        res.status(200).json({ 
            success: true, 
            data: updatedCustomer 
        });

    } catch (error) {
        console.error("Error updating customer:", error);

        // Handle custom error codes
        if (error.code === 'NOT_FOUND') {
            return res.status(404).json({ 
                success: false, 
                message: error.message 
            });
        }

        if (error.code === 'INVALID_PROJECT') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }

        // Handle duplicate field errors
        if (error.code === 'DUPLICATE_EMAIL') {
            return res.status(409).json({ 
                success: false, 
                message: "Email already exists for another customer." 
            });
        }

        if (error.code === 'DUPLICATE_MOBILE') {
            return res.status(409).json({ 
                success: false, 
                message: "Mobile number already exists for another customer." 
            });
        }

        if (error.code === 'DUPLICATE_PAN') {
            return res.status(409).json({ 
                success: false, 
                message: "PAN already registered for another customer." 
            });
        }

        if (error.code === 'DUPLICATE_AADHAR') {
            return res.status(409).json({ 
                success: false, 
                message: "Aadhar number already registered for another customer." 
            });
        }

        // Handle Prisma errors
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            let message = "Duplicate value error";
            if (target?.includes('email')) message = "Email already exists for another customer";
            if (target?.includes('mobile')) message = "Mobile number already exists for another customer";
            if (target?.includes('pan_no')) message = "PAN already registered for another customer";
            if (target?.includes('aadhar_no')) message = "Aadhar number already registered for another customer";

            return res.status(409).json({ 
                success: false, 
                message 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};