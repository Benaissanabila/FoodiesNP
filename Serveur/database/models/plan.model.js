import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['gratuit','premium'],
    default: 'gratuit',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 
  },
  description: {
    type: String,
    trim: true,
    required: false 
  }
}, { timestamps: true });

export default mongoose.model("Plan", planSchema);
