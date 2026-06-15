/**
 * ============================================================================
 * MODULE: Application Entry Point & Security Architecture
 * ============================================================================
 *
 * 1. Authentication vs. Authorization
 *    - Authentication: Verifies identity ("Who are you?") by validating credentials 
 *      like passwords or OTPs.
 *    - Authorization: Determines resource access ("What can you do?") based on 
 *      predefined permissions or roles.
 *
 * 2. Middleware Component Breakdown
 * 
 *    a) checkForAuthentication ("Soft Authentication")
 *       - Purpose: Runs globally on every incoming request to check login status.
 *       - Mechanism: Looks for a token inside the incoming cookies. 
 *         > If found: Fetches the user and attaches them to `req.user`.
 *         > If not found: Defaults `req.user` to `null` (guest state).
 *
 *    b) restrictTo (Role-Based Access Control)
 *       - Context: Relies on `model.user.js` having a `role` field.
 *       - Mechanism: Protects routes based on required privileges.
 *         > Step 1: Checks `req.user` (set earlier by checkForAuthentication).
 *         > Step 2: If `req.user` is null, redirects to `/login`.
 *         > Step 3: If `req.user.role` matches the allowed roles, it allows access (`next()`).
 *         > Step 4: If the role does not match, it returns 'Unauthorized'.
 *
 * 3. Architectural Design: Standard Middleware vs. Factory Pattern
 *    - The "Golden Rule" of Express: Express strictly expects middleware to have 
 *      the exact signature: `function(req, res, next)`. It does not know how to pass 
 *      custom configurations (like an array of roles) into a middleware function.
 *    - Why checkForAuthentication is Standard: It executes the exact same static logic 
 *      every time it runs. Therefore, it perfectly fits the standard `(req, res, next)` 
 *      signature and can be passed directly to `app.use()`.
 *    - Why restrictTo is a Factory (Closure): Because different routes require different 
 *      permissions (e.g., `['ADMIN']` vs `['NORMAL', 'ADMIN']`), a standard middleware 
 *      won't work. Instead, `restrictTo(roles)` is designed as a factory function. 
 *      When you call it in the route, it takes your custom configuration and *returns* 
 *      the standard `(req, res, next)` function. Thanks to closures, this inner function 
 *      remembers the `roles` array, keeping both Express and our dynamic routing happy.
 * ============================================================================
 */

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

const { checkForAuthentication, restrictTo } = require('./middleware/auth');

// Request Logger
app.use((req, res, next) => {
    if(req.path === '/favicon.ico') return res.send();
    console.log(`[${req.method}] Request path : ${req.path}`);
    next();
})

// Global Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

// Attach user identity to every request
app.use(checkForAuthentication);

// Setup View Engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Database Initialization
connectDB('mongodb://127.0.0.1:27017/Project-Url-[14]')

// Routes 
// Apply Authorization dynamically using the middleware factory
app.use('/url', restrictTo(['NORMAL', 'ADMIN']), router);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/test', async (req, res) => {
    const allURL = await URL.find({});
    res.render('home', {
        urls: allURL,
    }) 
});

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