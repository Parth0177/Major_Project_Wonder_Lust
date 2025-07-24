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
  next();
});




const MONGO_URL= 'mongodb://127.0.0.1:27017/WonderLust';
async function main(){
  await mongoose.connect(MONGO_URL)
}

main().then((res)=>{
  console.log('Connected with the database');
}).catch((err)=> console.log(err));


app.get('/',(req,res)=>{
  res.send('Welcome');
});

//UserRegistration Route
/*app.get('/demouser',async(req,res)=>{
  let fakeUser= new User({
    email:'student@gmail.com',
    username:'Parth'
  });
  
  let registered= await User.register(fakeUser,'helloworld');
  res.send(registered);

})

app.get('/testListing', async(req,res)=>{  
    let listing = new Listing({
    title: 'Beautiful Beach House',
    description: 'A lovely beach house with stunning views.',
    image: '',
    price: 5250,
    location: 'Malibu, CA',
    country: 'USA'
  });

  await listing.save()
    .then(() => res.send('Listing created successfully'))
    .catch(err => res.status(500).send('Error creating listing: ' + err.message));
})*/

app.get('/signup', (req,res)=>{
  res.render('signup.ejs');
});
app.post('/signup',async(req,res)=>{
  try{
  let {email,username,password}= req.body;
  const newUser = new User({email,username});
  const registeredUser = await User.register(newUser,password);
  req.flash('success', 'Welcome to WonderLust, ' + registeredUser.username + '!');
  console.log(registeredUser);
  res.redirect('/listings');
  }catch(err){
  req.flash('error', 'Registration failed: ' + err.message);
  res.redirect('/signup');
  }
});


// Index Route
app.get('/listings',async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render('Listings.ejs', {allListings});
});
app.use((err , req, res , next)=>{
  res.send('Something went wrong');
})



//NEW ROUTE
app.get('/listings/new',(req,res)=>{
  res.render('new.ejs');
});

//SHOW ROUTE
app.get('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if(!listing){
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
  res.render('show.ejs', {listing});
});

//Create Route
app.post('/listings', async(req,res , next)=>{
  try{
  const {title, description, image, price, location, country} = req.body;
  const listing = new Listing({
    title,
    description,
    image: {
      filename: image,
      url: image,
    },
    price,
    location,
    country
  });
  await listing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
  }catch(err){
  next(err)
  }
});

//EDIT ROUTE
app.get('/listings/:id/edit', async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
    res.render('edit.ejs',{listing});
});

//Update Route
app.put('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete('/listings/:id',async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
});

// Reviews // POST Route
app.post('/listings/:id/reviews', async (req,res)=>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/listings/${listing._id}`);
});

// DELETE REVIEW ROUTE

app.delete('/listings/:id/reviews/:reviewId', async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully!');
  res.redirect(`/listings/${id}`);
});



app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});