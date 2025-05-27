# Event Buddy – Event Management System

Event Buddy is a RESTful backend service for managing and booking event seats. It supports public browsing of events, authenticated user booking, and secure admin event management.

---

## Features

### Public APIs

- View upcoming events
- View past events
- View all events
- View an individual event details
- Search for events by name or description

### User APIs (JWT Auth Required)

- Register & login & logout
- Book seats for future events (1–4 max)
- View logged in users booked events
- Cancel logged in users booked events

### Admin APIs (Admin Role Only)

- Create, update, and delete events
- View all events (Admin Dashboard ready)
- Enforce booking rules (capacity, date, limits)

---

## Tech Stack

| Technology     | Description                  |
| -------------- | ---------------------------- |
| **NestJS**     | Backend framework            |
| **TypeScript** | Primary language             |
| **PostgreSQL** | Relational database          |
| **TypeORM**    | ORM for database interaction |
| **JWT**        | Secure authentication        |
| **Swagger**    | API documentation            |

---

## Project Structure

```bash
src/
├── auth/           # Auth module (JWT, guards, roles, strategy)
├── users/          # User entity and profile logic
├── events/         # Event CRUD, search, and stats
├── bookings/       # Booking logic and user bookings
├── config/         # DB connection config
└── main.ts         # Entry point
uploads/            # Static file management (Event photo upload)
postman/            # Postman API collection JSON file

```

# Setup Instructions

## 1. Clone the repository

```bash
git clone https://github.com/Tishat2247019/Event_Buddy_Backend_API.git
cd Event_Buddy_Backend_API
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Copy `.env.example` (will be found in the root directory) and create a `.env` file with actual credentials:

```
DB_HOST=database_hostname
DB_PORT=give_your_database_port
DB_USERNAME=give_your_database_username
DB_PASSWORD=give_your_database_password
DB_NAME=give_your_database_name
JWT_SECRET=give_jwt_secret_key
JWT_EXPIRES_IN=give_jwt_expires_time
```

## 4. Set up PostgreSQL

- Ensure PostgreSQL is running

- Create a database

- Run migrations (or use synchronize: true in app.module.ts for dev)

## 5. Start the server

```
npm run start:dev
```

# API Documentation

## Swagger is available at:

```
http://localhost:3000/api
```

- All routes grouped by role: Public, User, Admin

- Auth via Bearer Token

- Full DTO schemas

# Authentication

- Register/Login using /auth/register and /auth/login

- Use returned JWT token for protected routes

- Roles: user, admin

# Booking Rules

- No booking without user login

- No booking after event date

- No overbooking (capacity enforced)

- Max 4 seats per user per event

# Admin Credentials

You can manually insert an admin via SQL:

```
INSERT INTO public.users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', 'password', 'admin');
```

# Databae Schema Design

![Database Schema](https://github.com/user-attachments/assets/bd037375-4fb8-4672-a243-1271287b9b90)

# Future Improvements

- Email confirmations for bookings

- Pagination and filtering for event lists

- Event image uploads

- Admin dashboard analytics

# API Testing – Postman Collection

You can test all the APIs using the Postman collection provided below.

- [Download Postman Collection](./postman/Event%20Buddy.postman_collection.json)

- [View/Import from Postman](https://tishat.postman.co/workspace/Nest-Js-Practice~82e9a7d0-56fa-4427-8587-d76b560b9979/collection/37708609-0e99d33c-871e-412a-bdae-b875144a76e3?action=share&creator=37708609)

> Make sure your server is running on `http://localhost:3000` or update the environment accordingly in Postman.
