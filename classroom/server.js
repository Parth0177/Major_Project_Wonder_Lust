const express = require('express');
const app = express();
const users= require('./routes/user.js')
const posts= require('./routes/post.js')

app.get('/getcookies', (req,res)=>{
  res.cookie("greet", "Hello");
  res.cookie("greet", "namaste")
  res.send("Send some cookies...");
});


app.get('/', (req,res)=>{
  res.send('Hello World');
});

app.use('/users ', users);
app.use('/posts ', posts);







app.listen(3000, ()=>{
  console.log('Server is runnung on 3000')
});