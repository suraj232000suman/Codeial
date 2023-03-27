// Require express
const express = require('express');
//require cookie-parser
const cookieParser = require('cookie-parser');

const app = express();

const port = 8000;

const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oath2-strategy');
const MongoStore = require('connect-mongo')(session);

const flash=require('connect-flash');
const customMware=require('./config/middleware');

app.use(express.urlencoded());
//telling app to use cookie parser in the middle ware
app.use(cookieParser());
// requireing express layouts
const expressLayouts = require('express-ejs-layouts');

//telling our app to use layout
app.use(expressLayouts);
//extract styles and script from sub pages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//app.use('/',require('./routes/index.js'));

app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name : 'codeial',
    //todo change the secret before deployment in production mode
    secret : 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge : (1000*60*100)
    },
    store : new MongoStore(
        {
            mongooseConnection : db,
            autoRemove : 'disabled'
        },
        function(err){
            console.log( err || 'connect-mongodb setup ok'); 
        }
    )      
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes'));
//telling in which folder our app should look out for static file
app.use(express.static('./assets'));
//make the upload path availaible to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the Server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});

