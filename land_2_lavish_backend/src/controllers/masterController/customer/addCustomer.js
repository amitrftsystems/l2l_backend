import prisma from "../../../db/index.js";

export const addCustomer = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        // Required fields validation
        const requiredFields = {
            customer_id: "Manual Application Number is required",
            project_id: "Project selection is required",
            name: "Name is required",
            father_husband_name: "Father/Husband name is required",
            permanent_address: "Permanent address is required",
            mobile: "Phone number is required"
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([field]) => !req.body[field])
            .map(([_, message]) => message);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: missingFields
            });
        }

        const { 
            customer_id, project_id, broker_id, 
            booking_receipt_no, name, father_husband_name, 
            grandfather_name, allottee_dob, permanent_address, 
            mailing_address_1, mailing_address_2, city, state, 
            pincode, country, email, mobile, std_isd_code, phone, 
            fax, income_tax_ward_no, dist_no, pan_no, aadhar_no, 
            gstin, paid_100_percent, nominee_name, nominee_address 
        } = req.body;

        const full_postal_address = [mailing_address_1, mailing_address_2]
            .filter(Boolean)
            .join(', ');

        // Format validations
        if (pan_no && pan_no.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: ["PAN number must be exactly 10 characters"]
            });
        }

        if (aadhar_no && aadhar_no.length !== 12) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: ["Aadhar number must be exactly 12 digits"]
            });
        }

        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: ["Invalid phone number (10 digits required)"]
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: ["Invalid email format"]
            });
        }

        // Database operations
        const newCustomer = await prisma.$transaction(async (tx) => {
            // Check existing email
            if (email) {
                const existingEmail = await tx.customer.findUnique({
                    where: { email }
                });
                if (existingEmail) {
                    throw { code: 'CONFLICT', field: 'email' };
                }
            }

            // Check existing customer_id
            const existingCustomerId = await tx.customer.findUnique({
                where: { customer_id }
            });
            if (existingCustomerId) {
                throw { code: 'CONFLICT', field: 'customer_id' };
            }

            // Create customer
            return await tx.customer.create({
                data: {
                    customer_id,
                    project_id,
                    broker_id: broker_id || null,
                    property_type: null,
                    booking_receipt_no: booking_receipt_no || null,
                    name,
                    father_husband_name: father_husband_name || null,
                    grandfather_name: grandfather_name || null,
                    allottee_dob: allottee_dob ? new Date(allottee_dob) : null,
                    permanent_address,
                    full_postal_address,
                    city: city || null,
                    state: state || null,
                    pincode: pincode || null,
                    country: country || 'India',
                    email: email || null,
                    mobile,
                    std_isd_code: std_isd_code || null,
                    phone: phone || null,
                    fax: fax || null,
                    income_tax_ward_no: income_tax_ward_no || null,
                    dist_no: dist_no || null,
                    pan_no: pan_no || null,
                    aadhar_no: aadhar_no || null,
                    gstin: gstin || null,
                    paid_100_percent: paid_100_percent || false,
                    nominee_name: nominee_name || null,
                    nominee_address: nominee_address || null
                }
            });
        });

        res.status(201).json({
            success: true,
            data: newCustomer
        });

    } catch (error) {
        console.error("Error submitting customer:", error);

        // Handle unique constraint errors
        if (error.code === 'P2002') {
            const errors = [];
            const target = error.meta?.target;
            if (target?.includes('email')) errors.push("Email already exists");
            if (target?.includes('mobile')) errors.push("Mobile number already exists");
            if (target?.includes('pan_no')) errors.push("PAN already registered");
            if (target?.includes('aadhar_no')) errors.push("Aadhar number already registered");
            if (target?.includes('customer_id')) errors.push("Manual Application Number already exists");
            
            return res.status(409).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Handle manual conflict checks
        if (error.code === 'CONFLICT') {
            const errors = [];
            if (error.field === 'email') errors.push("Email already exists");
            if (error.field === 'customer_id') errors.push("Manual Application Number already exists");
            
            return res.status(409).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
