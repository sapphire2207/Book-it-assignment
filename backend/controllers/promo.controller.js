import Experience from "../models/experience.model.js";

export const validatePromo = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.trim() === "") {
      return res.status(400).json({ valid: false, message: "Promo code is required" });
    }

    const experience = await Experience.findOne({
      "promoCode.code": { $regex: new RegExp(`^${code}$`, "i") },
    });

    if (!experience) {
      return res.status(400).json({ valid: false, message: "Invalid promo code" });
    }

    const promo = experience.promoCode.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );

    if (!promo) {
      return res.status(400).json({ valid: false, message: "Invalid promo code" });
    }

    res.json({
      valid: true,
      discountType: promo.discountType,
      amount: promo.amount,
      experienceId: experience._id,
    });
  } catch (err) {
    console.error("Error validating promo:", err);
    res.status(500).json({ error: err.message });
  }
};
