import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must have at least 3 letters "],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email or password invalid"],
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    UserPhoto: {
      type: String,
      trim: true,
      required: false,
    },
    DOB: {
      type: Date,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], 
      default: 'user', 
    },
    twoFactorCode: { 
      type: String, 
      
    }
  },
  { timestamps: true }
);

// Avant de sauvegarder, crypter le mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
