const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const session = require('express-session');

app.use(session({
  secret: "MySuperSecretString",
  resave: false , 
  saveUninitialized: true,
}));

app.get('/register',(req,res)=>{
  let {name = "Gajodhar"} = req.query;
  req.session.name = name;
  console.log(req.session.name)
  res.send(`Welcome ${name} to the registration page`);
});

app.get('/hello', (req,res)=>{
  res.send(`Hello ${req.session.name || "Guest"}!`);
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
