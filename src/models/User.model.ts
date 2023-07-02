import mongoose, { Schema } from "mongoose";
import { hash, genSaltSync } from "bcrypt";

export interface UserProps extends Document {
  name: string;
  lastname: string;
  password: string;
  email: string;
  salt: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  is_deleted: boolean;
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
  hashPassword: (password: string, salt: string) => Promise<string>;
  validatePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserProps>(
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
  const hashpass = await hash(password, salt);
  return hashpass;
};
userSchema.methods.validatePassword = async function (password: string) {
  const hashpass = await this.hashPassword(password, this.salt);
  return hashpass === this.password;
};
userSchema.pre<UserProps>("save", async function () {
  const salt = genSaltSync();

  this.salt = salt;

  try {
    const hashpass = await this.hashPassword(this.password, salt);
    this.password = hashpass;
  } catch (error) {
    console.error(error);
  }
});
const User = mongoose.model<UserProps>("Users", userSchema);

export default User;