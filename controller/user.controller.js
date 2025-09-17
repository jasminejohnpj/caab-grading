import User from "../model/user.js";
import branchAdmin from "../model/branchAdmin.js";
import questionResponse from "../model/response.js";


// In-memory OTP store (use Redis in production)
const otpStore = new Map();

const normalizeMobile = (mobile) => {
  if (!mobile) return '';
  let m = String(mobile).replace(/\s+/g, '').replace(/^\+/, '').replace(/\D/g, '');
  m = m.replace(/^0+/, ''); 
  if (m.length > 10) m = m.slice(-10); 
  return m;
};


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

export const generateOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const normMobile = normalizeMobile(mobile);

    if (!/^\d{10}$/.test(normMobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otp = (Math.floor(1000 + Math.random() * 9000)).toString();
    const ttl = 5 * 60 * 1000; // 5 minutes expiry

    otpStore.set(normMobile, { otp, expiresAt: Date.now() + ttl });

    return res.status(200).json({
      message: "OTP sent successfully",
      otpForTesting: otp,
    });
  } catch (err) {
    next(err);
  }
};

export const superadminOtp = async (req, res, next) => {
  try {
    const { caab_id, mobile, otp } = req.body;

    if (!caab_id) {
      return res.status(400).json({ message: "CAAB ID is required" });
    }

    const normMobile = normalizeMobile(mobile);
    if (!/^\d{10}$/.test(normMobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    if (!otp || otp.toString().length !== 4) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const entry = otpStore.get(normMobile);

    if (!entry) {
      return res.status(400).json({ message: "No OTP found for this mobile number" });
    }

    if (entry.expiresAt < Date.now()) {
      otpStore.delete(normMobile);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (entry.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(normMobile);

    const existingUser = await User.findOne({ where: { caab_id } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.mobile = normMobile;
    await existingUser.save();

    return res.status(200).json({
      message: "Mobile number updated successfully",
      phone: [existingUser.mobile],
    });
  } catch (error) {
    next(error);
  }
};

export const branch =async(req, res, next) =>{
    try {
        const { caab_id, branch_name, branch_email, branch_mobile_no, branch_admin_name, admin_no, admin_email, city, district, business_type, no_female, total_employees, no_contract, no_migrant ,role } = req.body;
        const branch = await branchAdmin.findOne({ where: { admin_email: admin_email } });
        if (branch) {
            return res.status(401).json({ message: "branch already registered" });
        }

        const latestBranch = await branchAdmin.findAll({
            order: [['branch_id', 'desc']],
            limit: 1
        });

        let newBranchId = "br1";

        if (latestBranch.length > 0 && latestBranch[0].branch_id) {
            const latestIdNumber = parseInt(latestBranch[0].branch_id.slice(2));
            newBranchId = `br${(latestIdNumber + 1).toString()}`;
            console.log(newBranchId);
        }
        const newBranch = await branchAdmin.create({
            caab_id,
            branch_id: newBranchId,
            branch_name,
            branch_email,
            branch_mobile_no,
            branch_admin_name,
            admin_no,
            admin_email,
            city,
            district,
            business_type,
            no_female,
            total_employees,
            no_contract,
            no_migrant,
            role
        });
        return res.status(200).json({ message: "branch added successfully" });
    } catch(error){
        next(error.message);
    }
}

export const branchList = async(req, res, next)=>{
    try {
        const { caab_id } = req.params;

        if (!caab_id) {
            return res.status(401).json({ message: "caab id is required" });
        }
        const caabId = await branchAdmin.findOne({where:{caab_id}});
        if(!caabId){
            return res.status(204).json({message:"no branches found"});
        }
        const branches = await branchAdmin.findAll({ where: { caab_id } });

        return res.status(200).json({ message: "branches are", branches });
        
    } catch(error){
        next(error.message)
    }
}

export const branchDetails = async(req, res, next) =>{
    try {
        const { branch_id } = req.params;
        if(!branch_id){
            return res.status(401).json({message:"branch id required"});
        }
        const branch = await branchAdmin.findOne({where:{branch_id}});
        if(!branch){
            return res.status(204).json({message:"Invalid branch id"});
        }
        const branchDetails = await branchAdmin.findAll({ where: { branch_id } });
        if (!branchDetails) {
            return res.status(204).json({ message: "branch details not found" });  
        }

        const branchResponses = await questionResponse.findAll({ where: { branch_id } });
        const NegativeCount = branchResponses.filter(response => {
            const res = response.response?.trim().toLowerCase();
            return res === "no"; 
          }).length;


        return res.status(200).json({ message: "branch details are:", branchDetails ,NegativeCount});
    }
    catch (error) {
        next(error.message)
    }
}

