/**
 * =========================================================================
 * MODULE: File Upload Handing via Multer Middleware
 * =========================================================================
 * Multer is a specialized Node.js middleware for handling 'multipart/form-data'.
 * It is primarily utilized for processing file uploads in web applications.
 * Built on top of the 'busboy' parser, it ensures maximum parsing efficiency.
 */

const express = require('express');
const path = require('path');
const multer = require('multer');

/**
 * NOTE: Alternative Basic Implementation
 * -------------------------------------
 * const uploads = multer({ dest: 'uploads/' });
 * Passing the 'dest' property provides a quick setup where uploaded files 
 * are automatically saved to the designated folder, but filename obfuscation occurs.
 */

const app = express();
const port = 8000;

// View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Core Request Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Mandatory for parsing incoming URL-encoded form data

// Global Logging Middleware (Ignoring Favicon requests)
app.use((req, res, next) => {
    if (req.path === '/favicon.ico') return next();
    console.log(`[${req.method}] Request received on path: ${req.path}`);
    next();
});

// Root Route - Renders the Upload Interface
app.get('/', (req, res) => {
    res.render('home'); 
});

/**
 * ADVANCED STORAGE CONFIGURATION (DiskStorage)
 * --------------------------------------------
 * Using diskStorage grants absolute control over file destinations and naming conventions,
 * preventing files from being saved as random, extensionless hashes.
 * * The diskStorage engine accepts a configuration object containing two key functions:
 * 1. destination: Determines the target directory on the disk.
 * 2. filename: Controls the exact nomenclature of the saved file.
 * * Both functions accept three parameters:
 * - req: The incoming HTTP request object.
 * - file: An object containing metadata about the uploaded file.
 * - cb (Callback): A function executed to proceed, accepting (error, result).
 */
const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        // First argument is null (no error), second is the target directory path
        return cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        // Appends a unique timestamp prefix to prevent filename collisions
        return cb(null, `${Date.now()} - ${file.originalname}`);
    },
});

// Initialize Multer instance injecting the custom disk storage engine
const uploads = multer({ storage: storage });

/**
 * FILE UPLOAD HANDLING ROUTE
 * --------------------------
 * CRITICAL FRONTEND REQUIREMENT: The HTML form must contain the attribute: enctype="multipart/form-data"
 * * Middleware: uploads.single('profileImage')
 * - Processes a single file matching the input field name 'profileImage' from the form.
 * - Populates 'req.file' with file metadata and 'req.body' with textual form fields.
 */
app.post('/upload', uploads.single('profileImage'), (req, res) => {
    console.log("Form Text Fields (req.body):", req.body);
    console.log("Uploaded File Metadata (req.file):", req.file);
    return res.redirect('/');
});

// Start Application Server
app.listen(port, () => {
    console.log(`Server successfully started on: http://localhost:${port}`);
});