const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/authentication')

const Comment = require('../models/comments')

//add page
router.get('/add', ensureAuth, (req, res) => {
  res.render('comments/add')
});

//open invitation
router.get('/:id', ensureAuth, async (req, res) => {
  res.render('comments/show')
})

//post comments
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Comment.create(req.body)
    res.redirect('/dashboard')


  } catch (error) {
    console.error(error)
  }
});

//all comments
router.get('/', ensureAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('comments/index', {
      comments,
    })
  } catch (err) {
    console.error(err)
    
  }
});

//edit
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const comment= await Comment.findOne({
      _id: req.params.id,
    }).lean()

    if (!comment) {
      return res.send('error/404')
    };

//only the owner can edit.
    if (comment.user != req.user.id) {
      res.redirect('/comments')
    } else {
      res.render('comments/edit', {
        comment,
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
    let comment = await Comment.findById(req.params.id).lean()

    if (!comment) {
      return res.send('error/404')
    }

    if (comment.user != req.user.id) {
      res.redirect('/comments')
    } else {
      comment = await Invite.findOneAndUpdate({ _id: req.params.id }, req.body, {
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
    const comments = await Comment.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('comments/index', {
      comments,
    })
  } catch (err) {
    console.error(err)
    res.send('error/500')
  }
});

//deletion
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let comment= await Comment.findById(req.params.id).lean()

    if (!comment) {
      return res.send('error/404')
    }

    if (comment.user != req.user.id) {
      res.redirect('/comments')
    } else {
      await Comment.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.send('error/500')
  }
});

module.exports = router;