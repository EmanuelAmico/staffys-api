import mongoose, { Schema } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";
import crypto from "crypto";

export interface User extends Document {
  name: string;
  lastname: string;
  password: string;
  email: string;
  salt: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  is_deleted: boolean;
  resetToken?: string;
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
  hashPassword: (password: string, salt: string) => Promise<string>;
  validatePassword: (password: string) => Promise<boolean>;
  generateResetPasswordCode: () => Promise<string>;
  resetPassword: (code: string, password: string) => Promise<void>;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    is_admin: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    urlphoto: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
    resetToken: { type: String, unique: true, default: null },
    pendingPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
    currentPackage: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    historyPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.hashPassword = async function (
  password: string,
  salt: string
) {
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

userSchema.methods.validatePassword = async function (password: string) {
  const isMatch = await compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateResetPasswordCode = async function () {
  const code = crypto.randomInt(100000, 1000000).toString();
  const hashedCode = await this.hashPassword(code, this.salt);
  this.resetToken = hashedCode;
  await this.save();
  return code;
};

userSchema.methods.resetPassword = async function (
  code: string,
  newPassword: string
) {
  const isMatch = await compare(code, this.resetToken);
  if (!isMatch) {
    throw new Error("Invalid code");
  }

  const hashedPassword = await this.hashPassword(newPassword, this.salt);
  this.password = hashedPassword;
  this.resetToken = undefined;
  await this.save();
};

userSchema.pre<User>("save", async function () {
  try {
    const salt = await genSalt();
    const hashedPassword = await this.hashPassword(this.password, salt);

    this.salt = salt;
    this.password = hashedPassword;
  } catch (error) {
    console.error(error);
  }
});

const User = mongoose.model<User>("Users", userSchema);

export { User };
