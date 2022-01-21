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

router.get('/', displayMenu);
router.post('/',saveOrder);

router.get("/:orderID", sendSingleOrder);

function displayMenu(req, res, next){
    if(!req.session.loggedin){
        res.status(403).send("you must login to view order form");
        return;
    }
    res.status(200).render(".././public/orderform",{session:req.session});
}

function saveOrder(req, res, next){
    let orderID=Date.now();
    req.body.orderID=orderID;
    User.findOneAndUpdate({username:req.session.username}, {$push:{orders:{[orderID]:req.body}}}, function(err, result){
		if(err){
			console.log(err);
		}
		if(!result){
			res.status(403).send("must be logged in as user to edit profile");
			return;
		}
		

	});
    res.status(200).render(".././public/orderform",{session:req.session});
}

router.param("orderID", function(req, res, next, value){
    let query=`orders.${value}.orderID`
    User.findOne({[query]:parseInt(value)}, function(err,found){
        if(err) {
            console.log(err);
        }
        if(found){
            req.user = found;
            req.orderID=value;
            next();
            

        } else {

            res.status(400).send("No order exists with that ID")

        }
    })



});
function sendSingleOrder(req,res,next){
    if(req.user.privacy && req.session.username!=req.user.username){
        res.status(403).send("cannot view order history of private profiles");
        return;
    }
    req.user.orders.forEach(order => {
        for (key in order) {
            if(key==req.orderID){
                let singleOrder=(order[key]);
                
                res.status(200).render("pages/orderSummary",{session:req.session,order:singleOrder,orderItems:singleOrder.order,user:req.user}); 
            }
        }
    });
}
module.exports=router;