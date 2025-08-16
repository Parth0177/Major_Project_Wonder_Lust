if(process.env.NODE_ENV !== 'production') {
require('dotenv').config();
}
const express= require('express');
const app= express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const { isLoggedIn, isOwner, isAuthor } = require('./middleware'); 
const {saveRedirectUrl} = require('./middleware');
const listingController = require('./controller/listings');
const reviewController = require('./controller/reviews');
const userController = require('./controller/users');
const multer = require('multer');
const { cloudinary,storage } = require('./cloudConfig');
const upload = multer({storage});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // For supporting PUT and DELETE methods in forms
app.engine('ejs', ejsMate);

const sessionOptions= {
  secret: 'mySuperSecretCode',
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000, // 7 days
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly: true, // Helps prevent XSS attacks
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user; // Make currentUser available in all templates
  next();
});


//const MONGO_URL= 'mongodb://127.0.0.1:27017/WonderLust';
const db_url = process.env.ATLAS_URL;


async function main(){
  await mongoose.connect(db_url)
}

main().then((res)=>{
  console.log('Connected with the database');
}).catch((err)=> console.log(err));

//Render Signup form
app.get('/signup',(userController.renderSignupForm));

// Sign Up Route 
app.post('/signup',(userController.SignUp));

// Render Login form
app.get('/login',(userController.renderLoginForm));

// Middleware to save redirect URL
app.post('/login', saveRedirectUrl , passport.authenticate("local",{failureRedirect:'/login' , failureFlash:true}) ,(userController.Login));


// Logout Route
app.get('/logout', (userController.logout));

// Error handling middleware
app.use((err , req, res , next)=>{
  res.send('Something went wrong');
});


app.get('/',(req,res)=>{
res.render('home.ejs');
});


// Index Route
app.get('/listings',(listingController.index));


//NEW ROUTE
app.get('/listings/new',isLoggedIn, (listingController.new));

//SHOW ROUTE
app.get('/listings/:id', (listingController.show));

//Create Route
app.post('/listings', isLoggedIn, upload.single('listing[image]'), (listingController.create));

//EDIT ROUTE
app.get('/listings/:id/edit', isLoggedIn,isOwner, (listingController.edit));

//Update Route
app.put('/listings/:id', isLoggedIn, isOwner , upload.single('listing[image]'), (listingController.update));

//Delete route
app.delete('/listings/:id', isLoggedIn,isOwner, (listingController.delete));

// Reviews // POST Route
app.post('/listings/:id/reviews',isLoggedIn,(reviewController.createReviews) );

// DELETE REVIEW ROUTE

app.delete('/listings/:id/reviews/:reviewId', isLoggedIn, isAuthor, (reviewController.deleteReviews));



app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});;