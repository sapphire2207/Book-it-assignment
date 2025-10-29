import mongoose, { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
  name: String,
  email: String,
  slot: {
    date: String,
    time: String
  },
  totalPrice: Number,
  promoCode: String,
  refId: { type: String, unique: true },
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now }
});

const Booking = model("Booking", bookingSchema);
export default Booking;
