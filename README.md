# 🎟️ Event Buddy – Event Booking System

Event Buddy is a RESTful backend service for managing and booking event seats. It supports public browsing of events, authenticated user booking, and secure admin event management.

---

## 🚀 Features

### ✅ Public APIs

- View upcoming events
- View past events
- View event details
- Search for events by name or description

### 👤 User APIs (JWT Auth Required)

- Register & login
- Book seats for future events (1–4 max)
- View your booked events

### 🛠 Admin APIs (Admin Role Only)

- Create, update, and delete events
- View all events (dashboard-ready)
- Enforce booking rules (capacity, date, limits)

---

## 🧱 Tech Stack

| Technology     | Description                  |
| -------------- | ---------------------------- |
| **NestJS**     | Backend framework            |
| **TypeScript** | Primary language             |
| **PostgreSQL** | Relational database          |
| **TypeORM**    | ORM for database interaction |
| **JWT**        | Secure authentication        |
| **Swagger**    | API documentation            |

---

## 📁 Project Structure

```bash
src/
├── auth/           # Auth module (JWT, guards, roles)
├── users/          # User entity and profile logic
├── events/         # Event CRUD, search, and stats
├── bookings/       # Booking logic and user bookings
├── database/       # DB connection config
└── main.ts         # Entry point
```

# 🛠 Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/event-buddy-backend.git
cd event-buddy-backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

```
DB_HOST=database_hostname
DB_PORT=give_your_database_port
DB_USERNAME=give_your_database_username
DB_PASSWORD=give_your_database_password
DB_NAME=give_your_database_name
JWT_SECRET=give_jwt_secret_key
```

## 4. Set up PostgreSQL

- Ensure PostgreSQL is running

- Create a database named eventbuddy

- Run migrations (or use synchronize: true in app.module.ts for dev)

## 5. Start the server

```
npm run start:dev
```

# 📘 API Documentation

## Swagger is available at:

```
http://localhost:3000/api
```

- All routes grouped by role: Public, User, Admin

- Auth via Bearer Token

- Full DTO schemas

# 🔐 Authentication

- Register/Login using /auth/register and /auth/login

- Use returned JWT token for protected routes

- Roles: user, admin

# ✅ Booking Rules

- ❌ No booking after event date

- ❌ No overbooking (capacity enforced)

- ❌ Max 4 seats per user per event
