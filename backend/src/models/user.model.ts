// ============================================================
// 🧩 UserModel — Defines the user data model
// ============================================================
import compressionMiddleware from "@/middlewares/compression.middleware.js";
import mongoose, { Schema, Model, HydratedDocument, Types } from "mongoose";
import bcrypt from "bcrypt";

// ------------------------------------------------------
// Define User Interface
// ------------------------------------------------------
export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  roles: "admin" | "editor" | "author" | "user";
  avatarUrl?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
  };
  googleId?: string;
  githubId?: string;
  lastLogin?: Date;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for User Methods
export interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// Type for User Model
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
export type UserModelType = Model<IUser, Record<string, never>, IUserMethods>;
export type UserObject = IUser;

// ------------------------------------------------------
// Define User Schema
// ------------------------------------------------------
const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    roles: {
      type: String,
      enum: ["admin", "editor", "author", "user"],
      default: "user",
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    socialLinks: {
      twitter: { type: String, trim: true },
      facebook: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
    },
    googleId: {
      type: String,
      trim: true,
      unique: true,
    },
    githubId: {
      type: String,
      trim: true,
      unique: true,
    },
    lastLogin: {
      type: Date,
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// ------------------------------------------------------
// Hash password before saving
// ------------------------------------------------------
userSchema.pre<UserDocument>("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);

  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
});

// ------------------------------------------------------
// Method to comare password
// ------------------------------------------------------
userSchema.method(
  "comparePassword", // Method name
  async function (enteredPassword: string): Promise<boolean> {
    // Compare entered password with stored hashed password
    return await bcrypt.compare(enteredPassword, this.password);
  }
);

// ------------------------------------------------------
// Transform output (remove passwor,__v)
// ------------------------------------------------------
userSchema.set("toJSON", {
  transform(_, ret: Partial<IUser> & { __v?: number }) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// ------------------------------------------------------
// Virtuals (it will not be stored in DB and sued to query and populate data)
// ------------------------------------------------------

// ------------------------------------------------------
// User Model export
// ------------------------------------------------------
const UserModel = mongoose.model<IUser, UserModelType>("User", userSchema);

export default UserModel;
