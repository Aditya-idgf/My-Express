# My Express.js Learning Journey 🚀

Welcome to my backend development learning repository!

This repository serves as my personal study guide and code journal as I learn **Node.js**, **Express.js**, **MongoDB**, and backend development from the ground up.

I'm building everything step-by-step, starting from the fundamentals of Node.js and gradually progressing toward building fully functional, secure, and authenticated REST APIs.

🔗 **Repository:** https://github.com/Aditya-idgf/My-Express

---

# 📂 Course Structure & Progress

The repository is organized into sequential folders, where each folder represents a major backend concept.

### 📁 1. File Handling
Learned how to work with Node.js' native `fs` module for:
- Reading files
- Writing files
- Updating files
- Deleting files

---

### 📁 2. Moduling
Understanding how Node.js structures applications using:
- CommonJS Modules
- `require()`
- `module.exports`
- Splitting code into reusable modules

---

### 📁 3. HTTP Web Server
Built a web server from scratch using Node's native `http` module to understand:
- Request & Response objects
- Routing
- Status codes
- Headers

---

### 📁 4. Express Framework
Moved from the native HTTP module to Express.js and learned:
- Express server setup
- Routing
- Request handling
- Cleaner backend architecture

---

### 📁 5. REST API
Designed RESTful APIs by implementing:
- GET
- POST
- PUT
- PATCH
- DELETE

Also learned how to:
- Send JSON responses
- Receive JSON requests
- Build CRUD APIs

---

### 📁 6. Middleware
Explored Express middleware, including:
- Custom middleware
- Inline middleware
- Logging middleware
- Request preprocessing
- Understanding the request-response lifecycle

---

### 📁 7. MongoDB
Connected Express with MongoDB using Mongoose.

Covered:
- Database connections
- Schemas
- Models
- CRUD Operations
- Querying documents

---

### 📁 8. Model View Controller (MVC)
Refactored the project into the MVC architecture by separating:
- Models
- Views
- Controllers

This made the codebase cleaner, scalable, and easier to maintain.

---

### 📁 9. Projects (URL SHORTNER)
A complete backend project where everything learned so far was combined.

Features:
- Generate Short URLs
- Redirect to Original URLs
- Store data in MongoDB
- Track Visit History
- MVC Architecture

---

### 📁 10. Server Side Rendering (SSR)
Learned how to render HTML directly from the backend using:
- EJS Templates
- Dynamic Views
- Passing Data to Templates

---

### 📁 11. Authentication
Implemented **Stateful Authentication** using:
- UUID
- Cookies
- Hash Maps
- Session Management

Protected private routes and handled user login sessions.

---

### 📁 12. JWT
Upgraded authentication from Stateful to Stateless using:
- JSON Web Tokens (JWT)
- Cookie Parser
- Protected Routes
- User Authorization
- Login Authentication

---

# 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Session Handling:** Cookies & Cookie-Parser
- **View Engine:** EJS

---

# 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Aditya-idgf/My-Express.git
````

### 2. Navigate to the Desired Module

```bash
cd "12. JWT"
```

Replace `"12. JWT"` with whichever folder you want to explore.

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file (if required) and add:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the Server

Using Node:

```bash
npm start
```

Or using Nodemon:

```bash
npm run dev
```

---

# 📚 Learning Goals

This repository documents my backend learning journey, covering:

* Node.js Fundamentals
* Express.js
* REST APIs
* Middleware
* MongoDB
* Mongoose
* MVC Architecture
* Server Side Rendering
* Stateful Authentication
* JWT Authentication

More topics and projects will continue to be added as I progress.

---

# 💡 About Me

I'm currently diving deep into backend engineering and documenting everything I learn through this repository.

The goal is not only to build projects but also to understand how backend systems work under the hood.

Feel free to:

* ⭐ Star the repository
* 🍴 Fork it
* 🐛 Open an Issue
* 💬 Suggest improvements

Happy Coding! 🚀
