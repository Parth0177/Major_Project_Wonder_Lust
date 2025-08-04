const Listing = require('../models/listing');

module.exports.index = async(req,res)=>{
  const allListings=  await Listing.find({});
  res.render('Listings.ejs', {allListings});
};

module.exports.new = (req,res)=>{
  res.render('new.ejs');
};

module.exports.show = async(req,res)=>{
  const {id}= req.params;
  const listing = await Listing.findById(id).populate({
  path: 'reviews',
  populate:{
    path:'author',
  },
  })
  .populate('owner');
  if(!listing){
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  } 
  res.render('show.ejs', {listing});
};

module.exports.create = async(req,res , next)=>{
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
    country,
    owner: req.user._id // Set the owner to the currently logged-in user
  });
  await listing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
  }catch(err){
  next(err)
  }
};

module.exports.edit = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash('error', 'Listing not found');
    res.redirect('/listings');
  }
    res.render('edit.ejs',{listing});
};

module.exports.update =  async(req,res)=>{
  const {id}= req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};

