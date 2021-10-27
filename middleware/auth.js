const User = require("../models/User")

const Auth = async function(req,res,next){
    
   try{
    var authtoken = req.header("Authorization");
    // console.log("auth",authtoken)
    if(authtoken){
      const user = await User.findOne({token:authtoken})
      if(!user)return res.status(402).send("invalid Credentials")
      req.user = user
      next()
    }
   }catch(err){
    console.log(err)
    if(err)res.status(402).send("invalid Credentials")
   }
}

module.exports = Auth