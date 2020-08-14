const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');

//to delete
const methodOverride = require('method-override');

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passauth')(passport)

connectDB()

const app = express()

//bodyparser
app.use(express.urlencoded({ extended: false }))

// method to add delete and put reqs
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
);

// logging infp
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//helpers
const {
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// hbrs
app.engine('.hbs',exphbs({
    helpers: {
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

// sessions
app.use(
  session({
    secret: 'ihatecoffee',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize())
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/invites', require('./routes/invites'))

const PORT = process.env.PORT || 3000;

app.listen( PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);