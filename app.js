const express= require('express');
const app= express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const Review = require('./models/review');
const ejsMate = require('ejs-mate'); // For using EJS as a template engine with Express

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(methodOverride('_method')); // For supporting PUT and DELETE methods in forms
app.engine('ejs', ejsMate);


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

/*app.get('/testListing', async(req,res)=>{  
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


// Index Route
app.get('/listings',async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render('Listings.ejs', {allListings});
});

//NEW ROUTE
app.get('/listings/new',(req,res)=>{
  res.render('new.ejs');
});

//SHOW ROUTE
app.get('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  const listing = await Listing.findById(id);
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
  res.redirect('/listings');
  }catch(err){
  next(err)
  }
});

//EDIT ROUTE
app.get('/listings/:id/edit', async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
    res.render('edit.ejs',{listing});
});

//Update Route
app.put('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//Delete route
app.delete('/listings/:id',async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
});

// Reviews // POST Route
app.post('/listings/:id/reviews', async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  await newReview.save(); // Save review to 'reviews' collection
  listing.reviews.push(newReview); // Push only the ID
  await listing.save(); // Save updated listing
  console.log(newReview);
  res.redirect(`/listings/${listing._id}`); // Optional: Redirect instead of send
});



app.use((err , req, res , next)=>{
  res.send('Something went wrong');
})



app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});