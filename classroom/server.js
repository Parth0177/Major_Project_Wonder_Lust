const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: "MySuperSecretString",
  resave: false , 
  saveUninitialized: true,
}));
app.use(flash())

app.get('/register',(req,res)=>{
  let {name = "Gajodhar"} = req.query;
  req.session.name = name;
  req.flash('success', `Welcome ${name}!`);
  res.redirect('/hello');
});

app.get('/hello', (req,res)=>{
  res.render('page.ejs',{name:req.session.name, messages: req.flash('success')})
});


/*app.get('/reqcount' , (req,res)=>{
  if( req.session.count) {
    req.session.count++;
  }else{
    req.session.count = 1;
  }
  res.send(`You Sent a Request ${req.session.count} times`);
});
*/

/*app.get('/test', (req, res) => {
  res.send('test route is workingggg'); 
});*/




app.listen(3000, () => {
  console.log('Server is running on 3000');
});
