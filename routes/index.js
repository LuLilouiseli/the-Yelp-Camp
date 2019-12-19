var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')

router.get('/', function (req, res) {
    res.render('landing')
  })
  
  // ==============
  // COMMENTS ROUTES
  // ==============
  
  
  //auth routes
  //show register form
  router.get('/register',function(req,res){
    res.render('register')
  })
  //register
  router.post('/register',function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser, req.body.password,function(err,user){
      if(err){
        req.flash('error',err.message)
        console.log(err)
        res.render('register')
      }else{
        passport.authenticate('local')(req,res,function(){
         req.flash('success','Welcome to YelpCamp'+user.username)
          res.redirect('/campgrounds')
        })
      }
    })
  })
  
  // show login form
  router.get('/login',function(req,res){
    req.flash('success','Successfully logged in as:'+req.body.username)
    res.render('login')
  })

  // '',middleware, callback
  router.post('/login', passport.authenticate('local',
  {successRedirect:'/campgrounds',
  failureRedirect:'/login'
  }),function(req,res){
  
  })
  
  // logout routes
  router.get('/logout',function(req,res){
    req.logout()
    req.flash('error','Logged you out')
    res.redirect('/campgrounds')
  })
  


  module.exports = router