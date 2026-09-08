# Inventory Management System - Backend

Node.js + Express.js + MongoDB REST API

## Features

- JWT Authentication (Register / Login)
- Role-based access (admin, manager, staff)
- Products CRUD + Stock management
- Categories CRUD
- Suppliers CRUD
- Dashboard statistics
- Low stock alerts
- Soft delete

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Make sure MongoDB is running (local or Atlas).

4. Seed sample data (optional):
```bash
npm run seed
```

5. Start server:
```bash
npm run dev    # development with nodemon
# or
npm start      # production
```

Server runs on `http://localhost:5000`

## Default Login (after seed)

- **Admin**: admin@inventory.com / admin123
- **Manager**: manager@inventory.com / manager123

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET  /api/auth/me` - Current user (protected)

### Products
- `GET    /api/products` - List (search, category, lowStock, pagination)
- `GET    /api/products/:id`
- `POST   /api/products` - Create (admin/manager)
- `PUT    /api/products/:id` - Update
- `DELETE /api/products/:id` - Soft delete
- `PATCH  /api/products/:id/stock` - Update stock

### Categories / Suppliers
- Similar CRUD endpoints under `/api/categories` and `/api/suppliers`

### Dashboard
- `GET /api/dashboard/stats` - Overall statistics
