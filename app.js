const express= require('express');
const app= express();
const mongoose = require('mongoose');

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

app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});