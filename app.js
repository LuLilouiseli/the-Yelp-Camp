var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var url = process.env.DATABASEURL || "mongodb+srv://louise:password1234@cluster0-x7txb.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(url)
//mongoose.connect('mongodb+srv://louise:password1234@cluster0-x7txb.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true }, { useUnifiedTopology: true })
var flash = require('connect-flash')
 var seedDB = require('./seeds')

var passport = require('passport')
var localStrategy = require('passport-local')
var User = require('./models/user')
var methodOverride = require ('method-override')
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
//link to the css file
app.use(express.static(__dirname+'/public'))
app.use(methodOverride('__method'))
// seedDB()

//require the routes
var commentRoutes = require('./routes/comments')
var campgroundRoutes = require('./routes/campgrounds')
var indexRoutes= require('./routes/index')

//passport
app.use(require('express-session')({
  secret:'cute!!!',
  resave:false,
  saveUninitialized:false
}))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
  res.locals.currentUser = req.user
  //if error/success
  res.locals.error=req.flash('error')
  res.locals.success=req.flash('success')
  next()
})
app.use(indexRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)
app.use('/campgrounds',campgroundRoutes)



app.listen(process.env.PORT,process.env.IP, function () {
  console.log('Yelp has started!')
})
