import mongoose, { Schema } from "mongoose";
import { hash, genSaltSync } from "bcrypt";

interface UserProps extends Document {
  name: string;
  lastname: string;
  password: string;
  email: string;
  salt: string;
  is_admin: boolean;
  is_active: boolean;
  urlphoto: string;
  pendingPackages?: Schema.Types.ObjectId[];
  currentPackage?: Schema.Types.ObjectId;
  historyPackages?: Schema.Types.ObjectId[];
  hashPassword: (password: string, salt: string) => Promise<string>;
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
