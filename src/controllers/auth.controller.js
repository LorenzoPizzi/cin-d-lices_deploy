import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { scrypt } from "../utils/scrypt.js";
import { StatusCodes } from "http-status-codes";
import { Role } from "../models/role.model.js";

export async function register(req, res) {
  const { first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = scrypt.hash(password);
    const userRole = await Role.findOne({ where: { roleName: "user" } });
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      id_role: userRole.id_role,
    });
    return res.status(StatusCodes.CREATED).json({
      id: user.id_user,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      let errorMsg = "Duplicate entry";
      if (error.errors.length > 0) {
        errorMsg = error.errors[0].message;
      }
      return res.status(StatusCodes.CONFLICT).json({
        error: errorMsg,
      });
    }
    throw new Error("Internal Server Error !");
  }
}
