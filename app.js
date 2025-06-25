const express= require('express');
const app= express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');

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

app.get('/testListing', async(req,res)=>{  
    let listing = new Listing({
    title: 'Beautiful Beach House',
    description: 'A lovely beach house with stunning views.',
    images: '',
    price: 5250,
    location: 'Malibu, CA',
    country: 'USA'
  });

  await listing.save()
    .then(() => res.send('Listing created successfully'))
    .catch(err => res.status(500).send('Error creating listing: ' + err.message));
})

app.listen(8080,()=>{
  console.log('Server is running on PORT 8080');
});