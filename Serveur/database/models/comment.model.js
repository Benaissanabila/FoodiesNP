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
   globalRating: {
    type: Number,
    min: 1,
    max: 5,  
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
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
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant", 
    required: true,
  },

});


// Middleware to calculate globalRating before saving
commentSchema.pre("save", function (next) {
  
  this.globalRating = (this.service + this.quality + this.ambiance) / 3;
  next();
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

// Hook post-save : recalculer la note du restaurant après avoir ajouté un commentaire
commentSchema.post("save", async function () {
  const Restaurant = mongoose.model("Restaurant");
  const restaurant = await Restaurant.findById(this.restaurant);
  if (restaurant) {
    await restaurant.calculateGlobalRating();
  }
});

// Hook post-remove : recalculer la note du restaurant après avoir supprimé un commentaire
commentSchema.post("remove", async function () {
  const Restaurant = mongoose.model("Restaurant");
  const restaurant = await Restaurant.findById(this.restaurant);
  if (restaurant) {
    await restaurant.calculateGlobalRating();
  }
});


export default mongoose.model("Comment", commentSchema);
