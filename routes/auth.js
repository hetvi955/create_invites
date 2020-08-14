const express = require('express');
const passport = require('passport');
const router = express.Router();

//login google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//afetr login redirect to dashbaord.
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
);

//logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
});

module.exports = router;