import { Schema, model } from "mongoose";

const slotSchema = new Schema({
  date: String,
  time: String,
  capacity: { type: Number, default: 5 },
  bookedCount: { type: Number, default: 0 },
  isBooked: { type: Boolean, default: false }
});

const promoSchema = new Schema({
  code: String,
  discountType: { type: String, enum: ["flat", "percent"] },
  amount: Number
});

const experienceSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  location: String,
  slots: [slotSchema],
  promoCode: [promoSchema],
});

const Experience = model("Experience", experienceSchema);
export default Experience;
