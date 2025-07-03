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

export async function login(req, res) {
  const emailFromRequest = req.body.email;
  const passwordFromRequest = req.body.password;

  try {
    const user = await User.findOne({ where: { email: emailFromRequest } });

    if (user) {
      if (scrypt.compare(passwordFromRequest, user.password)) {
        const token = jwt.sign(
          { id_user: user.id_user },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });
        return res.redirect("/profile");
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "couple login / mdp incorrect" });
      }
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "couple login / mdp incorrect" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "merci de réessayer ultérieurement" });
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  return res.redirect("/");
}
