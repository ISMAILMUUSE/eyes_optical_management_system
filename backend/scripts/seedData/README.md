# Seed Data Files

This directory contains seed data files for populating the database with 100 entries for each model.

## Files

- **categories.js** - 100 categories (eyeglasses, sunglasses, lenses, etc.)
- **users.js** - 100 users (5 admins, 15 staff, 80 customers)
- **products.js** - 100 products with realistic data
- **prescriptions.js** - 100 prescriptions linked to customers
- **appointments.js** - 100 appointments linked to customers and staff
- **orders.js** - 100 orders linked to customers, products, and prescriptions

## Usage

### 1. Run the Seed Script

```bash
cd backend
npm run seed
```

This will:
- Clear all existing data
- Create 100 entries for each model
- Link related data (orders to customers/products, prescriptions to customers, etc.)

### 2. Verify the Data

```bash
npm run verify-seed
```

This will show:
- Count of each model type
- User role breakdown
- Order status breakdown
- Appointment status breakdown
- Relationship verification

## Data Structure

### Users (100 total)
- **5 Admins**: Can access all admin features
- **15 Staff**: Can manage orders, appointments, products
- **80 Customers**: Regular users with orders, prescriptions, appointments

**Default Passwords:**
- Admins: `admin123`
- Staff: `staff123`
- Customers: `customer123`

### Categories (100)
Various optical product categories including:
- Eyeglasses, Sunglasses, Contact Lenses
- Reading Glasses, Computer Glasses
- Progressive Lenses, Bifocal Lenses
- Frame types, Lens types, Accessories

### Products (100)
- Diverse range of eyewear products
- Linked to categories
- Includes brands, frame types, materials, colors
- Realistic pricing ($50-$450)
- Stock levels and specifications

### Prescriptions (100)
- Linked to customer users
- Realistic eye prescription values
- Various eye types (distance, reading, bifocal, progressive, computer)
- Exam dates and expiry dates
- Optometrist information

### Appointments (100)
- Linked to customer users
- Assigned to staff optometrists (when confirmed/in-progress/completed)
- Various types: eye-exam, consultation, follow-up, fitting
- Mix of past, present, and future dates
- Various statuses: scheduled, confirmed, in-progress, completed, cancelled, no-show

### Orders (100)
- Linked to customer users
- 1-4 items per order
- Linked to products
- 30% have prescriptions linked
- Various statuses and payment methods
- Realistic pricing with tax and shipping

## API Endpoints to Verify Data

After seeding, you can verify the data through these API endpoints:

### Public Endpoints (No Auth Required)
- `GET /api/categories` - View all categories
- `GET /api/products` - View all products (paginated)

### Protected Endpoints (Login Required)
- `GET /api/orders` - View orders (customers see only their own)
- `GET /api/prescriptions` - View prescriptions (customers see only their own)
- `GET /api/appointments` - View appointments (customers see only their own)
- `GET /api/customers` - View customers (admin/staff only)
- `GET /api/analytics` - View analytics (admin/staff only)

## Testing in Browser

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login as Admin:**
   - Email: Any admin email from the seed data (e.g., `admin@hadadi.com`)
   - Password: `admin123`
   - Navigate to Admin Dashboard to see all data

4. **Check Each Section:**
   - **Products**: `/dashboard/products` - Should show 100 products
   - **Categories**: `/admin/categories` - Should show 100 categories
   - **Orders**: `/dashboard/orders` - Should show 100 orders
   - **Customers**: `/admin/customers` - Should show 100 users
   - **Prescriptions**: `/admin/prescriptions` - Should show 100 prescriptions
   - **Appointments**: `/admin/appointments` - Should show 100 appointments
   - **Analytics**: `/admin/analytics` - Should show charts with data

## Notes

- All data is randomly generated but realistic
- Relationships are properly maintained (orders link to customers/products)
- Some data may be inactive (5% of products, 10% of users)
- Prescriptions may be expired (checked against expiry date)
- Orders have realistic dates within the last year
- Appointments have dates ranging from 30 days ago to 150 days in the future

