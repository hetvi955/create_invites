module.exports = {
  ensureAuth: function (req, res, done) {
    if (req.isAuthenticated()) {
      return done()
    } else {
      res.redirect('/')
    }
  },
  
  ensureUser: function (req, res, done) {
    if (!req.isAuthenticated()) {
      return done();
    } else {
      res.redirect('/dashboard');
    }
  },
}