import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    tableId: {
      type: Number,
      required: true,
    },
    numberOfPersons: {
      type: Number,
      required: true,
    },
    reservationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

restaurant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Restaurant",
  required: true,
},
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", 
  required: true,
},
  });

  export default mongoose.model('Reservation', reservationSchema);