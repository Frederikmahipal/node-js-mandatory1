if (process.env.NODE_ENV !== '') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport')
initializePassport(
  passport,
  username => users.find(user => user.username === username),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));


app.get('/', checkAuthenticated,(req, res) => {
  res.render('index.ejs', { username: req.user.username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.ejs')
})

app.get('/page', (req, res) => {
  res.render('page.ejs')
})

app.get('/rest', (req, res) => {
  res.render('rest.ejs')
})

app.get('/node', (req, res) => {
  res.render('node.ejs')
})

app.get('/ssr', (req, res) => {
  res.render('ssr.ejs')
})

app.get('/HTTP', (req, res) => {
  res.render('HTTP.ejs')
})

app.get('/cli', (req, res) => {
  res.render('cli.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
   
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: req.body.password
    })
    res.redirect('/login')
  } catch {
    res.redirect('/signup')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(8080)