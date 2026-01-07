require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');

const app = express();

// View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to Database
// connectDB(); // Removed immediate call

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database Connection Error:", error);
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

// View Engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Routes
// app.use('/', require('./routes/public.routes')); // Disable EJS public routes
app.use('/admin', require('./routes/admin.routes'));
app.use('/api/v1', require('./routes/api/portfolio.routes'));

// Serve React App for all other routes (SPA)
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("Frontend build not found at:", indexPath);
        res.status(404).send("Frontend application is not built. Please check deployment logs.");
    }
});

const PORT = process.env.PORT || 5000;

console.log("Starting Portfolio Server..."); // Debug log

// Only start server if run directly (local dev), otherwise export for Vercel
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;