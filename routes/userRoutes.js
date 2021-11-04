const { hash, compare } = require('bcrypt');
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Auth = require('../middleware/auth');
const User = require("../models/User");
const WatchList = require("../models/WatchList")
const passport = require("passport")
const sendMailToUser = require('../utils/nodeMailer');
const dotenv = require("dotenv")
const imageBuffer = require("../utils/configBuffer")
const router = Router();
dotenv.config()
const upload = require("../utils/multer")
const cloudinary = require("../utils/cloudinary")
router.post(
  '/user/register',

  [check('name').not().isEmpty().trim().escape().isLength({min:5}).withMessage("Name must have more than 5 characters"),
   check("email").not().isEmpty().isEmail().withMessage("Enter A Valid Email"),
   check("password").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password")
],
  async (req, res) => {
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
      let err = errors.array()
      return res.status(422).json({message:err[0].msg})}
    try {
      const { email, password, name  } = req.body;
      if (!name || !email || !password)return res.send('Enter All Fields');

     const user = await  User.findByEmail(email)
     if(user)return res.status(404).send({message:"User already there"})
     const user1 = new User({...req.body})
     const token = await user1.genrateToken()
     console.log(token)
     let html = `
     <h1>Welcome To Star App</h1>
     <p>Thanks For Creating An Account.  Click <a href="https://movie2time.herokuapp.com/user/verifyEmail/${token}">here</a> To Confirm Your Account.</p>
     <p> or copy paste this link https://movie2time.herokuapp.com/user/verifyEmail/${token}</p>
     `
     sendMailToUser(user1.email,"Confirm Email",html)
    //  const watchList = new WatchList({userId:user1._id})
    //  await watchList.save()
     res.status(201).json({user:user1})

    } catch (err) {
      console.log(err)
      if (err.name === 'ValidationError') {
        return res.status(400).json({Validation_Error: err.message});
      }
      res.status(500).json({message:"server error2",status:500})
      
    }
  }
);
// .matches(/\d/)d 


router.post("/user/login", async (req,res)=>{
  try{
    const {email , password} = req.body
    if(!email || !password)return res.status(404).send({message:"enter a valid Input",status:404})
    const user = await User.findByEmailAndPassword(email,password)
    if(!user) return res.send({message:"user Not Found"})
    const token = await user.genrateToken()
    res.status(201).json({user:user})
  }catch(err){
    if(err.message === "user not found") return res.status(404).send({message:err.message}) 
    if(err.message === "type Valid Password") return res.status(404).send({message:err.message}) 
    res.status(500).send(err.message)
    console.log(err)
  }
})


// login user can change the password 
router.patch("/user/changePassword",Auth,
[check("newpassword").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password"),
check("oldpassword").not().isEmpty().isLength({min:8}).withMessage("Enter a Valid Password")
]
, async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let err = errors.array()
      return res.status(422).json(err[0].msg)}
    const user = req.user
    const {newpassword , oldpassword} = req.body
    if(!newpassword || !oldpassword) return res.status(404).send({message:"invalid credentials"})
    const check = await compare(oldpassword,user.password)
    console.log(check)
    if(!check) return res.status(404).send({message:"this is not your old password"})
    const hashPassword = await hash(newpassword,10)
    const changePassword = await User.updateOne({token:user.token},{password:hashPassword},{new:true})
    res.status(200).send({message:" Password updated",changePassword})
  }catch(err){
    console.log(err)
    res.status(500).send({message:"server Error"})
  }
})

router.patch("/user/update",upload.single("fileUpload"),Auth, async (req,res)=>{
  try{
    console.log(req.file)
    var imagecontent = imageBuffer(req.file.originalname, req.file.buffer);  // converting the buffer into string
    const responce = await  cloudeInary.uploader.upload(imagecontent)   // cloudinery is used to upload fil
    // res.redirect(responce.secure_url)
    const user = req.user
    const {firstName,lastName} =req.body
    if(!firstName || !lastName) return res.status(404).send({message:"invalid Credentials",status:404})
    const updateUser = await User.updateOne({token:user.token},{photo:responce.secure_url},{new:true})
    res.status(201).json({user:user})
  }catch(err){
    if (err.name === 'ValidationError') {
      return res.status(400).json({Validation_Error: err.message});
    }
    console.log(err)
   if(err)res.status(500).json({message:"server error2",status:500})
  }
})

//-----------------------------Email verification Link---------------

router.post("/user/emailVerification/:email/:token", async (req,res)=>{
  try{
    console.log("run")
    const email = req.params.email
    const token = req.params.token
    const user = await User.findOne({ email:email})
    // console.log(user)
    if(!user)return res.status(404).send({message:"Email Required"})
    let html = `<h1>Welcome To Star App</h1>
    <p>Thanks For Creating An Account.  Click <a href="https://movie2time.herokuapp.com/user/verifyEmail/${token}">here</a> To Confirm Your Account.</p>
    <p> or copy paste this link https://movie2time.herokuapp.com/user/verifyEmail/${token}</p>
   `
    sendMailToUser(user.email,"Confirm Email",html)
   res.status(200).send({message:`Email verification link Has been sent to ${user.email} `})
  }catch(err){
    res.status(500).send("server error")
    console.log(err)
  }
})
// --------------------------verify Email-------------------------------------------
router.get("/user/verifyEmail/:token", async (req,res)=>{
  try{
    const token = req.params.token
    const user = User.findUserByToken(token)
    res.render("index",{name:user.name})
  }catch(err){
    console.log(err)
    if(err.name === "Ststic Error") res.status(500).send(err.message)
    res.status(500).send("server error")

  }
})



