import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is missing in .env");
}

export const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: "7d" });

export const verifyToken = (token) =>
  jwt.verify(token, SECRET);
