const express = require('express');
const session = require('express-session');
const ObjectId= require('mongoose').Types.ObjectId
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const User = require("./userModel");

let db;
const app = express();
const PORT = process.env.PORT || 3000;
//const User = require("./models/userModel");

const usersRouter = require('./routers/users-router');
const ordersRouter= require('./routers/orders-router');
const registerRouter= require('./routers/register-router');








//setting session store
let store = new MongoDBStore({
    uri: "mongodb://localhost/a4",
    collection: 'sessions'
});
store.on("error",(error)=>{console.log(error)});

/****************************************************************************************************
set up middleware
****************************************************************************************************/
app.set(path.join(__dirname, 'views'));//set views folder
app.set("view engine","pug");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    name:'a4-session',
    secret: "some secret here",
    store:store,
    cookie:{maxAge:1800000},
    //to remove warnings
    resave:true,
    saveUninitialized: false
}));

//console log recieved requests
app.use(function(req,res,next){
    console.log(`${req.method} for ${req.url}`);
    next();
});



/****************************************************************************************************
server routes
****************************************************************************************************/
app.get("/", (req, res)=> { res.render("pages/index",{session:req.session}); });
app.use('/users', usersRouter);
app.use('/orders', ordersRouter)
app.use("/register",registerRouter);
app.post('/login', login);
app.get("/logout", logout);


function login(req, res, next){
	if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}
  
	let username = req.body.username;
	let password = req.body.password;



  User.find({username: req.body.username,password: req.body.password}, function(err, results){
    if(results.length==0){
			res.status(401).send("Unauthorized");
			console.log(err);
			return;
		}

    req.session.loggedin = true;


    //We set the username associated with this session
    //On future requests, we KNOW who the user is
    //We can look up their information specifically
    //We can authorize based on who they are
    req.session.username = username;
    req.session.userid=results[0]._id;
    res.status(200).render("pages/index",{session:req.session});

	});	
}

function logout(req, res, next){
	if(req.session.loggedin){
		req.session.loggedin = false;
    req.session.username = undefined;
    req.session.userid= undefined;
		res.status(200).redirect("/");
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}





//connecting to database
mongoose.connect(`mongodb://localhost/a4`,{useNewUrlParser:true,useUnifiedTopology:true});

db = mongoose.connection;
db.on("error",console.error.bind(console,"Error connecting to database"));
db.once('open', function(){
    app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
})
