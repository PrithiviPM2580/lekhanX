// ============================================================
// 🧩 AuthDao — Handles data access for authentication
// ============================================================

import TokenModel from "@/models/token.model.js";
import UserModel from "@/models/user.model.js";

// ------------------------------------------------------
// isUserExistsByEmail() — Checks if a user exists by email
// ------------------------------------------------------
export const isUserExistsByEmail = async (email: string): Promise<boolean> => {
  return Boolean(await UserModel.exists({ email }));
};

// ------------------------------------------------------
// createUser() — Creates a new user in the database
// ------------------------------------------------------
export const createUser = async (data: CreateUser) => {
  // Create and return the new user document
  return await UserModel.create(data);
};

// ------------------------------------------------------
// createToken() — Creates a new token in the database
// ------------------------------------------------------
export const createToken = async (data: CreateToken) => {
  // Create and return the new token document
  return await TokenModel.create(data);
};

// ------------------------------------------------------
// findUserByEmail() — Finds a user by email
// ------------------------------------------------------
export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email }).select("+password");
};
