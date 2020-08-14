const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/authentication')

const Invite = require('../models/invites')

//add page
router.get('/add', ensureAuth, (req, res) => {
  res.render('invites/add')
});

//open invitation
router.get('/:id', ensureAuth, async (req, res) => {
  res.render('invites/show')
})

//post invites
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Invite.create(req.body)
    res.redirect('/dashboard')


  } catch (error) {
    console.error(error)
  }
});

//all invites
router.get('/', ensureAuth, async (req, res) => {
  try {
    const invites = await Invite.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('invites/index', {
      invites,
    })
  } catch (err) {
    console.error(err)
    
  }
});

//invitation edit
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const invite = await Invite.findOne({
      _id: req.params.id,
    }).lean()

    if (!invite) {
      return res.send('error/404')
    };

//only the owner can edit.
    if (invite.user != req.user.id) {
      res.redirect('/invites')
    } else {
      res.render('invites/edit', {
        invite,
      })
    }
  } catch (err) {
    console.error(err)
    return res.send('error/500')
  };
});

//editde inv
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let invite = await Invite.findById(req.params.id).lean()

    if (!invite) {
      return res.send('error/404')
    }

    if (invite.user != req.user.id) {
      res.redirect('/invites')
    } else {
      invite = await Invite.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.send('error/500')
  }
});

router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const invites = await Invite.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('invites/index', {
      invites,
    })
  } catch (err) {
    console.error(err)
    res.send('error/500')
  }
});

//deletion
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let invite = await Invite.findById(req.params.id).lean()

    if (!invite) {
      return res.send('error/404')
    }

    if (invite.user != req.user.id) {
      res.redirect('/invities')
    } else {
      await Invite.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.send('error/500')
  }
});

module.exports = router;