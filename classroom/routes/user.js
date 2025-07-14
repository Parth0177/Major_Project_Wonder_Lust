const express = require('express');
const router = express.Router();


router.get('/', (req,res)=>{
  res.send('Users Page it is');
});

router.get('/:id', (req,res)=>{
  res.send('Show Page of users');
});

router.post('/', (req,res)=>{
  res.send('Create User');
});
router.delete('/:id', (req,res)=>{
  res.send('delete User');
});

module.exports = router;