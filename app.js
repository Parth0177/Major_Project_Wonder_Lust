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




const MONGO_URL= 'mongodb://127.0.0.1:27017/WonderLust';
async function main(){
  await mongoose.connect(MONGO_URL)
}

main().then((res)=>{
  console.log('Connected with the database');
}).catch((err)=> console.log(err));

app.get('/signup', (req,res)=>{
  res.render('signup.ejs');
});
app.post('/signup',async(req,res)=>{
  try{
    let {email,username,password}= req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser, (err)=>{
  if(err){
      req.flash('error', 'Registration failed: ' + err.message);
      return res.redirect('/signup');
  }
  req.flash('success', 'Welcome, ' + registeredUser.username + '!');
  res.redirect('/listings');
  })
  }catch(err){
  req.flash('error', 'Registration failed: ' + err.message);
  res.redirect('/signup');
}
});

app.get('/login',(req,res)=>{
  res.render('login.ejs');
});

app.post('/login', saveRedirectUrl , passport.authenticate("local",{failureRedirect:'/login' , failureFlash:true}) ,async(req,res,next)=>{
  req.flash('success', 'Welcome back, ' + req.user.username + '!');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
});

app.get('/logout', (req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/login');
  })
})

app.get('/',(req,res)=>{
res.render('home.ejs');
});

// Index Route
app.get('/listings',(listingController.index));


// Error handling middleware
app.use((err , req, res , next)=>{
  res.send('Something went wrong');
})



//NEW ROUTE
app.get('/listings/new',isLoggedIn, (listingController.new));

//SHOW ROUTE
app.get('/listings/:id', (listingController.show));

//Create Route
app.post('/listings', isLoggedIn, (listingController.create));

//EDIT ROUTE
app.get('/listings/:id/edit', isLoggedIn,isOwner, (listingController.edit));

//Update Route
app.put('/listings/:id', isLoggedIn, isOwner , (listingController.update));

//Delete route
app.delete('/listings/:id', isLoggedIn,isOwner, (listingController.delete));

// Reviews // POST Route
app.post('/listings/:id/reviews',isLoggedIn, async (req,res)=>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author to the currently logged-in user

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/listings/${listing._id}`);
});

// DELETE REVIEW ROUTE

app.delete('/listings/:id/reviews/:reviewId', isLoggedIn, isAuthor, async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully!');
  res.redirect(`/listings/${id}`);
});



app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});