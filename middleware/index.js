//all the middle ware goes here
var middlewareObj = {};
var Campground = require('../models/campground')
var Comment = require('../models/comment')

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    //is user logged in ?
    if(req.isAuthenticated()){
      //does the user own the campground?
      Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
          req.flash('error','Campground not found')
          res.redirect('back')
        } else{
          if((foundCampground.author.id).equals(req.user._id)){
            next()
          } else{
            req.flash('error','You donnot have permission')
            res.redirect('back')
          }
        }
      })
    }else{
      // console.log('you need to be logged in!')
      req.flash('error','You need to be logged in')
      res.redirect('back')//redirect to previous page
    }
    }
  middlewareObj.checkcommentsOwnership = function(req,res,next){
        //is user logged in ?
    if(req.isAuthenticated()){
      //does the user own the campground?
      Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
          res.redirect('back')
        } else{
          //req.user._id ---string
          //foundCampground.user.id ----object
          if((foundComment.author.id).equals(req.user._id)){
            next()
          } else{
            req.flash('error','You donnot have permission')
            res.redirect('back')
          }
        }
      })
    }else{
     req.flash('error','you need to be logged in to do that')
      // console.log('you need to be logged in!')
      res.redirect('back')//redirect to previous page
    }
    }
  //middleware
  middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
      return next()
    }
    req.flash('error','you need to be logged in to do that')
    res.redirect('/login')
  }
module.exports = middlewareObj