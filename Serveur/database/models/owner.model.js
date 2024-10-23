import mongoose from "mongoose";
import User from "./user.model.js"; // Assurez-vous d'importer correctement le modèle User
import Plan from "./plan.model.js"; // Assurez-vous d'importer correctement le modèle Plan


const ownerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plan' 
  },
  restaurant: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Restaurant',
    default: []
  }

});

ownerSchema.pre('save', async function(next) {
  try {
    const user = await User.findById(this.user);
    if (!user) {
      throw new Error('User not found');
    }

    if (this.plan) {
      const plan = await Plan.findById(this.plan);
      if (!plan) {
        throw new Error('Plan not found');
      }
    }


    if (this.plan) {
      const plan = await Plan.findById(this.plan);
      if (!plan) {
        throw new Error('Plan not found');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Owner = mongoose.model('Owner', ownerSchema);
export { Owner };
