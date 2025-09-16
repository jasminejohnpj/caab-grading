import User from "../model/user.js";
import branchAdmin from "../model/branchAdmin.js";



const otpStore = {};


export const companyInfo = async (req, res, next) => {
    try {
        const { caab_id } = req.params;
        if (!caab_id) {
            return res.status(400).json({ message: "caab id is required" });
        }
        const company = await User.findOne({ where: { caab_id } });
        if (!company) {
            return res.status(204).json({ message: "Company not found" });
        }
        const noOfBranch = await branchAdmin.count({
            where: { caab_id }
        });
        const branchData = await branchAdmin.findAll({
            where: { caab_id },
            attributes: ['business_type'],
        });
        const businessTypes = [...new Set(branchData.map(item => item.business_type))];
        const selectedBusinessType = businessTypes.length > 0 ? businessTypes[0] : null;

        const companyInfo = {
            ...company.dataValues,
            noOfBranch,
            selectedBusinessType
        };

        return res.status(200).json({ message: "company details ", companyInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const editCompany = async(req, res, next)=>{
    try {
        const { caab_id } = req.params;
        const data = req.body;
        if (!caab_id) {
            return res.status(401).json({ message: "caab id is required" });
        }
        const company = await User.findOne({ where: { caab_id } });
        if (!company) {
            return res.status(204).json({ message: "company not found" });
        }
        const user = await User.update(data, { where: { caab_id } });
        return res.status(200).json({ message: "company details are updated" });
    } catch (error) {
        next(error.message)
    }
}

export const superadminOtp = async(req, res, next) =>{
     try {
        const { caab_id, mobile, otp } = req.body;

        if (!caab_id) {
            return res.status(400).json({ message: "CAAB ID is required" });
        }

        if (!mobile || !/^\d{10}$/.test(mobile)) {
            return res.status(401).json({ message: "Invalid mobile number" });
        }

        if (!otp || otp.toString().length !== 4) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const storedOtp = otpStore[mobile];
        if (!storedOtp) {
            return res.status(400).json({ message: "No OTP found for this mobile number" });
        }

        if (storedOtp.toString() !== otp.toString()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        delete otpStore[mobile];

        const existingUser = await User.findOne({ where: { caab_id } });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        existingUser.mobile = mobile; 
        await existingUser.save();  

        return res.status(200).json({
            message: "Mobile number updated successfully",
            phone: [existingUser.mobile]
        });
    } catch (error) {
        next(error.message);
    }
}




// router.post('/verifySuperAdminOtp', async (req, res) => {
//     try {
//         const { caab_id, mobile, otp } = req.body;

//         if (!caab_id) {
//             return res.status(400).json({ message: "CAAB ID is required" });
//         }

//         if (!mobile || !/^\d{10}$/.test(mobile)) {
//             return res.status(401).json({ message: "Invalid mobile number" });
//         }

//         if (!otp || otp.toString().length !== 4) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         const storedOtp = otpStore[mobile];
//         if (!storedOtp) {
//             return res.status(400).json({ message: "No OTP found for this mobile number" });
//         }

//         if (storedOtp.toString() !== otp.toString()) {
//             return res.status(400).json({ message: "Invalid OTP" });
//         }

//         delete otpStore[mobile];

//         const existingUser = await User.findOne({ where: { caab_id } });

//         if (!existingUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         existingUser.mobile = mobile; // Assign new value to the `mobile` field
//         await existingUser.save();   // Save changes to the database

//         return res.status(200).json({
//             message: "Mobile number updated successfully",
//             phone: [existingUser.mobile]
//         });
//     } catch (error) {
//         //console.error( error);
//         return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// });




