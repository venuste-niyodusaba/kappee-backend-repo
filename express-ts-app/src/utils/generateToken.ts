import * as jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: "7h" }
  );
};
