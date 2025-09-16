import jwt from "jsonwebtoken";
import caabAdmin from "../model/caabAdmin.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const userId = decoded.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const admin = await caabAdmin.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
