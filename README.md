# Eyes Optical Management System (EOMS)

A comprehensive optical store management system with public website, customer portal, and admin/staff dashboard.

## 🌟 Features

### Public Website
- Clean, professional design
- Services overview
- Store locations
- Book eye test functionality
- Login/Dashboard access

### Customer Dashboard
- Profile management
- Prescription history and upload
- Order tracking
- Appointment booking
- View products

### Admin/Staff Dashboard
- **Dashboard Overview**
  - Total sales, orders, customers
  - Low stock alerts
  - Upcoming appointments
  - Interactive charts and analytics

- **Product Management**
  - CRUD operations
  - Category management
  - Stock tracking
  - Featured products
  - Bulk actions

- **Order Management**
  - View all orders
  - Status updates
  - Filter by status
  - Order details

- **Customer Management**
  - Customer list
  - Customer details
  - Order history per customer

- **Prescription Management**
  - View all prescriptions
  - Customer prescriptions
  - Prescription details
  - File upload support

- **Appointment Management**
  - Calendar view
  - Status management
  - Assign optometrist
  - Appointment booking

- **Analytics**
  - Sales trends
  - Best-selling products
  - Category performance
  - Customer growth

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (minimal animations)
- Recharts
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Role-based access control

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
npm run setup-env  # Creates .env file
# Edit .env with your MongoDB URI and JWT secret
npm run dev
npm run seed  # Seed sample data
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Default Credentials

After seeding:

- **Admin**: admin@hadadi.com / admin123
- **Staff**: staff@hadadi.com / staff123
- **Customer**: john@example.com / customer123
- **Customer**: jane@example.com / customer123

## 🚀 Usage

1. Start MongoDB (make sure it's running)
2. Start backend server: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Visit http://localhost:3000

## 📁 Project Structure

```
eoms/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/       # Auth middleware
│   ├── scripts/         # Seed script
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   │   ├── dashboard/
│   │   │   ├── auth/
│   │   │   └── public/
│   │   ├── components/  # Reusable components
│   │   │   ├── ui/
│   │   │   ├── tables/
│   │   │   ├── charts/
│   │   │   └── forms/
│   │   └── contexts/    # React contexts
│   └── package.json
└── README.md
```

## 🎨 Design Features

- Dark mode support
- Responsive design
- Minimal animations
- Toast notifications
- Loading states
- Error boundaries
- Professional business-focused UI

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product (Admin/Staff)
- `PUT /api/products/:id` - Update product (Admin/Staff)
- `DELETE /api/products/:id` - Delete product (Admin/Staff)

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status (Admin/Staff)

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment

### Analytics
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/sales` - Sales data
- `GET /api/analytics/products` - Best sellers
- `GET /api/analytics/categories` - Category performance
- `GET /api/analytics/customers` - Customer growth

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes
- Input validation

## 📄 License

ISC

## 👨‍💻 Development

Built with modern best practices:
- TypeScript for type safety
- Component-based architecture
- RESTful API design
- Clean code principles
- Responsive design
- Error boundaries
- Loading states

## 🆕 What's New (EOMS Refactor)

- Reorganized frontend structure with layouts
- Dashboard-first UI approach
- Enhanced error handling with ErrorBoundary
- Improved loading states
- Professional business-focused design
- Unified dashboard for all user roles
- Better component organization
