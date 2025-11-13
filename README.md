# EMI Store Backend API

> A robust NestJS backend API for an e-commerce platform featuring flexible EMI (Equated Monthly Installment) payment plans for smartphones.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Features](#features)

---

## 🎯 Overview

This backend API powers an EMI-based e-commerce platform that allows customers to purchase smartphones with flexible payment plans. The system manages products, their variants (storage/color combinations), and multiple EMI plans with varying interest rates and tenures.

**Key Capabilities:**
- Product management with variants
- Multiple EMI plans per product
- Zero-interest EMI options
- Dynamic pricing and stock management
- RESTful API architecture

---

## 🛠 Tech Stack

- **Framework:** NestJS 10.x
- **Runtime:** Node.js 18+
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Language:** TypeScript
- **Validation:** class-validator, class-transformer

---

## 📊 Database Schema

### Collections

#### **Products**
Main product information with references to variants and EMI plans.

```typescript
{
  _id: ObjectId,
  name: String,              // "iPhone 17 Pro"
  brand: String,             // "Apple"
  category: String,          // "smartphones"
  description: String,
  basePrice: Number,         // Base price
  mrp: Number,               // Maximum Retail Price
  images: [String],          // Image URLs
  variants: [ObjectId],      // References to Variant collection
  emiPlans: [ObjectId],      // References to EmiPlan collection
  inStock: Boolean,
  specifications: Object,    // Technical specs
  slug: String,              // "iphone-17-pro" (unique)
  createdAt: Date,
  updatedAt: Date
}
```

#### **Variants**
Product variations (storage/color combinations).

```typescript
{
  _id: ObjectId,
  productId: ObjectId,       // Reference to Product
  storage: String,           // "128GB", "256GB", "512GB"
  color: String,             // "Silver", "Gold", "Black"
  price: Number,             // Variant-specific price
  mrp: Number,
  inStock: Boolean,
  stockQuantity: Number,
  sku: String,               // Stock Keeping Unit (unique)
  createdAt: Date,
  updatedAt: Date
}
```

#### **EMI Plans**
Flexible payment plans for products.

```typescript
{
  _id: ObjectId,
  productId: ObjectId,       // Reference to Product
  tenure: Number,            // Duration in months (3, 6, 12, 18, 24)
  monthlyPayment: Number,    // EMI per month
  interestRate: Number,      // 0-100% (0 for zero-interest)
  processingFee: Number,
  downPayment: Number,
  cashback: Number,
  description: String,
  isActive: Boolean,
  isRecommended: Boolean,    // Highlight best plans
  createdAt: Date,
  updatedAt: Date
}
```

### Schema Relationships

```
Products (1) ──→ (*) Variants
Products (1) ──→ (*) EMI Plans
```

### Visual Schema Diagram

```
┌──────────────────────────────┐
│         PRODUCTS             │
├──────────────────────────────┤
│ _id: ObjectId (PK)          │
│ name: String                │
│ brand: String               │
│ category: String            │
│ description: String         │
│ basePrice: Number           │
│ mrp: Number                 │
│ images: [String]            │
│ variants: [ObjectId] ───────┼──┐
│ emiPlans: [ObjectId] ───────┼──┼──┐
│ inStock: Boolean            │  │  │
│ specifications: Object      │  │  │
│ slug: String (Unique)       │  │  │
│ createdAt: Date             │  │  │
│ updatedAt: Date             │  │  │
└──────────────────────────────┘  │  │
                                   │  │
         ┌─────────────────────────┘  │
         │                            │
         ▼                            │
┌──────────────────────────────┐     │
│         VARIANTS             │     │
├──────────────────────────────┤     │
│ _id: ObjectId (PK)          │     │
│ productId: ObjectId (FK) ───┼─────┘
│ storage: String             │
│ color: String               │
│ price: Number               │
│ mrp: Number                 │
│ inStock: Boolean            │
│ stockQuantity: Number       │
│ sku: String (Unique)        │
│ createdAt: Date             │
│ updatedAt: Date             │
└──────────────────────────────┘

         ┌─────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│        EMI PLANS             │
├──────────────────────────────┤
│ _id: ObjectId (PK)          │
│ productId: ObjectId (FK)    │
│ tenure: Number              │
│ monthlyPayment: Number      │
│ interestRate: Number        │
│ processingFee: Number       │
│ downPayment: Number         │
│ cashback: Number            │
│ description: String         │
│ isActive: Boolean           │
│ isRecommended: Boolean      │
│ createdAt: Date             │
│ updatedAt: Date             │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```
src/
├── config/
│   └── database.config.ts       # MongoDB connection config
├── schemas/
│   ├── product.schema.ts        # Product schema
│   ├── variant.schema.ts        # Variant schema
│   └── emi-plan.schema.ts       # EMI Plan schema
├── dtos/
│   ├── create-product.dto.ts    # Product validation
│   ├── create-variant.dto.ts    # Variant validation
│   └── create-emi-plan.dto.ts   # EMI Plan validation
├── services/
│   ├── products.service.ts      # Product business logic
│   ├── variants.service.ts      # Variant business logic
│   └── emi-plans.service.ts     # EMI Plan business logic
├── controllers/
│   ├── products.controller.ts   # Product endpoints
│   ├── variants.controller.ts   # Variant endpoints
│   └── emi-plans.controller.ts  # EMI Plan endpoints
├── app.module.ts                # Root module
└── main.ts                      # Application entry point
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 18.x
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd emi-store-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emi-store
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. **Start the application**

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3000/api`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

---

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/slug/:slug` | Get product by slug |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/search?q=query` | Search products |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Variants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/variants` | Get all variants |
| GET | `/api/variants/:id` | Get variant by ID |
| GET | `/api/variants/product/:productId` | Get variants by product |
| GET | `/api/variants/color/:color` | Get variants by color |
| GET | `/api/variants/storage/:storage` | Get variants by storage |
| GET | `/api/variants/:id/stock` | Check variant stock |
| POST | `/api/variants` | Create new variant |
| PUT | `/api/variants/:id` | Update variant |
| DELETE | `/api/variants/:id` | Delete variant |

### EMI Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emi-plans` | Get all active EMI plans |
| GET | `/api/emi-plans/:id` | Get EMI plan by ID |
| GET | `/api/emi-plans/product/:productId` | Get plans by product |
| GET | `/api/emi-plans/product/:productId/recommended` | Get recommended plans |
| GET | `/api/emi-plans/product/:productId/cheapest` | Get cheapest plan |
| GET | `/api/emi-plans/tenure/:tenure` | Get plans by tenure |
| GET | `/api/emi-plans/zero-interest` | Get zero-interest plans |
| GET | `/api/emi-plans/product/:productId/sorted?order=asc` | Get sorted plans |
| POST | `/api/emi-plans` | Create new EMI plan |
| PUT | `/api/emi-plans/:id` | Update EMI plan |
| DELETE | `/api/emi-plans/:id` | Delete EMI plan |

---

## 📖 Usage Examples

### Get all products with variants and EMI plans

```bash
GET http://localhost:3000/api/products
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "category": "smartphones",
    "basePrice": 129900,
    "mrp": 139900,
    "slug": "iphone-17-pro",
    "variants": [...],
    "emiPlans": [...]
  }
]
```

### Get product by slug

```bash
GET http://localhost:3000/api/products/slug/iphone-17-pro
```

### Get EMI plans for a product

```bash
GET http://localhost:3000/api/emi-plans/product/507f1f77bcf86cd799439011
```

**Response:**
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "productId": "507f1f77bcf86cd799439011",
    "tenure": 12,
    "monthlyPayment": 11492,
    "interestRate": 0,
    "cashback": 5000,
    "isRecommended": true
  }
]
```

### Create a new product

```bash
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Samsung Galaxy S24 Ultra",
  "brand": "Samsung",
  "category": "smartphones",
  "description": "Premium flagship smartphone",
  "basePrice": 124999,
  "mrp": 134999,
  "images": ["url1", "url2"],
  "slug": "samsung-galaxy-s24-ultra"
}
```

---

## ✨ Features

### Core Functionality
- ✅ Full CRUD operations for Products, Variants, and EMI Plans
- ✅ RESTful API architecture
- ✅ Data validation with class-validator
- ✅ MongoDB with Mongoose ODM
- ✅ TypeScript for type safety

### Product Management
- ✅ Category-based filtering
- ✅ Text search functionality
- ✅ SEO-friendly slugs
- ✅ Multiple image support
- ✅ Stock management

### EMI Plans
- ✅ Multiple tenure options (3, 6, 12, 18, 24 months)
- ✅ Zero-interest plans
- ✅ Recommended plan flagging
- ✅ Cashback support
- ✅ Processing fee calculation

### Variants
- ✅ Storage options (128GB, 256GB, 512GB)
- ✅ Color variants
- ✅ SKU management
- ✅ Individual pricing per variant
- ✅ Stock tracking

---

## 🔒 Data Validation

All API endpoints use DTOs with class-validator decorators:

- Required fields validation
- Type checking
- Minimum/Maximum value constraints
- URL format validation
- MongoDB ObjectId validation

---

## 📝 License

MIT License - feel free to use this project for learning purposes.

---

## 👨‍💻 Author

Built with ❤️ using NestJS and MongoDB