# BookIt: Experiences & Slots

**BookIt** is a full-stack web application that allows users to browse travel experiences, view slot availability, apply promo codes, and complete bookings seamlessly.  
Built with **React (Vite + TypeScript)** on the frontend and **Node.js + Express + MongoDB** on the backend, the app demonstrates a real-world travel booking flow from browsing to confirmation.

---

## Live Demo

**Frontend:** [https://book-it-assignment-8iqk.vercel.app/](#)   
**GitHub Repository:** [https://github.com/sapphire2207/Book-it-assignment](#)

---

## Project Overview

### Objective
To build a complete end-to-end booking system where users can:
- Explore curated travel experiences.
- View available slots for each experience.
- Apply promo codes for discounts.
- Complete a booking and receive confirmation.

---

## Tech Stack

### Frontend
- **Framework:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Context API
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Environment Variables:** dotenv
- **CORS Enabled**

---

## Core Features

### Home Page (Dashboard)
- Displays all available experiences from the backend.
- Search by title or location.
- Responsive card layout with aligned pricing and details buttons.

### Details Page
- Shows detailed information about a selected experience.
- Displays available dates and time slots dynamically.
- Prevents booking already-filled slots.

### Checkout Page
- Collects user details (name, email, phone).
- Supports promo code validation (e.g., `SAVE10`, `FLAT100`).
- Displays dynamic price summary.

### Confirmation Page
- Displays success or failure message after booking.
- Shows booking reference ID, amount, and timestamp.

---

## API Endpoints

### Experience Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/experiences` | Get all experiences |
| GET | `/api/experiences/:id` | Get details and slots for a specific experience |

### Booking Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/bookings` | Create a new booking |
| POST | `/api/promo/validate` | Validate a promo code |

---

## Sample Data Seeding

A `seed.js` file is provided to populate MongoDB with 10–15 dummy travel experiences.  
Run the following command after configuring MongoDB:

```bash
npm run seed
