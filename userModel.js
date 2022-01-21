const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Users have a first and last name
let userSchema = mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    privacy: {type: Boolean, required: true},
    orders:{type: Schema.Types.Mixed, required:true}

  });
  
  //Compile the previously defined schema into a model
  //The model is what we will use to work with user documents
  //First parameter is a string representing collection name 
  // that will be used for this model
  //Second parameter is the schema
  let UserModel = mongoose.model('User', userSchema);
  
  //Once we have a model, we can create new instances/documents
  //Note: we could be handling this in a POST request handler
//   let gary = new UserModel({firstName: "Gary", lastName: "Oldman"});
//   let jackie = new UserModel({firstName: "Jackie", lastName: "Chan"});

module.exports = mongoose.model("User", userSchema);