/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

export const generateToken = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(500).json({ message: "No user found for token generation" });
    }

    const token = jwt.sign(
      { id: user.Id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );



    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
