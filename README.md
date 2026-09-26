# 🍔 FoodExpress - Production-Grade Food Delivery Management System

FoodExpress is a full-stack, enterprise-level Food Delivery Management System built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), Tailwind CSS, Redux Toolkit, Socket.IO, and Razorpay.

---

## 🌟 Key Features & Role-Based Modules

### 1. 👤 Customer Website & App
* **Authentication**: JWT Auth, bcrypt password hashing, Forgot/Reset Password via OTP.
* **Browse & Search**: Filter restaurants & foods by cuisine, price range, rating, vegetarian/non-vegetarian, and delivery time.
* **Smart Cart**: Single-vendor cart enforcement, item quantity controls, special cooking instructions, and coupon discount validation.
* **Checkout & Payments**: Dual payment options: **Razorpay Online Payment Gateway** and **Cash on Delivery (COD)**.
* **Real-time Order Tracking**: Live visual status updates powered by **Socket.IO** (`PLACED` → `CONFIRMED` → `PREPARING` → `READY_FOR_PICKUP` → `PICKED_UP` → `OUT_FOR_DELIVERY` → `DELIVERED`).
* **Ratings & Reviews**: Rate restaurants, dishes, and delivery partners after order completion.
* **Favorites & Addresses**: Save multiple delivery addresses and bookmark wishlist dishes.

### 2. 🏪 Restaurant Owner Module (`/restaurant/dashboard`)
* **Restaurant Management**: Logo, banner, description, cuisines, operating hours, and live availability toggle.
* **Menu Management**: Add, edit, and delete food items with discount percentages, preparation times, add-ons, and stock status.
* **Order Processing**: Live order alert screen with status controls (`Accept`, `Reject`, `Start Preparing`, `Ready for Pickup`).
* **Analytics**: Daily revenue, order counts, customer ratings, and best-selling dishes.

### 3. 🛵 Delivery Partner Module (`/delivery/dashboard`)
* **Duty Status**: Online/Offline toggle to receive delivery requests.
* **Trip Dispatch**: View available pickup orders in real-time and accept trips.
* **Live Trip Progression**: Update order status (`Picked Up`, `Out for Delivery`, `Delivered`).
* **Earnings & Stats**: Track daily, weekly, and monthly payouts and delivery logs.

### 4. 🛡️ Admin Super Dashboard (`/admin/dashboard`)
* **Platform Metrics**: Total revenue, orders, active users, restaurants, and riders.
* **User Management**: Search users, block/unblock accounts, delete accounts.
* **Restaurant Moderation**: Approve or reject restaurant registrations, suspend/activate stores.
* **Rider KYC Verification**: Review delivery partner vehicle details & approve KYC applications.
* **Coupon & Offer Control**: Create percentage or fixed-amount promotional codes with usage limits.
* **Analytics & Reports**: Visual monthly sales trends powered by **Recharts**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, Lucide Icons, Framer Motion, Recharts |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ORM, Socket.IO, JWT, bcryptjs |
| **Payment** | Razorpay SDK & Signature Verification |
| **Services** | Nodemailer (Email/OTP), Multer & Cloudinary (Image Uploads) |
| **Security** | Helmet, CORS, Express Rate Limit, Express Validator |

---

## 📁 Project Structure

```
food-delivery-management-system/
├── client/
│   ├── src/
│   │   ├── admin/             # Admin Dashboard Components & Pages
│   │   ├── components/        # Reusable UI components (Navbar, Footer, FoodCard, etc.)
│   │   ├── delivery/          # Delivery Partner Module Pages
│   │   ├── pages/             # Customer Facing Pages (Home, Restaurants, Cart, Checkout, etc.)
│   │   ├── redux/             # Redux Store & Slices (auth, cart, restaurant, order)
│   │   ├── restaurant/        # Restaurant Owner Module Pages
│   │   ├── services/          # Axios API Service Layer
│   │   ├── utils/             # Socket Client Helpers
│   │   ├── App.jsx            # Main Router Setup
│   │   ├── main.jsx           # React Entry Point
│   │   └── index.css          # Tailwind CSS Configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/            # DB, Cloudinary & Razorpay configurations
│   │   ├── controllers/       # REST API Business Logic Controllers
│   │   ├── middleware/        # JWT Auth, Role Middleware, Error Handler, Uploads
│   │   ├── models/            # Mongoose Schemas (User, Restaurant, Food, Order, etc.)
│   │   ├── routes/            # Express Routes Definitions
│   │   ├── services/          # Email, Payment & Order Status Services
│   │   ├── socket/            # Socket.IO Real-time Connection Handler
│   │   ├── tests/             # Automated API Verification Test Suite
│   │   ├── utils/             # Seed Script, Token Generator & Validators
│   │   └── server.js          # Express Application Entry Point
│   ├── uploads/               # Uploaded Media Storage
│   └── package.json
│
├── package.json               # Root Monorepo Controller
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Installation

Install dependencies for root, backend, and frontend:
```bash
npm run setup
```

### 2. Database Seeding

Seed the database with sample Admin, Restaurant Owners, Customers, Riders, Foods, and Coupons:
```bash
npm run seed
```

### 3. Run Development Server

Start both backend server (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`):
```bash
npm run dev
```

---

## 🔑 Default Seed Logins for Testing

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@foodexpress.com` | `password123` |
| **Restaurant Owner** | `owner1@foodexpress.com` | `password123` |
| **Customer** | `customer1@foodexpress.com` | `password123` |
| **Delivery Rider** | `delivery1@foodexpress.com` | `password123` |

*(Note: The login page includes a **One-Click Demo Fill** button for instant testing!)*

---

## 🧪 Automated Testing

To run the backend automated API test suite:
```bash
npm test
```

---

## 🌐 Deployment Instructions

* **Frontend**: Deploy `client/` directory to **Vercel** or **Netlify**. Set `VITE_API_URL` to backend server endpoint.
* **Backend**: Deploy `server/` directory to **Render**, **Railway**, or **AWS EC2**.
* **Database**: Host MongoDB on **MongoDB Atlas**.
