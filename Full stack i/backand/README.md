# Backend API for CRUD operations

This project implements a simple Node.js/Express API with MongoDB for managing users.
It includes validation, search, pagination, soft delete, and bulk delete.

## Setup

1. **Install dependencies**
   ```bash
   cd backand
   npm install express nodemon mongoose bcrypt express-validator
   ```

2. **Run the server**
   ```bash
   npm run dev
   ```
   By default the server listens on `http://localhost:3000` and connects to MongoDB at `mongodb://localhost:27017/fullstack`. Use `MONGO_URI` environment variable to override.

## API Endpoints

- `GET /api/users` - list users (defaults to active only)
  - Query params:
    - `search` (string) - search by username, email or phone
    - `page` (number, default 1)
    - `limit` (number, default 5, choose 5,10,15 etc.)
    - `status` (boolean) - include soft-deleted when set to `false` or `true`. Omit to return only active.

- `POST /api/users` - create user
  - Body: `{ username, email, phone, image }` (all strings)

- `GET /api/users/:id` - get single user by id

- `PUT /api/users/:id` - update user (same body as create)

- `DELETE /api/users/:id` - soft delete user (sets `status=false`)

- `POST /api/users/delete-multiple` - soft delete multiple
  - Body: `{ ids: ["id1","id2",...] }`

All create/update requests are validated using `express-validator` and will return `400` with errors if invalid.

## Notes

- Schema uses `status` boolean for soft delete.
- `created_date` and `updated_date` managed automatically with Mongoose `timestamps`.
- Searching and pagination are combined; use both query params together.
- You can select how many records by specifying `limit=5`, `limit=10`, or `limit=15` (any positive integer is accepted).

