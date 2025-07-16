const express= require ('express');
const router = express.Router();

// Index Route
router.get('/listings',async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render('Listings.ejs', {allListings});
});
app.use((err , req, res , next)=>{
  res.send('Something went wrong');
})



//NEW ROUTE
router.get('/listings/new',(req,res)=>{
  res.render('new.ejs');
});

//SHOW ROUTE
router.get('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  const listing = await Listing.findById(id).populate('reviews');
  res.render('show.ejs', {listing});
});

//Create Route
router.post('/listings', async(req,res , next)=>{
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
router.get('/listings/:id/edit', async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
    res.render('edit.ejs',{listing});
});

//Update Route
router.put('/listings/:id', async(req,res)=>{
  const {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//Delete route
router.delete('/listings/:id',async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
});

module.exports = router;