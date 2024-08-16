const express = require('express');
const router = express.Router();

// Redirect root to login
router.get('/', (req, res) => {
    res.render('auth/login');
});

module.exports = router;
