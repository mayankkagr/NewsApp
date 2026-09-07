import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;