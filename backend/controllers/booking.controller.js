import Booking from "../models/booking.model.js";
import Experience from "../models/experience.model.js";

export const createBooking = async (req, res) => {
  try {
    const { experienceId, name, email, slot, promoCode, totalPrice } = req.body;

    const experience = await Experience.findById(experienceId);
    if (!experience)
      return res.status(404).json({ message: "Experience not found" });

    const selectedSlot = experience.slots.find(
      (s) => s.date === slot.date && s.time === slot.time
    );

    if (!selectedSlot)
      return res.status(400).json({ message: "Invalid slot" });
    if (selectedSlot.bookedCount >= selectedSlot.capacity)
      return res.status(400).json({ message: "Slot is fully booked" });

    selectedSlot.bookedCount += 1;
    if (selectedSlot.bookedCount >= selectedSlot.capacity) {
      selectedSlot.isBooked = true;
    }

    await experience.save();

    const refId = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const booking = await Booking.create({
      experienceId,
      name,
      email,
      slot,
      promoCode,
      totalPrice,
      refId,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
