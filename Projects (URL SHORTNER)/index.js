/**
 * URL Shortener Application - Base Implementation
 * ---------------------------------------------------------------------------
 * This module serves as a foundational project to demonstrate advanced backend 
 * concepts in future iterations, such as Server-Side Rendering (SSR) and Authentication.
 * 
 * CORE WORKFLOW & ARCHITECTURE:
 * 
 * 1. POST Request ('/url'): 
 *    - Handled via `route.url.js` and `controller.url.js` (`handleGenerateShortURL`).
 *    - Expects JSON body: { "url": "https://www.instagram.com/" }
 *    - Generates an 8-character ID utilizing the `nanoid` package.
 *    - Server Response: { "msg": "URL Generated Successfully", "id": "dUnXF8aJ" }
 * 
 * 2. DATABASE MODEL (model.url.js):
 *    - shortID (String): The generated 8-character identifier.
 *    - redirectURL (String): The original URL destination.
 *    - visitHistory (Array): Stores objects containing timestamps of each visit.
 *    
 *    Example MongoDB Document (after 1 visit): 
 *    {
 *      _id: ObjectId('6a2e43e91eed1e5200db3bb9'),
 *      shortID: 'dUnXF8aJ',
 *      redirectURL: 'https://www.instagram.com/',
 *      visitHistory: [ { timestamps: 1781416994800, _id: ObjectId('...') } ],
 *      __v: 0
 *    }
 */

const express = require('express');
const app = express();
const port = 5000;
const router = require('./routes/route.url');
const { connectDB } = require('./connection');
const URL = require('./model/model.url');

// Middleware for parsing JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database connection
connectDB('mongodb://127.0.0.1:27017/Project-Url-[9]');

// Mount the URL router for all '/url' endpoints
app.use('/url', router);

/**
 * GET /:id
 * Retrieves the database entry for the provided shortID, logs the current 
 * timestamp into the visitHistory array, and redirects the client to the 
 * original redirectURL.
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

    res.redirect(entry.redirectURL);
});

/**
 * GET /url/analytics/:id
 * Fetches the visit analytics for a specific shortened URL.
 * 
 * @returns {Object} JSON containing totalClicks (calculated from array length) 
 *                   and the complete visitHistory array.
 * 
 * Example Response:
 * {
 *   "totalClicks": 2,
 *   "analytics": [
 *     { "timestamps": 1781416994800, "_id": "6a2e44221eed1e5200db3bba" },
 *     { "timestamps": 1781417071480, "_id": "6a2e446f1eed1e5200db3bbb" }
 *   ]
 * }
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