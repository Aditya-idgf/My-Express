// ============================================================================
// MODULE: AUTHENTICATION & ROUTING SETUP
// This module covers how we implement authentication in our backend for security.
// ============================================================================

// ----------------------------------------------------------------------------
// STATEFUL vs STATELESS AUTHENTICATION
// ----------------------------------------------------------------------------
// There are mainly two types of authentication: Stateful and Stateless. 
// In this module, we are covering STATEFUL authentication.
//
// Stateful authentication maintains user session data on the server (in memory or a database).
// The server generates a 'Session ID' and sends it to the client via a Cookie.
// Pros: Easy to revoke sessions (logout) and gives granular security control.
// Cons: Can cause scalability bottlenecks in distributed systems, requiring shared storage like Redis.

// ----------------------------------------------------------------------------
// HOW WE STORE SESSION DATA IN THIS PROJECT
// ----------------------------------------------------------------------------
// To maintain a stateful record of user data and their session IDs, we have implemented 
// a 'Hash Map' inside the 'auth.js' file in our 'service' folder.
// To store an entry: map.set(id, user)
// To retrieve an entry: map.get(id) -> As used in our restrictToLoggedInUserOnly function.

// ----------------------------------------------------------------------------
// STEP-BY-STEP AUTHENTICATION FLOW IN THIS PROJECT:
// ----------------------------------------------------------------------------
// 1. PUBLIC ROUTE CHECK: When a user tries to access '/', the request goes through the 'checkAuth' 
//    middleware. This passively checks if the user is logged in.
// 
// 2. SIGNUP FLOW:
//    a. If the user is not logged in, 'checkAuth' sets req.user to null. Seeing this, the 
//       staticRouter redirects the user to the '/login' page.
//    b. If the user hasn't signed up yet, they go to '/signup'. This renders 'signup.ejs', 
//       where a form sends their data via a POST request to '/user'.
//    c. The 'handleUserSignup' function (in route.user.js) creates a new database entry 
//       with their name, email, and password.
//    d. After creation, the user is redirected to '/', but since they still don't have an 
//       active session (cookie), they are instantly redirected back to '/login'.
//
// 3. LOGIN FLOW:
//    a. On the '/login' route, staticRouter renders 'login.ejs'.
//    b. The user submits their email and password, sending a POST request to '/user/login'.
//    c. The 'handleUserLogin' function checks the credentials against the database. If they don't 
//       match, the user is redirected back with an 'Invalid Username Or Password' message.
//    d. If the credentials match, a unique Session ID is generated (using the 'uuid' package). 
//       The 'setUser()' function maps this ID to the user in our Hash Map. Finally, this ID 
//       is placed inside a cookie named 'uid' and sent to the browser.
//       (You can see this in the browser's Application tabs).
//
// 4. AFTER SUCCESSFUL LOGIN: 
//    The user is redirected to '/'. Now, 'checkAuth' finds the valid 'uid' cookie and populates 
//    req.user. The staticRouter uses this to filter database queries so the user only sees 
//    their own generated URLs (Data Isolation).
//
// 5. CREATING A NEW URL (PROTECTED ROUTE): 
//    When generating a new URL, the request first hits the inline middleware 'restrictToLoggedInUserOnly'. 
//    This acts as a strict bouncer, checking for a valid cookie. Only if the cookie is valid 
//    does the request reach 'route.url' to actually generate the short URL.


const express = require('express');
const path = require('path')
const app = express();
const port = 8000;

const {connectDB} = require('./connection');
const URL = require('./model/model.url');

const router = require('./routes/route.url');
const staticRoute = require('./routes/route.staticRouter')
const userRoute = require('./routes/route.user');

const cookieParser = require('cookie-parser'); // Required because we are passing the sessionID as a cookie

const {restrictToLoggedInUserOnly, chechAuth} = require('./middleware/auth'); // Importing our 2 middleware functions

// MIDDLEWARE 1: restrictToLoggedInUserOnly
// This strictly checks if the incoming request has a cookie containing a valid 'uid' (Session ID).
// If it is missing or invalid, it immediately redirects the user to the login page.
// Use this to completely lock down private routes.

// MIDDLEWARE 2: checkAuth
// This is a "soft" validator. It checks if the user is logged in. 
// If yes, it attaches their data to 'req.user'. If no, it sets 'req.user' to null (but does NOT block the request).
// This is crucial because when 'req.user' is null, the staticRouter logic will safely redirect them to '/login' 
// if they try to access a page that requires user data.

app.use((req, res, next) => {
    if(req.path === '/favicon.ico') return res.send();
    console.log(`A Request of Type : ${req.method} was made by path : ${req.path} \n`);
    next();
})

app.use(cookieParser());

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json());

connectDB('mongodb://127.0.0.1:27017/Project-Url-[11]')

app.use(express.urlencoded({extended:false})) 

// INLINE MIDDLEWARE ROUTING
// If a request tries to hit '/url', it must pass through restrictToLoggedInUserOnly first to ensure the user is logged in.
app.use('/url', restrictToLoggedInUserOnly, router);
app.use('/user', userRoute);
app.use('/', chechAuth, staticRoute);

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const entry = await URL.findOneAndUpdate(
        { shortID: id },
        {
            $push: {
                visitHistory: {
                    timestamps: Date.now()
                }
            }
        }
    );
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});

app.get('/url/analytics/:id', async (req, res) => {
    const targetURL = await URL.findOne({shortID: req.params.id});

    return res.json({
        totalClicks: targetURL.visitHistory.length,
        analytics: targetURL.visitHistory
    });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
})