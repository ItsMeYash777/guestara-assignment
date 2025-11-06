# Menu Management API

A RESTful API for managing restaurant menus with categories, sub-categories, and items. Built with Node.js, Express, Prisma ORM, and NeonDB (PostgreSQL).


## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Guestara-Assessment
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
PORT=3000
NODE_ENV=development
```

Replace the `DATABASE_URL` with your NeonDB connection string.

4. **Set up Prisma**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Category Endpoints

#### Create Category
```
POST /api/categories
```

**Request Body:**
```json
{
  "name": "Beverages",
  "image": "https://example.com/beverages.jpg",
  "description": "All types of beverages",
  "taxApplicability": true,
  "tax": 5,
  "taxType": "Percentage"
}
```

**Response:**
```json
{
  "message": "Category created successfully",
  "data": {
    "id": "clxxx...",
    "name": "Beverages",
    "image": "https://example.com/beverages.jpg",
    "description": "All types of beverages",
    "taxApplicability": true,
    "tax": 5,
    "taxType": "Percentage",
    "createdAt": "2025-11-04T10:00:00.000Z",
    "updatedAt": "2025-11-04T10:00:00.000Z"
  }
}
```

#### Get All Categories
```
GET /api/categories
```

**Response:**
```json
{
  "message": "Categories retrieved successfully",
  "count": 2,
  "data": [...]
}
```

#### Get Category by ID or Name
```
GET /api/categories/:id
```

**Parameters:**
- `id`: Category ID or name

**Response:**
```json
{
  "message": "Category retrieved successfully",
  "data": {
    "id": "clxxx...",
    "name": "Beverages",
    "subCategories": [...],
    "items": [...]
  }
}
```

#### Update Category
```
PUT /api/categories/:id
PATCH /api/categories/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Beverages",
  "description": "Updated description",
  "tax": 7.5
}
```

### Sub-Category Endpoints

#### Create Sub-Category
```
POST /api/categories/:categoryId/subcategories
```

**Request Body:**
```json
{
  "name": "Hot Beverages",
  "image": "https://example.com/hot-beverages.jpg",
  "description": "Coffee, Tea, etc.",
  "taxApplicability": true,
  "tax": 5
}
```

**Note:** If `taxApplicability` and `tax` are not provided, they default to the parent category's values.

#### Get All Sub-Categories
```
GET /api/subcategories
```

#### Get Sub-Categories by Category
```
GET /api/categories/:categoryId/subcategories
```

#### Get Sub-Category by ID or Name
```
GET /api/subcategories/:id
```

**Parameters:**
- `id`: Sub-category ID or name

#### Update Sub-Category
```
PATCH /api/subcategories/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Hot Beverages",
  "description": "Updated description",
  "tax": 6
}
```

### Item Endpoints

#### Create Item
```
POST /api/items
```

**Request Body:**
```json
{
  "name": "Cappuccino",
  "image": "https://example.com/cappuccino.jpg",
  "description": "Italian coffee drink",
  "taxApplicability": true,
  "tax": 5,
  "baseAmount": 150,
  "discount": 10,
  "categoryId": "clxxx...",
  "subCategoryId": "clyyy..."
}
```

**Note:** 
- Must provide either `categoryId` or `subCategoryId`
- If `subCategoryId` is provided, the `categoryId` is automatically set from the sub-category's parent

#### Get All Items
```
GET /api/items
```

#### Get Items by Category
```
GET /api/categories/:categoryId/items
```

#### Get Items by Sub-Category
```
GET /api/subcategories/:subCategoryId/items
```

#### Get Item by ID or Name
```
GET /api/items/:id
```

**Parameters:**
- `id`: Item ID or name

#### Search Items by Name
```
GET /api/items/search?name=coffee
```

**Query Parameters:**
- `name`: Search query (case-insensitive, partial match)

**Response:**
```json
{
  "message": "Search completed successfully",
  "count": 3,
  "data": [...]
}
```

#### Update Item
```
PUT /api/items/:id
PATCH /api/items/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Large Cappuccino",
  "baseAmount": 200,
  "discount": 15
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created successfully
- `400`: Bad request (validation error)
- `404`: Resource not found
- `500`: Server error

**Error Response Format:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Database Management

### View Database with Prisma Studio
```bash
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` to view and edit your database.

### Create New Migration
```bash
npm run prisma:migrate
```

## Project Structure

```
Guestara-Assessment/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client configuration
│   ├── apis/
│   │   ├── categoryApi.js
│   │   ├── subCategoryApi.js
│   │   └── itemApi.js
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── subCategoryRoutes.js
│   │   └── itemRoutes.js
│   └── server.js         
├── .env                      
├── .env.example               
├── .gitignore
├── package.json
└── README.md
```

## Project Reflection

### 1. Three Things I Learned from This Assignment

**a) Database Relationship Design with Prisma**

Learned how to implement hierarchical data structures (Category → SubCategory → Item) using Prisma ORM.

Discovered how to implement optional relationships (items can belong to either a category directly or a subcategory)

**b) Implemented tax inheritance where sub-categories automatically inherit tax settings from parent categories if not specified**

**c) Designed endpoints that accept both ID and name parameters, making the API more user-friendly, Implemented case-insensitive search functionality for better user experience**

### 2. Most Difficult Part of the Assignment

The most challenging aspect was handling the relationships between categories, sub-categories, and items while ensuring data consistency:

Items can belong to either a category directly OR a sub-category. When an item belongs to a sub-category, it should also be linked to the parent category. This took a bit to get the validation logic to ensure at least one relationship exists.

### 3. What I Would Have Done Differently Given More Time

**a) Input Validation & Error Handling**

Implement a validation middleware using libraries like Zod which is usefull in production.

**b) Implement bulk operations (create/update multiple items at once)**

### 4. Why I Chose PostgreSQL/NeonDB

**Reasons for Choosing PostgreSQL/NeonDB:**

The menu management system has clear relationships (Category → SubCategory → Item) that are best represented in a relational database










