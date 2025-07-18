const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const session = require('express-session');

app.use(session({
  secret: "MySuperSecretString", resave: false
}));

app.get('reqcount' , (req,res)=>{
  res.send(`You Sent a Request x times`);
});


/*app.get('/test', (req, res) => {
  res.send('test route is workingggg'); 
});*/




app.listen(3000, () => {
  console.log('Server is running on 3000');
});
