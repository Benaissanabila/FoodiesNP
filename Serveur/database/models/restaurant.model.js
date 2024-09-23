import mongoose from "mongoose";
import { Owner } from "./owner.model.js";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Name must have at least 3 letters"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minLength: [3, "Address must have at least 3 letters"],
  },
  cuisineType: {
    type: String,
    trim: true,
  },
  schedule: {
    type: String,
    trim: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
});

restaurantSchema.pre('save', async function(next) {
  try {
    const owner = await Owner.findById(this.owner);
    if (!owner) {
      throw new Error('Owner not found');
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export { Restaurant };
