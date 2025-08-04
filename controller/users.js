const Listing = require('../models/listing');
const Review = require('./models/review');
const User = require('./models/user');


module.exports.renderSignupForm =  (req,res)=>{
  res.render('signup.ejs');
};


module.exports.SignUp = async(req,res)=>{
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
};

module.exports.renderLoginForm = (req,res)=>{
  res.render('login.ejs');
};

module.exports.Login = async(req,res,next)=>{
  req.flash('success', 'Welcome back, ' + req.user.username + '!');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/login');
  })
};