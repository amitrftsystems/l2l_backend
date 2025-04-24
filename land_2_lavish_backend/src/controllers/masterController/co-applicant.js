import prisma from "../../db/index.js";

export const addCoApplicant = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        if (typeof req.body !== "object") {
            return res.status(400).json({ success: false, message: "Invalid JSON format." });
        }

        const {
            customer_id,
            is_applicant = false,
            name,
            guardian_name = null,
            address,
            mobile = null,
            email = null,
            phone = null,
            fax = null,
            occupation = null,
            income_tax_ward_no = null,
            dist_no = null,
            pan_no = null,
            dob = null,
            nationality = 'Resident Indian'
        } = req.body;

        // --- Validations ---
        if (!customer_id || !name || !address) {
            return res.status(400).json({ success: false, message: "customer_id, name, and address are required." });
        }

        if (pan_no && pan_no.length !== 10) {
            return res.status(400).json({ success: false, message: "PAN number must be exactly 10 characters." });
        }

        if (mobile && !/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ success: false, message: "Invalid mobile number. It must be 10 digits." });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        // --- Insert into DB ---
        const newCoApplicant = await prisma.coApplicant.create({
            data: {
                customer_id,
                is_applicant,
                name,
                guardian_name,
                address,
                mobile,
                email,
                phone,
                fax,
                occupation,
                income_tax_ward_no,
                dist_no,
                pan_no,
                dob: dob ? new Date(dob) : null,
                nationality
            },
        });

        return res.status(201).json({ success: true, data: newCoApplicant });

    } catch (error) {
        console.error("Error submitting co-applicant:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}; 