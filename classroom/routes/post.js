const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
  res.send('Post Page it is');
});

router.get('/:id', (req,res)=>{
  res.send('Show Page of posts');
});

router.post('/', (req,res)=>{
  res.send('Create Post');
});

router.delete('/:id', (req,res)=>{
  res.send('delete Post');
});

module.exports = router;