# Inspirante — College Event Registration Portal

A full-stack web application that allows college administrators to manage events and students to register for them.

---

## Tech Stack

- **Frontend:** React (Vite), pure CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken), bcryptjs

---

## Prerequisites

- Node.js (v18 or above)
- MongoDB (running locally)
- npm

---

## Getting Started

**1. Clone the repository**

    git clone https://github.com/YashwanthShetty15/inspirante-yashwanth.git
    cd inspirante-yashwanth

**2. Install backend dependencies**

    cd backend
    npm install

**3. Install frontend dependencies**

    cd ../frontend
    npm install

**4. Set up environment variables**

Copy .env.example to .env and fill in:

    PORT=3000
    MONGO_URI=mongodb://localhost:27017/inspirante
    JWT_SECRET=your_secret_key_here

**5. Seed the database**

    cd backend
    node seed.js

This creates 1 admin, 11 students and 5 sample events.

**6. Start the backend**

    cd backend
    node server.js

You should see: Server running on port 3000 and MongoDB connected.

**7. Start the frontend**

Open a new terminal:

    cd frontend
    npm run dev

Open http://localhost:5173 in your browser.

---

## Sample Credentials

**Admin**
- Username: admin
- Password: inspirante2026

**Students**
- Username: asha.rao / Password: student123
- Username: ravi.shetty / Password: student123

---

## Features

- JWT-based authentication with role-based routing
- Admin can create events and view registrations per event
- Capacity fill percentage with green / amber / red color coding
- Students can register for events, see spots left, and view their registrations
- Duplicate registration prevented at both UI and database level
- Full events show disabled button marked as Full
- All API routes prefixed with /api/

---

## Known Issues

- No pagination on event lists — works fine for the current dataset
- Date input uses browser native picker which looks different across browsers