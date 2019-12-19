var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')

var middleware = require('../middleware')//because there is only one in middleware folder

router.get('/', function (req, res) {
    // retrieve all the camps
    Campground.find({}, function (err, allcamps) {
      if (err) {
        console.log(err)
      } else {
        res.render('campgrounds/index', { campgrounds: allcamps, currentUser:req.user })
      }
    })
  })
  
  router.post('/',middleware.isLoggedIn, function (req, res) {
    // get data from form and add to array
    var name = req.body.name
    var image = req.body.image
    var price = req.body.price
    var desc = req.body.description
    var author = {
      id:req.user._id,
      username:req.user.usernamer
    }
    var newCampground = { name: name, price:price, image: image, description: desc, author:author }
  console.log(author)
  console.log('author:'+author.username)
    // create new camp and save to db
    Campground.create(newCampground, function (err, newCamp) {
      if (err) {
        console.log(err)
      } else {
        // redirect to campgrounds page
        res.redirect('/campgrounds')
      }
    })
  })
  // SHOW FORM TO CREATE NEW CAMP
  router.get('/news', middleware.isLoggedIn,function (req, res) {
    res.render('campgrounds/news')
  })// show the form that we sent data
  
  // SHOW DETAIL WHEN CLICK INTO ONE
  router.get('/:id', function (req, res) {


    // FIND CAMP WITH PROVIDED ID
    // populate the comments and execute the function
    Campground.findById(req.params.id).populate('comments').exec(function (err, found) {
      if (err) {
        console.log(err)
      } else {
        res.render('campgrounds/show', { campground: found })
      }
    })
  
    // RENDER SHOW TEMPLATE WITH THAT ID
  })
  //edit campground
router.get('/:id/edit', middleware.checkCampgroundOwnership,function(req,res){
    //does the user own the campground?
    Campground.findById(req.params.id, function(err,foundCampground){
      if(err){
       req.flash('error','Campground not found')
      }
      res.render('campgrounds/edit',{campground:foundCampground})
    })
})

  //update campground
router.put('/:id',function(req,res){
  //find and update the correct camp
  Campground.findByIdAndUpdate(req.params.campground,function(err,updatedCampground){
    if(err){
      console.log(err)
      res.redirect('/campgrounds')
    }else {
      res.redirect('/campgrounds/'+req.params.id)
    }
  })
  //redirect somewhere(showpage)
})

//destroy
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect('/campgrounds')
    }else{

      res.redirect('/campgrounds')
    }
  })
})

  //middleware
  function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }


  module.exports = router