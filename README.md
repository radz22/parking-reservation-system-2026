# Parking Reservation System

## Requirements

Make sure you have the following installed before running the project:

- Node.js
- PostgreSQL
- pnpm

---

# Installation

Clone the project and install dependencies:

```bash
pnpm install
```

---

# Environment Variables

Create a `.env` file in each project folder and follow the structure below.

---

## Admin `.env`

```env
NEXT_PUBLIC_API_URL=your_backend_api_url

NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_URL=your_admin_frontend_url
```

### Example

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

NEXTAUTH_URL=http://localhost:3001
```

---

## Backend `.env`

```env
PORT=your_port

NODE_ENV=your_environment

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

JWT_QR_SECRET=your_qr_secret

DATABASE_URL=your_database_url

RESEND_API_KEY=your_resend_api_key

RESEND_FROM="Your App Name <your_email_domain>"
```

### Example

```env
PORT=4000

NODE_ENV=development
```

---

## User `.env`

```env
NEXT_PUBLIC_API_URL=your_backend_api_url

NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_URL=your_user_frontend_url
```

### Example

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

NEXTAUTH_URL=http://localhost:3000
```

---

# Running the Project

## Backend

```bash
pnpm run dev
```

---

## Admin Frontend

```bash
pnpm run dev
```

---

## User Frontend

```bash
pnpm run dev
```

---

# Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS

## Backend

- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
