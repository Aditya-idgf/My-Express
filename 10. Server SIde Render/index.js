/**
 * URL Shortener - Server Side Rendering (SSR) Module
 * 
 * OVERVIEW:
 * Server-Side Rendering (SSR) generates the full HTML of a web page on the server 
 * before sending it to the client, rather than sending a blank shell for the 
 * browser to build via JavaScript.
 * 
 * TEMPLATING ENGINE (EJS):
 * We use EJS (Embedded JavaScript) to process templates. It allows developers 
 * to embed dynamic data into standard HTML syntax. During an HTTP request, 
 * the server injects contextual data into the EJS template to produce the final HTML.
 * 
 * ARCHITECTURE TRADE-OFF:
 * While SSR improves initial load times and SEO, it shifts the rendering workload 
 * to the server, which can increase CPU usage and response times under high traffic.
 */

const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
const router = require('./routes/route.url');
const { connectDB } = require('./connection');
const URL = require('./model/model.url');
const staticRoute = require('./routes/route.staticRouter');

/* 
 * VIEW ENGINE CONFIGURATION
 * Configure Express to use EJS as the dynamic templating engine.
 * The 'views' directory contains our dynamic .ejs templates (not static assets).
 */
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database Connection
connectDB('mongodb://127.0.0.1:27017/Project-Url');

/*
 * ROUTING
 * /url : API routes for creating and managing short URLs.
 * /    : View routes (SSR) returning HTML pages instead of raw JSON.
 */
app.use('/url', router);
app.use('/', staticRoute); 

/**
 * SSR EXAMPLE IMPLEMENTATION (Reference from route.staticRouter)
 * 
 * app.get('/test', async (req, res) => {
 *     const allURL = await URL.find({});
 *     // res.render() compiles the 'home.ejs' template with the provided data object
 *     res.render('home', { 
 *         allurls: allURL 
 *     }); 
 * });
 */

/**
 * GET /:id
 * Redirects to the original URL and records the visit timestamp.
 */
app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const entry = await URL.findOneAndUpdate(
        { shortID: id },
        {
            $push: {
                visitHistory: { timestamps: Date.now() }
            }
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});

/**
 * GET /url/analytics/:id
 * Returns click analytics and timestamp history.
 */
app.get('/url/analytics/:id', async (req, res) => {
    const targetURL = await URL.findOne({ shortID: req.params.id });

    return res.json({
        totalClicks: targetURL.visitHistory.length,
        analytics: targetURL.visitHistory
    });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});