// Require express
const express = require('express');
const app = express();

const port = 8000;
// requireing express layouts
const expressLayouts = require('express-ejs-layouts');

//telling our app to use layout
app.use(expressLayouts);
//extract styles and script from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use('/',require('./routes/index.js'));

app.set('view engine','ejs');
app.set('views','./views');

//telling in which folder our app should look out for static file
app.use(express.static('./assets'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
