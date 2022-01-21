const User = require("../userModel");
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

router.get('/', displayRegister);
router.post('/',registerUser)

function displayRegister(req, res, next){
    if (req.session.loggedin){
        res.status(400).send("You must logout to register new user");
        return;
    }
    res.status(200).render("pages/register",{session:req.session}); 
}

function registerUser(req,res,next){
    
    User.findOne({username:req.body.username}, function(err,found){
        if(err) {
            console.log(err);
        }
        if(found){
            req.session.registerError=true;
            res.status(403).render("pages/register",{session:req.session});
            return;
        } else {

            req.session.registerError=false;
            User.create({username: req.body.username, password: req.body.password,privacy:false,orders:[{0:"temp"}]}, function(err, newInstance){
                if(err) {
                    console.log(err);
                }

                res.status(200).render("pages/user",{user: newInstance,session:req.session});
                
                return;
            });

        }
    })
    
    






}


module.exports=router;