# 🧵 GarmentsTracker - Garments Order & Production Tracker System (Client)

A next-generation enterprise apparel manufacturing, wholesale order management, and live factory tracking web application built for garment manufacturers, global buyers, and factory managers.

---

## 🌐 Live URL & Repository Links
- **Live Site**: `https://garments-tracker-app.web.app` (or your active deployment URL)
- **Client GitHub Repository**: `https://github.com/Mesbah088/garments-management-client`
- **Server GitHub Repository**: `https://github.com/Mesbah088/garments-management-server`

---

## 🔑 Demo Access Credentials (1-Click Login Available in Login Page)

| Role | Email | Default Password | Permissions / Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@garmentstracker.com` | `Admin@123` | Full system analytics, user management, role elevation, suspension with feedback, catalog management, show on home toggle, and order monitoring. |
| **Manager** | `manager@garmentstracker.com` | `Manager@123` | Add apparel products with multi-image previews, manage products, approve/reject pending orders, and log live production tracking milestones (Cutting, Sewing, QC, Packing, Dispatched). |
| **Buyer** | `buyer@garmentstracker.com` | `Buyer@123` | Browse catalog, filter & search apparel, configure FOB wholesale bookings, live auto-calculated price breakdown, cancel pending orders, and view live GPS stage tracking. |

---

## 🌟 Key Features

### 1. 🎨 Modern Dynamic UI & Design System
- **Rich Aesthetics**: Tailored color palette with emerald, teal, and slate tones, glassmorphism cards, and subtle glowing accents.
- **Theme Toggling**: Instant, persistent Dark/Light mode switch stored in `localStorage`.
- **Framer Motion Animations**: Smooth page transitions, hero banner animations, and card hover effects.
- **Dynamic Document Titles**: Automatically synced page titles for all routes.
- **404 Not Found Page**: Custom garments-themed error page with quick navigation back home.

### 2. 🏠 Public Landing & Catalog
- **Hero Banner**: High-conversion hero with quick navigation to export catalog and factory infrastructure.
- **Featured 6 Products**: Real-time fetched from MongoDB with live stock counts and minimum order quantities (MOQ).
- **Interactive Step-by-Step Workflow**: Visual breakdown from sample booking to laser CAD cutting, sewing, and QC.
- **Customer Feedback Carousel**: Dynamic carousel featuring global brand buyer testimonials.
- **Factory Infrastructure & B2B Advantages**: Live factory machinery metrics, ISO 9001/BSCI compliance badges, and low MOQ benefits.
- **All-Products Catalog**: 3-column responsive grid with live search, category filter pills (Shirt, Pant, Jacket, Accessories), price sorting, and pagination.

### 3. 🔐 Authentication & Role Protection
- **Firebase Authentication & JWT**: Email/Password and Google sign-in with secured tokens synced to HTTP-only cookies and Authorization headers.
- **Role-Based Guards**: Strict route protection via `PrivateRoute`, `AdminRoute`, `ManagerRoute`, and `BuyerRoute`.
- **Password Verification**: Real-time validation requiring uppercase, lowercase, and minimum 6 characters.
- **No Page Reload Drop**: Persistent auth state listeners prevent accidental redirects on refresh.

### 4. 🛒 Product Details & Smart Booking Modal
- Multi-image gallery selector and optional demo video preview.
- Dynamic stock validation (Order Quantity must be between MOQ and Available Stock).
- Real-time auto-calculated order total price (`quantity * unitPrice`).
- Conditional payment flow: Seamless simulation for `PayFirst` (Stripe/Card) vs instant direct booking for `Cash on Delivery`.

### 5. 📊 Admin Dashboard & User Management
- **Visual Analytics**: Interactive Bar, Line, and Pie charts powered by `recharts` with Today, 7-Day, and 30-Day time filters.
- **Manage Users & Challenge Point 4**:
  - Search and filter by role and status.
  - Role management modal allowing Admin to elevate roles or suspend accounts.
  - **Suspension Modal**: Mandatory collection of `suspendReason` and `suspendFeedback` saved to the database.
- **All Products & All Orders**: Admin can toggle "Show on Home" status, edit product specs, and inspect complete order histories.

### 6. 🏭 Manager Production Workflow
- **Add Product Form**: Built with `react-hook-form`, image preview before uploading, MOQ, video links, and payment options.
- **Pending Orders**: Approve order (logs `approvedAt` timestamp) or Reject order.
- **Approved Orders & Live Tracking**: Modal to log real-time milestones:
  - *Cutting Completed*
  - *Sewing Started*
  - *Finishing*
  - *QC Checked*
  - *Packed*
  - *Shipped / Out for Delivery*

### 7. 📦 Buyer Live Tracking & Profile
- **My Orders**: Complete order history table with status badges and ability to cancel pending orders.
- **Interactive Order Tracking (`/dashboard/track-order/:orderId`)**:
  - Chronological timeline with date/time, location, and milestone descriptions.
  - Current active stage highlighted with glowing animation.
  - Interactive factory GPS map marker simulation.
- **Profile & Suspend Banner**: Displays user credentials and highlights admin suspension feedback and resolution steps if account is suspended.

---

## 📦 NPM Packages Used (Client)

| Package | Purpose |
| :--- | :--- |
| `react` & `react-dom` (v19) | Modern React component architecture |
| `react-router` (v7) | Declarative client-side routing & nested dashboard layouts |
| `tailwindcss` (v4) & `@tailwindcss/vite` | Modern utility-first styling |
| `daisyui` (v5) | UI components and theme utilities |
| `firebase` (v12) | User authentication & Google OAuth |
| `axios` | HTTP API client with interceptors |
| `framer-motion` | Micro-interactions and smooth scroll animations |
| `recharts` | Data visualization charts (Bar, Line, Pie) |
| `react-hook-form` | Form validation and reactive calculations |
| `sweetalert2` | Interactive user-facing modal notifications and CRUD alerts |
| `lucide-react` & `react-icons` | Modern iconography |

---

## ⚙️ Environment Variables (`.env`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/garments-management-clinet.git

# 2. Install dependencies
cd garments-management-clinet
npm install

# 3. Start development server
npm run dev
```
