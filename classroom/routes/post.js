const express = require('express');
const router = express.Router();

router.get('/posts', (req,res)=>{
  res.send('Post Page it is');
});

router.get('/posts/:id', (req,res)=>{
  res.send('Show Page of posts');
});

router.post('/posts', (req,res)=>{
  res.send('Create Post');
});

router.delete('/posts/:id', (req,res)=>{
  res.send('delete Post');
});