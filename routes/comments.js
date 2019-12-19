var express = require('express')
var router = express.Router({mergeParams:true})
var Campground = require('../models/campground')
var Comment = require('../models/comment')
var middleware = require('../middleware')//because there is only one in middleware folder
//comments new
router.get('/new', middleware.isLoggedIn, function (req, res) {
    // find by id
    Campground.findById(req.params.id, function (err, camp) {
      if (err) {
        console.log(err)
      } else {
        res.render('comments/news', { campground: camp })
      }
    })
  })

  //comments create
  router.post('/', middleware.isLoggedIn, function (req, res) {
    // lookup camp using id
    Campground.findById(req.params.id, function (err, camp) {
      if (err) {
        console.log(err)
        res.redirect('/campgrounds')
      } else {
        console.log(req.body.comment)
        Comment.create(req.body.comment, function (err, comment) {
          if (err) {
             req.flash('error','Sth went wrong')
            console.log(err)
          } else {
            //add username and id to comment
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            //save comment
            comment.save()
            camp.comments.push(comment)
            camp.save()
             req.flash('success','Successfully added comment')
            res.redirect('/campgrounds/' + camp._id)
          }
        })
      }
    })
 
  })
  //edit


  router.get('/:comment_id/edit', function(req,res) {
    //does the user own the campground?
    Campground.findById(req.params.comment_id, function(err,foundComment){
      if(err){
        res.redirect('back')
      }else{
        res.render('comments/edit',{campground_id:req.params.id, comment:foundComment})
      }
     
    })
})

  // update
  router.put('/:comment_id',function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
      if(err){
        res.redirect('back')
      }else{
        res.redirect('/campgrounds/'+req.params.id)
      }
    })
  })

  //comment destroy route

  router.delete('/:comment_id',function(req,res){
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
      if(err){
        res.redirect('back')
      }else{
        req.flash('success','Comment deleted')
        res.redirect('/campgrounds/'+req.params.id)
      }
    })
  })



  module.exports = router