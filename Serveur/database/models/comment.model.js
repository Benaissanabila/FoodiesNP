import mongoose from "mongoose";
import User from "./user.model.js"; 
import Reservation from "./reservation.model.js"; 

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  quality: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  cleanliness: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  service: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  ambiance: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minLength: [10, "Comment must have at least 10 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.pre('save', async function(next) {
  try {
    const user = await User.findById(this.user);
    if (!user) {
      throw new Error('User not found');
    }

    const reservation = await Reservation.findById(this.reservation);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Comment", commentSchema);
