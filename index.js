// Require express
const express = require('express');
const app = express();

const port = 8000;

app.use('/',require('./routes/index.js'));

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
