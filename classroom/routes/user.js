app.get('/users', (req,res)=>{
  res.send('Users Page it is');
});

app.get('/users/:id', (req,res)=>{
  res.send('Show Page of users');
});

app.post('/users', (req,res)=>{
  res.send('Create User');
});
app.delete('/users/:id', (req,res)=>{
  res.send('delete User');
});