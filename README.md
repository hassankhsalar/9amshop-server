
# Project Title


---
# 🛍️ 9am Shop - Backend

This is the backend for the **9am Shop** app built with **Node.js**, **Express**, and **MongoDB**. It handles user signup, global shop name validation, and JWT authentication for secure access.

### 🔗 Deployed API

➡️ [https://nineamshop-server.onrender.com]

---

## 🚀 Features

- 🔒 JWT token generation and verification
- 🧾 User signup with unique global shop name validation
- 🔍 Authenticated shop name fetch
- ☁️ MongoDB database (hosted on Atlas)
- 🔐 CORS with credential support

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- JSON Web Tokens (JWT)
- dotenv
- cors

---

## ⚙️ Setup & Installation

1. **Clone the repo**

```bash
git clone https://github.com/hassankhsalar/9amshop-server.git


##Install dependencies

npm install

##Create .env file

.env

DB_USER=9amtrainee
DB_PASS=5GsDDUlIeBmAcLXH
JWT_SECRET=d0db66ca6ed9e7b7e405594432279f96a66f76b6a91bf1907b03fd173987c2324f22b4f9b6a4d33b5d16e10c3cd9b6c37e62c520837338794afad1336b33ffcc

## Run the server

npm start

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| POST   | `/signup`           | Register user with unique shops    |
| POST   | `/jwt`              | Returns a JWT token                |
| GET    | `/user-shops?email` | Returns user's shop names (secure) |


🛡️ Security
JWT secret stored in environment variables

CORS restricted to frontend origin

Token validation middleware for protected routes
