const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pug = require('pug');
const path = require('path');

// Google Profile and Email indexing
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Authentication
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/dashboard');
});

// Local Authentication
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login'
}));

// Forgot Password
router.get('/forgot', (req, res) => {
    res.render('auth/forgot');
});

router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.redirect('/auth/forgot');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const resetUrl = `http://${req.headers.host}/auth/reset/${token}`;
    const mailOptions = {
        to: user.email,
        from: 'arnoldcuriano.bgecorp@gmail.com',
        subject: 'Password Reset',
        html: pug.renderFile(path.join(__dirname, '../views/emails/forgot-password.pug'), { resetUrl })
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/auth/forgot');
    });
});

router.get('/reset/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.redirect('/auth/forgot');
    }

    res.render('auth/reset', { token: req.params.token });
});

router.post('/reset/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.redirect('back');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.redirect('/auth/login');
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
