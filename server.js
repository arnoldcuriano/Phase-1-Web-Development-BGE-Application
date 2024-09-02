require('dotenv').config(); // Load environment variables
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');


// Initialize Express
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public', 'favicon.ico')));


// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static('uploads')); // Serve uploaded files from 'uploads' folder

// Configurations
const config = require('./config/keys');

// Passport Config
require('./config/passport')(passport);

// MongoDB Config
mongoose.connect(config.mongoURI, {

});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Management with MongoStore
app.use(session({
    secret: config.secretOrKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: config.mongoURI })
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware to add user to res.locals
app.use((req, res, next) => {
    res.locals.user = req.user || { profilePicture: '', name: 'Guest' };
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes setup
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/members', require('./routes/members'));
app.use('/departments', require('./routes/departments'));
app.use('/services', require('./routes/services'));
app.use('/projects', require('./routes/projects'));
app.use('/it/item-inventory', require('./routes/itemInventory'));
app.use('/it/item-distributed', require('./routes/itemDistributed'));
app.use('/it/category-management', require('./routes/categories'));
app.use('/clients', require('./routes/clients'));
app.use('/hr-department', require('./routes/management'));
app.use('/announcements', require('./routes/announcements'));
app.use('/events', require('./routes/events'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
