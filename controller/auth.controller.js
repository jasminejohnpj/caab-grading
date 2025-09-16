import bcrypt from "bcryptjs";
import caabAdmin from "../model/caabAdmin.js";
import User from "../model/user.js";
import branchAdmin from "../model/branchAdmin.js";

const otpStore = {};

function generateOTP() {

  return Math.floor(1000 + Math.random() * 9000);
}

export const createAdmin = async (req, res, next) => {
  try {
    const { user_name, password } = req.body;
    if (!user_name || !password) {
      return res.status(401).json({ message: "Username and password are required" });
    }
    const user = await caabAdmin.findOne({ where: { user_name } });
    if (user) {
      return res.status(403).json({ message: "admin alredy registered" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await caabAdmin.create({
      user_name,
      password: hashedPassword
    });
    return res.status(200).json({ message: "admin created successfully", newuser });
  } catch (error) {
    console.log(error);
    next(error.message)
  }

}

export const adminLogin = async (req, res, next) => {
  try {
    const { user_name, password } = req.body;

    const user = await caabAdmin.findOne({ where: { user_name } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    next(error.message)
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(401).json({ message: "Invalid mobile number" });
    }
    const otp = generateOTP();
    otpStore[mobile] = otp;
    return res.status(200).json({ message: "OTP sent successfully", otp });
  }
  catch (error) {
    next(error.message);
  }
}

export const verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(401).json({ message: "Invalid mobile number" });
    }

    if (!otp || otp.toString().length !== 4) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const storedOtp = otpStore[mobile];
    if (!storedOtp) {
      return res.status(400).json({ message: 'No OTP found for this mobile number' });
    }

    if (storedOtp.toString() !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otpStore[mobile];

    const user = await User.findOne({ where: { mobile } });
    let existingUser = null;

    if (user) {
      existingUser = {
        caab_id: user.caab_id || null,
        email: user.email || null,
        user_name: user.user_name || null,
        company_name: user.company_name || null,
        mobile: user.mobile,
        employer_category: user.employer_category || null,
        role: user.role
      };
    } else {
      const branch = await branchAdmin.findOne({ where: { branch_mobile_no: mobile } });
      if (branch) {
        existingUser = {
          caab_id: branch.caab_id || null,
          branch_name: branch.branch_name || null,
          branch_id: branch.branch_id || null,
          branch_mobile_no: branch.branch_mobile_no || null,
          branch_admin_name: branch.branch_admin_name,
          admin_no: branch.admin_no || null,
          admin_email: branch.admin_email || null,
          city: branch.city || null,
          district: branch.district || null,
          business_type: branch.business_type || null,
          no_female: branch.no_female || null,
          total_employees: branch.total_employees || null,
          no_contract: branch.no_contract || null,
          no_migrant: branch.no_migrant || null,
          role: branch.role
        };
      }
    }

    if (existingUser) {


      const token = jwt.sign({ existingUser }, process.env.JWT_SECRET);
      return res.status(200).json({
        message: "Login successful",
        activeUser: true,
        existingUser,
        token

      });
    } else {
      return res.status(202).json({
        message: "Your account has been created",
        activeUser: false
      });
    }
  } catch (error) {
    next(error.message);
  }
}


export const company = async (req, res, next) => {
  try {
    const { email, user_name, company_name, mobile, employer_category, role } = req.body;

    const existingUser = await User.findOne({ where: { email, company_name } });
    if (existingUser) {
      return res.status(409).json({ message: "Company already registered" });
    }

    const latestUser = await User.findOne({
      order: [['caab_id', 'DESC']],
    });


    let newCaabId = "CAAB2001";

    if (latestUser && latestUser.caab_id) {
      const latestIdNumber = parseInt(latestUser.caab_id.slice(4), 10);
      newCaabId = `CAAB${(latestIdNumber + 1).toString().padStart(4, '0')}`;
    }
    const newUser = await User.create({
      caab_id: newCaabId,
      email,
      user_name,
      company_name,
      mobile,
      employer_category,
      role
    });

    return res.status(200).json({ message: "Company registered successfully", data: newUser });
  } catch (error) {
    console.log(error);
    next(error.message)
  }
}






