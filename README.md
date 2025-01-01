<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 📚 Book Store Management API

A robust book store management system built with NestJS and TypeORM.

## Postman Samples

![Auth API Sample](https://github.com/sametYILMAZ97/case-book-store-management/blob/main/postman_screens/case_auth.png)

![Books API Sample](https://github.com/sametYILMAZ97/case-book-store-management/blob/main/postman_screens/case_books.png)

## 🛠️ Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## 🏗️ Models & Rules

### 👤 User

- **Fields:**
  - `id`: UUID (auto-generated)
  - `username`: String (unique)
  - `password`: String (hashed)
  - `role`: Enum (ADMIN, STORE_MANAGER, STAFF)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### 📖 Book

- **Fields:**
  - `id`: UUID (auto-generated)
  - `title`: String
  - `author`: String
  - `isbn`: String (unique)
  - `description`: String
  - `price`: Decimal
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

### 🏪 Bookstore

- **Fields:**
  - `id`: UUID (auto-generated)
  - `name`: String
  - `address`: String
  - `books`: Book[] (Many-to-Many)
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

## 🔌 API Endpoints

### 🔐 Authentication

```http
POST /auth/login
{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbG..."
}
```

### 👥 Users

```http
# Create User
POST /users
{
  "username": "store_manager1",
  "password": "password123",
  "role": "STORE_MANAGER"
}

# Get All Users
GET /users

# Get User by Username
GET /users/:username

# Update User
PATCH /users/:id
{
  "username": "updated_username"
}

# Delete User
DELETE /users/:id
```

### 📚 Books

```http
# Create Book
POST /books
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "description": "A story of decadence and excess",
  "price": 9.99
}

# Get All Books
GET /books

# Get Book by ID
GET /books/:id

# Update Book
PATCH /books/:id
{
  "price": 12.99
}

# Delete Book
DELETE /books/:id
```

### 🏬 Bookstores

```http
# Create Bookstore
POST /bookstores
{
  "name": "Downtown Books",
  "address": "123 Main St"
}

# Get All Bookstores
GET /bookstores

# Get Bookstore by ID
GET /bookstores/:id

# Add Book to Bookstore
PUT /bookstores/:id/add-book/:bookId
{
  "quantity": 5
}

# Remove Book from Bookstore
PUT /bookstores/:id/remove-book/:bookId
{
  "quantity": 2
}
```

## 🧪 Testing

### Unit Tests

Run unit tests using Jest:

```bash
npm run test:unit
```

### Test Examples

#### User Service Tests

```typescript
describe('UsersService', () => {
  it('should create a new user', async () => {
    const result = await service.create({
      username: 'testuser',
      password: 'password123',
      role: Role.USER,
    });
    expect(result).toBeDefined();
  });
});
```

#### Authentication Tests

```typescript
describe('AuthController (e2e)', () => {
  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password123' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
```

#### Book API Tests

```typescript
describe('BookController (e2e)', () => {
  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(Array.isArray);
  });
});
```

## 🚀 Getting Started

1. Install dependencies

```bash
npm install
```

2. Run migrations

```bash
npm run typeorm:run-migrations
```

3. Start the application

```bash
npm run start:dev
```

## 🔒 Authentication

- JWT-based authentication
- Token expires in 24 hours
- Include token in Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 👮‍♂️ Role-Based Access

- **ADMIN**: Full access to all endpoints
- **STORE_MANAGER**: Manage books and bookstore inventory
- **STAFF**: View books and bookstore information

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
├── users/               # User management
├── books/              # Book management
├── bookstores/         # Bookstore management
└── common/             # Shared resources
```
