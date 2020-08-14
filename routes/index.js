const express = require('express');
const router = express.Router();

const {ensureAuth, ensureUser} = require('../middleware/authentication')
const User= require('../models/User');
const Invite = require('../models/invites');

//login google
router.get('/', ensureUser, (req, res) => {
  res.render('loginmain', {
    layout: 'login',
  });
});

//user profile
router.get('/profile',  ensureAuth, async (req, res) => {
  try {
    const invites = await User.find({ user: req.user.id }).lean()
    res.render('profile', {
      name: req.user.firstName,
      lastname: req.user.lastName,
      since: req.user.createdAt,
      User,
    })
  } catch (error) {
    console.error(error)
  }
}); 

//blank
router.get('/addblank',  ensureAuth, async (req, res) => {
  res.render('invites/addblank')
}); 

//wedding template
router.get('/wedding',  ensureAuth, async (req, res) => {
  res.render('invites/weddings')
}); 

//birthday template
router.get('/birthday',  ensureAuth, async (req, res) => {
  res.render('invites/birthday')
}); 

//go to dashboard after authentiactn
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const invites = await Invite.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      invites,
    })
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;