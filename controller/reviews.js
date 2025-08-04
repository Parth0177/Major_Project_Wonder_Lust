const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReviews = async (req,res)=>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author to the currently logged-in user

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'Review added successfully!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted successfully!');
  res.redirect(`/listings/${id}`);
}