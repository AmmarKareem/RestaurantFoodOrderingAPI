const User = require(".././userModel");
const ObjectId= require('mongoose').Types.ObjectId
const express = require('express');
const fs = require('fs');
const { send, nextTick } = require('process');
const router = express.Router();
const app = express();
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);



router.get('/', loadUsers);
router.get("/", respondUsers);

router.get("/:userID", sendSingleUser);

router.post("/togglePrivacy", togglePrivacy);



function loadUsers(req, res, next){
	let nameQuery = req.query;
	if(Object.keys(nameQuery).length != 0){
		let onlyNameQuery = nameQuery["name"];
		const regex = new RegExp(onlyNameQuery, 'i') 
		
		User.find({username: {$regex: regex}}).exec(function(err, results){
        
			if(err){
				res.status(500).send("Error reading users.");
				console.log(err);
				return;
			}
			res.users = results;
			
			next();
			return;
		});
	}else{
		User.find().exec(function(err, results){
			if(err){
				res.status(500).send("Error reading users.");
				console.log(err);
				return;
			}
			res.users = results;
			
			next();
			return;
		});
	}
}

//Users the res.users property to send a response
//Sends either HTML or JSON, depending on Accepts header
function respondUsers(req, res, next){
	res.format({
		"text/html": () => {res.render(".././views/pages/users", {users: res.users,session:req.session} )},
		"application/json": () => {res.status(200).json(res.users)}
	});
	next();
}

router.param("userID", function(req, res, next, value){
	let oid;
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("User ID " + value + " does not exist.");
		return;
	}

	User.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID " + value + " does not exist.");
			return;
		}
		
		req.user = result;
		next();

	});
});

function sendSingleUser(req, res, next){
	if(!req.user.privacy && req.session.username!=req.user.username){
		//current user is requesting somebody else public profile
		req.session.current=false;
		res.format({
			"application/json": function(){
				res.status(200).json(req.user);
			},
			"text/html": () => { res.render(".././views/pages/user", {user: req.user,session:req.session}); }
		});
		
		return;
	}
	if((req.user.privacy && req.session.username==req.user.username) || (!req.user.privacy && req.session.username==req.user.username)){
		//current user that is logged in is requesting own profile
		req.session.current=true;
		res.format({
			"application/json": function(){
				res.status(200).json(req.user);
			},
			"text/html": () => { res.render(".././views/pages/user", {user: req.user,session:req.session}); }
		});
		
		return;
	}
	else{
		res.status(403).send("Cannot view private profile")
	}
}

function togglePrivacy(req, res, next){
	User.findOneAndUpdate({username:req.session.username}, {privacy:req.body.modeSelection}, function(err, result){
		if(err){
			console.log(err);
		}
		if(!result){
			res.status(403).send("must be logged in as user to edit profile");
			return;
		}
		res.send("privacy settings changed");
		

	});
}






module.exports=router;