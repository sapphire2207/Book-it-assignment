import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectToDB from "./db/dbConnect.js";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));

import experienceRoutes from "./routes/experience.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import promoRoutes from "./routes/promo.routes.js";

app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);

connectToDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log("❌ MongoDB connection failed:", error));