// As the project grows, keeping everything inside a single file becomes
// difficult to manage. To improve code readability, maintainability, and
// scalability, we split the application into different modules following
// the MVC (Model-View-Controller) architecture.

// MVC Architecture:
// Controller -> Handles incoming requests and contains the business logic.
// Model      -> Defines the database schema and performs database operations.
// View       -> Renders data to the user (using EJS for server-side rendering).

// Folder Structure:
//
// controllers/ -> Contains business logic and request handler functions
//                 used by different HTTP methods.
//
// middleware/  -> Contains middleware functions that process or modify
//                 incoming requests before they reach the controllers.
//
// models/      -> Defines the data models (schemas) that determine how
//                 data is stored in the database.
//
// routes/      -> Defines application endpoints and maps them to the
//                 appropriate controller functions.
//
// views/       -> Contains EJS templates used for server-side rendering.
//
// services/    -> (Optional) Contains reusable utility functions or pure
//                 JavaScript logic that doesn't belong in controllers,
//                 such as authentication, token generation, etc.
// 
// connection.js -> (Optional) Stores the database connection logic (mongoose.connect)
//               to separate configuration from the application entry point.const express = require('express');

const app = express();
const port = 5000;

const userRouter = require('./routes/user.js');
const { connectMongooseDb } = require('./connection.js');
const { checkType } = require('./middleware/gate.js');

// Establish connection with the MongoDB database.
connectMongooseDb('mongodb://127.0.0.1:27017/MERA-DEMO-APP-1');

// Middleware to parse URL-encoded form data.
app.use(express.urlencoded({ extended: false }));

// Custom middleware executed before the request reaches the routes.
app.use(checkType());

// Mount all user-related routes under the '/users' path.
app.use('/users', userRouter);

// Default route.
app.get('/', (req, res) => {
    res.end('HELLO FROM THE HOME PAGE');
});

// Start the Express server.
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});