# Shoesify - A Full-Stack E-Commerce Platform

A full-stack e-commerce platform built with Next.js, TypeScript, and Node.js.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- SQLite (for relational data)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ADMIN_SECRET_CODE=your_admin_code
   UNSPLASH_ACCESS_KEY=your_unsplash_key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Frontend Routes & Features

### Public Routes

- Home: `/` - View featured products
- Products: `/products` - Browse all products
- Product Details: `/products/[id]` - View individual product details
- Login: `/login` - User authentication
- Register: `/register` - New user registration

### User Features (Requires Authentication)

- Add products to cart
- View cart: `/cart`
- Manage cart items (update quantities, remove items)
- Place orders
- View order history: `/orders`
- View order details: `/orders/[id]`

### Admin Routes (Requires Admin Authentication)

- Manage Products: `/admin/products`
  - Add new products
  - Edit existing products
  - Delete products
  - View product inventory
- Manage Orders: `/admin/orders`
  - View all customer orders
  - Update order status
- View Reports: `/reports`
  - Daily revenue
  - Top spenders
  - Category sales

## User Flows

### Shopping Flow

1. Browse products (no authentication required)
2. View product details (no authentication required)
3. **Login required for:**
   - Adding items to cart
   - Viewing cart
   - Placing orders
   - Viewing order history

### Admin Flow

1. Login with admin credentials
2. Access admin-specific features:
   - Product management
   - Order management
   - Sales reports

## API Endpoints

### Authentication

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get Profile: `GET /api/auth/profile`

### Products

- View all products: `GET /api/products`
- View single product: `GET /api/products/:id`
- Search products: `GET /api/products?search=query`
- Filter by category: `GET /api/products?category=categoryName`

### Shopping Cart

- Get cart: `GET /api/cart`
- Add item: `POST /api/cart/items`
- Update item: `PUT /api/cart/items`
- Remove item: `DELETE /api/cart/items/:productId`
- Clear cart: `DELETE /api/cart`

### Orders

- Create order: `POST /api/orders`
- Get user orders: `GET /api/orders`
- Get single order: `GET /api/orders/:id`

### Admin Endpoints

- Create product: `POST /api/products`
- Bulk create products: `POST /api/products/bulk`
- Update product: `PUT /api/products/:id`
- Delete product: `DELETE /api/products/:id`
- View all orders: `GET /api/orders/admin/all`
- Update order status: `PATCH /api/orders/admin/:id/status`
- Get reports:
  - Daily revenue: `GET /api/reports/daily-revenue`
  - Top spenders: `GET /api/reports/top-spenders`
  - Category sales: `GET /api/reports/category-sales`

## Tech Stack

- Frontend:

  - Next.js
  - TypeScript
  - TailwindCSS
  - React Chart.js (for admin reports)
  - Axios for API calls
  - Context API for state management

- Backend:
  - Node.js
  - Express
  - MongoDB (Products/Cart)
  - SQLite (Users/Orders)
  - JWT Authentication
  - Unsplash API for product images

## Security Features

- JWT-based authentication
- Role-based access control (User/Admin)
- Protected API routes
- Input validation
- XSS protection

## Database Structure

### MongoDB Collections

- Products: Store product information
- Cart: Store user shopping carts

### SQLite Tables

- Users: Store user information
- Orders: Store order information
- OrderItems: Store order line items

## Frontend Testing

### Authentication Tests

Located in `frontend/__tests__/auth/`, we have comprehensive tests for authentication functionality:

#### Login Tests (`Login.test.tsx`)

- Renders login form correctly
- Validates empty form fields
- Shows loading state during login attempt
- Handles failed login attempts
- Redirects to home page after successful login
- Displays error messages for invalid credentials

#### Registration Tests (`Register.test.tsx`)

- Renders registration form correctly
- Validates required fields
- Checks password matching
- Shows loading state during registration
- Handles successful registration with redirect
- Displays appropriate error messages

#### Auth Context Tests (`AuthContext.test.tsx`)

- Initializes with correct default state
- Handles user authentication state
- Manages token storage
- Handles logout functionality
- Maintains user session
- Handles failed authentication attempts

### Running Tests

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run specific test file
npm test Login.test.tsx
```

### Test Coverage

- Authentication flows
- Protected route handling
- User session management
- Error scenarios
- Loading states

### Testing Stack

- Jest
- React Testing Library
- Mock Service Worker (for API mocking)
- @testing-library/user-event for user interactions
