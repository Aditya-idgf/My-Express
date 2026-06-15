// ============================================================================
// MODULE: STATELESS AUTHENTICATION & ROUTING SETUP (JWT)
// This module covers how we implement Stateless Authentication using JSON Web Tokens (JWT).
// ============================================================================

// ----------------------------------------------------------------------------
// STATEFUL vs STATELESS AUTHENTICATION
// ----------------------------------------------------------------------------
// Stateless authentication is an identity verification method where the server 
// DOES NOT store session data in memory or a database.
// 
// Instead, every incoming request is self-contained. It carries a cryptographically 
// signed token that contains all the necessary information to verify the user.
// 
// Pros: Eliminates the need for central session storage (like Hash Maps or Redis). 
// This makes horizontal scaling much easier, reduces server memory overhead, and 
// improves performance by skipping database/memory lookups for every request.

// ----------------------------------------------------------------------------
// WHAT IS JWT (JSON WEB TOKEN)?
// ----------------------------------------------------------------------------
// JWT is a compact, URL-safe standard (RFC 7519) used for stateless authentication.
// It consists of three parts: Header, Payload (data like User ID), and Signature.
// Because it is cryptographically signed using a Secret Key on our server, any 
// server that knows the secret key can verify the user's identity independently. 
// If anyone tampers with the payload data, the signature breaks and the token is instantly rejected.

// ----------------------------------------------------------------------------
// HOW THIS IS DIFFERENT FROM OUR PREVIOUS (STATEFUL) MODULE:
// ----------------------------------------------------------------------------
// In the previous module, we maintained a 'Hash Map' to link a random UUID to user data.
// 
// CHANGES IN service/auth.js:
// 
// Earlier (Stateful): 
// - setUser: We stored the user object inside the Map using a generated UUID as the key.
// - getUser: We looked up the UUID inside the Map to verify if the user existed.
// 
// Now (Stateless/JWT): 
// - setUser: We use `jwt.sign(payload, secretKey)`. We pass the user data (payload) 
//   and our server's secret key. This returns a signed JWT token string, which we 
//   then give to the user (usually stored in a cookie).
// - getUser: We use `jwt.verify(token, secretKey)`. This mathematically validates 
//   the token. We don't look up a Map; the function simply decrypts the token 
//   to return the user data.
//
// *The rest of the routing logic (redirects, checkAuth, restrictToLoggedInUserOnly) 
// remains exactly the same as the stateful module!*


const express = require('express');
const path = require('path')
const app = express();
const port = 8000;

const { connectDB } = require('./connection');
const URL = require('./model/model.url');

const router = require('./routes/route.url');
const staticRoute = require('./routes/route.staticRouter')
const userRoute = require('./routes/route.user');

const cookieParser = require('cookie-parser');

const { restrictToLoggedInUserOnly, chechAuth } = require('./middleware/auth');

// Custom Logger Middleware
app.use((req, res, next) => {
    if(req.path === '/favicon.ico') return res.send();
    console.log(`[${req.method}] Request path : ${req.path}`);
    next();
})

// Global Middleware Configuration
app.use(cookieParser()); // Still needed because we will send the JWT token via a cookie
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Database Connection
connectDB('mongodb://127.0.0.1:27017/Project-Url-[12]')

// ROUTER MOUNTING
// The logic of these middlewares remains the same, but internally they are now 
// calling jwt.verify() instead of checking a memory map.
app.use('/url', restrictToLoggedInUserOnly, router);
app.use('/user', userRoute);
app.use('/', chechAuth, staticRoute);

// Test Route (Often used for debugging or admin purposes)
app.get('/test', async (req, res) => {
    const allURL = await URL.find({});
    res.render('home', {
        urls: allURL,
    }) 
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
})