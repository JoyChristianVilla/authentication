const express = require('express')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')
const bodyParser = require('body-parser')
const validator = require('validator')
require('../services/passport')

const requireSignin = passport.authenticate('local', {
  failureRedirect: '/error'
})

const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('error', { err: 'not signed in' })
}

router.get('/', (req, res) => {
  //res.send({ success: true })
  res.render('index.ejs')
})

router.get('/error', (req, res) => {
  res.render('error', { err: 'invalid email or password.' })
})

router.get('/secret', requireAuth, (req, res) => {
  res.render('secret')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  //validate email and password either here or on client side
  if (!validator.isEmail(req.body.email)) return res.render('error', { err: 'invalid email address. Please try again.' })
  if (req.body.password.length < 8) return res.render('error', { err: 'password must be at least 8 characters. Please try again.' })
  const { email, password } = req.body;
  const newUser = new User({ email, password })

  newUser.createUser(newUser, (err, user) => {
    if (err) return res.render('error', { err: err })
    //if (err) return res.send({ err })

    res.render('welcome', { user: user.email })
    //res.send({ user })
  })
})

router.get('/signin', (req, res) => {
  res.render('signin')
})
router.post('/signin', requireSignin, (req, res) => {
  res.render('welcome', { user: req.body.email })
  //res.send({ success: true })
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})
module.exports = router;
