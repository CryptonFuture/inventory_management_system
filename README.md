# 📦 Inventory Management System

Complete full-stack Inventory Management System built with:

- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Frontend**: React + Vite
- **Python**: Optional utility scripts for reports / data export

## Features

✅ User Authentication (JWT) with roles (Admin / Manager / Staff)  
✅ Products CRUD + Stock quantity management  
✅ Categories & Suppliers management  
✅ Dashboard with statistics & Low Stock alerts  
✅ Search, filter by category, low-stock filter  
✅ Soft delete  
✅ Responsive modern UI  

## Project Structure

```
inventory-management-system/
├── backend/                 # Node.js + Express API
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/seed.js
│   └── server.js
├── frontend/                # React + Vite SPA
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
├── python/                  # Optional Python utilities
└── README.md
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python 3 (optional)

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env if needed (MongoDB URI, JWT secret)

npm install
npm run seed          # Create sample data + admin user
npm run dev           # Starts on http://localhost:5000
```

**Default Login (after seed):**
- Admin   → `admin@inventory.com` / `admin123`
- Manager → `manager@inventory.com` / `manager123`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Starts on http://localhost:5173
```

Open browser → http://localhost:5173

### 4. Python Utility (Optional)

```bash
cd python
pip install -r requirements.txt
python export_report.py
```

## API Base URL
`http://localhost:5000/api`

## Tech Stack Summary

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 19, Vite, React Router, Axios |
| Backend   | Node.js, Express, Mongoose  |
| Database  | MongoDB                     |
| Auth      | JWT + bcrypt                |
| Extra     | Python (reports)            |

## Screenshots of Features

- Beautiful dark sidebar + clean dashboard
- Products table with low-stock badges
- Modal forms for Create/Edit
- Stock adjustment (add / subtract / set)
- Role-based buttons (staff can only adjust stock)

---

Made with ❤️ for complete inventory management.
# inventory_management_system
