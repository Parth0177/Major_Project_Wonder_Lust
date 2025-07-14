const express = require('express');
const app = express();

app.get('/', (req,res)=>{
  res.send('Hello World');
});

app.get('/users', (req,res)=>{
  res.send('Users Page it is');
});

app.get('/users/:id', (req,res)=>{
  res.send('Show Page');
});

app.post('/users', (req,res)=>{
  res.send('Create User');
});
app.delete('/users/:id', (req,res)=>{
  res.send('delete User');
});

app.listen(3000, ()=>{
  console.log('Server is runnung on 3000')
});