router.delete("/user/logout",Auth ,async (req,res)=>{
  try{
    const user = req.user
    user.token = null
    await user.save()
    res.status(201).send({message:"User Logout",status:201})
  }catch(err){
    res.status(500).send({message:"server error"})
  }
})

// app.get('/auth/facebook',
//   passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.send("facebook");
//   });

// router.post("/fasebook" )



router.get("/auth/google",passport.authenticate("google",{scope:["email","profile"]}))

router.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"/user/googleLogin",
    failureRedirect:"/"
}))

function LoggedIn  (req,res,next){
req.user ? next() : res.status(401).send({message:"google error"})
}

router.post("/user/googleLogin",  async (req,res)=>{
    try{
      const googleUser =  req.body.responce
      console.log(googleUser)
      const user = await User.findOne({ googleId:googleUser.googleId})
      console.log(user,"user")
      if(user){
        const token1 = await user.genrateToken()
         return res.status(201).json({user:user})
      
      }else{
        const currentUser = {
          name:`${googleUser.profileObj.name} `,
          email:googleUser.profileObj.email,
          photo:googleUser.profileObj.imageUrl,
          isThirdParty:true,
          password:"null",
          googleId:googleUser.googleId,
          isConfirmed:true
        }
        const user1 = new User({...currentUser})
        const token = await user1.genrateToken()
        // const watchList = new WatchList({userId:user1._id})
        // await watchList.save()
        res.status(201).json({user:user1})
      }
    }catch(err){
      console.log(err)
      res.status(500).send({message:"google Error 1"})
    }
})




router.get('/auth/facebook',
  passport.authenticate('facebook',{ scope: ['email']})
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/user/facebookLogin',failureRedirect: '/' }));

router.get("/user/facebookLogin",async (req,res)=>{
  try{
    const facebookUser = await req.user
    console.log(facebookUser)
    res.json(facebookUser)
    // const user = await User.find({ facebookId:facebookUser.id})
    // console.log(user,"user")
    // if(user.length>0){
    //   const token1 = await user[0].genrateToken()
    //   res.status(201).json({user:user[0],token1})
    
    // }else{
    //   const currentUser = {
    //     name:facebookUser.displayName,
    //     email:facebookUser.emails[0].value,
    //     photo:facebookUser.photos[0].value,
    //     isThirdParty:true,
    //     password:"null",
    //     googleId:facebookUser.id,
    //     isConfirmed:facebookUser.email_verified ? true : false
    //   }
    //   const user1 = new User({...currentUser})
    //   const token = await user1.genrateToken()
    // const watchList = new WatchList({userId:user1._id})
    // await watchList.save()
    //   res.status(201).json({user:user1,token})
  }catch(err){
    res.status(500).send({  message:"Facebook error 1"})
  }
})


router.post("/forgotPasswordByEmail/:email", async (req,res)=>{
  try{
    const email = req.params.email
    const user = await User.findByEmail(email)
    if(!user) return res.status(404).send({message:"email not found"})
    const token = await user.genratePasswordToken()
    let html = ` <div style="display: flex; justify-content: center;
    align-items: center; flex-direction: column;
     font-family: monospace; background-color: #252939; color: #fff;
     " >
        <h1>Movie Times </h1>
        <div style="font-size: 20px;">
            <p>Hello ${user.name} a password reset link is genrated from your account Click <a href="https://movie2time.netlify.app/passwordforgotchange/${token}">here</a> to reset your password</p>
            <p>If this is not you than plese ignore this Email and donot share this Email</p>
        </div>
    </div>`
    sendMailToUser(user.email,"password Reset",html)
    console.log(email)
    res.status(200).json({message:"got email"})
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

router.get("/userByToken/:token", async (req,res)=>{
  try{
    const token = req.params.token
    const user = await User.findOne({token:token })
    if(!user) return res.status(404).send({message:"cannot get user"})
    res.status(201).json({user:user})
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

router.get("/user/get/:token", async(req,res)=>{
  try{
    const token = req.params.token
    const user = await User.findOne({passwordToken:token })
    if(!user) return res.status(404).send({message:"cannot get user"})
    res.status(201).json({user:user})
  }catch(err){
    console.log(err)
    res.status(500).send("server error")
  }
})

router.post("/forgotPassword/:token", async (req,res)=>{
  try{
    const body = req.body
    const { newPassword ,cpassword } = req.body
    const token = req.params.token
    if(newPassword != cpassword ) return res.status(404).send({message:" both the password should be same"})
    const user = await  User.findOne({ passwordToken:token})
    if(!user) return res.status(404).send({message:"invalid Crendentials"})
    if(!newPassword) return res.status(404).send("password required")
    else{
      user.password = newPassword
      user.passwordToken =null
      await user.save()
    }
    res.status(201).send({message:"password Updated"})
  }catch(err){
    console.log(err)
  }
})


module.exports = router;
