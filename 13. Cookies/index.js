

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
connectDB('mongodb://127.0.0.1:27017/Project-Url');

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