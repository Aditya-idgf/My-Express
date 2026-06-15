// ============================================================================
// MODULE: COOKIES VS. AUTHORIZATION HEADERS
// ============================================================================
// This module compares browser-based Cookies with header-based Bearer Tokens 
// for securely transmitting authentication tokens.

const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const { connectDB } = require('./connection');
const URL = require('./model/model.url');

const router = require('./routes/route.url');
const staticRoute = require('./routes/route.staticRouter');
const userRoute = require('./routes/route.user');

// ----------------------------------------------------------------------------
// HOW COOKIES WORK & THEIR LIMITATIONS
// ----------------------------------------------------------------------------
// Browser Advantage: Browsers automatically save cookies and attach them to 
// every subsequent request. You don't need manual frontend code to send them.
// 
// The Mobile Problem: Cookies are a web browser feature. If you are building 
// a backend that serves iOS/Android mobile apps, relying on cookies is difficult.
// 
// Domain Scoping: Cookies are domain-specific. 
// Example: res.cookie('uid', token, { domain: '.github.com' });
// The '.' prefix allows ANY subdomain (like api.github.com) to access the cookie.
// This is exactly how Single Sign-On (SSO) works!
const cookieParser = require('cookie-parser');

// ----------------------------------------------------------------------------
// THE SOLUTION: AUTHORIZATION HEADERS (BEARER TOKEN)
// ----------------------------------------------------------------------------
// Instead of cookies, we send the token to the client as a normal JSON response. 
// The mobile app saves it in local storage, and manually attaches it to the 
// "Headers" of every subsequent HTTP request.
// 
// Example Header: 
// Authorization: Bearer q3789r4q3uiodfj390qaFIK
// 
// How to read this in auth.js:
// const authHeader = req.headers['authorization']; 
// const token = authHeader.split('Bearer ')[1]; // Takes the token part
const { restrictToLoggedInUserOnly, chechAuth } = require('./middleware/auth');


// Custom Logger Middleware
app.use((req, res, next) => {
    if(req.path === '/favicon.ico') return res.send();
    console.log(`[${req.method}] Request path : ${req.path}`);
    next();
});

// Global Middleware Configuration
app.use(cookieParser()); // Still needed if we support a web-browser frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Database Connection
connectDB('mongodb://127.0.0.1:27017/Project-Url-[11]');


// ============================================================================
// ROUTER MOUNTING & POSTMAN TESTING
// ============================================================================
// How to test Bearer Tokens in Postman for these protected routes:
// 1. Log in via your /user/login route and copy the token.
// 2. Open a new request tab for GET /url.
// 3. Go to the "Authorization" tab just below the URL bar.
// 4. Select "Bearer Token" from the Type dropdown and paste your token.
app.use('/url', restrictToLoggedInUserOnly, router);
app.use('/user', userRoute);
app.use('/', chechAuth, staticRoute);


// Test Route
app.get('/test', async (req, res) => {
    const allURL = await URL.find({});
    res.render('home', {
        urls: allURL,
    });
});

// Dynamic Route: URL Redirection Handler
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

// Dynamic Route: URL Analytics
app.get('/url/analytics/:id', async (req, res) => {
    const targetURL = await URL.findOne({ shortID: req.params.id });

    if (!targetURL) {
        return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
        totalClicks: targetURL.visitHistory.length,
        analytics: targetURL.visitHistory
    });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});