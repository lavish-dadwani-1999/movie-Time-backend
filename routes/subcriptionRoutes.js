const { Router } = require('express');
const Auth = require('../middleware/auth');
const Razorpay = require('razorpay');
const Subcription = require('../models/Subcription');
const Payement = require('../models/PayementSchema');
const User = require('../models/User');
const router = Router();
const { RAZORPAY_Key_Id, RAZORPAY_Key_Secret } = process.env;
const razorpay = new Razorpay({
  key_id: RAZORPAY_Key_Id,
  key_secret: RAZORPAY_Key_Secret,
});

router.get("/user/userSubcription" , Auth, async (req,res)=>{
  try{
    const user = req.user
    const subcription = await  Subcription.findOne({userId:user._id})
    if(!subcription) return res.status(400).send({message:"subcription not found"})
    else return res.status(200).json(subcription)
  }catch(err){
    res.send(err);
    console.log(err);
  }
})

router.post('/user/subcription', Auth, async (req, res) => {
  try {
    const user = req.user;
    const { type, prize } = req.body;
    const options = {
      amount: (prize * 100).toString(),
      currency: 'INR',
      receipt: Date.now(),
      payment_capture: 1,
    };

    const responce = await razorpay.orders.create(options);
    console.log(responce, 'res');
    if (responce) {
      var obj = {
        userId: user._id,
        orderId: responce.id,
        plan: type,
        currency: responce.currency,
        razorpayPaymentId: null,
        razorpaySignature: null,
      };
      const payment = await Payement.create(obj);
      res.json(payment);
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

router.post('/user/paymentSuccess', Auth, async (req, res) => {
  try {
    const user = req.user;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body.response1;
    console.log(req.body, 'runpay');
    const payment = await Payement.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },{new:true}
    )
    if(payment){

        let obj = {
            userId:user._id,
            subcribeToken:null,
            subceibePlan:payment.plan,
            planStart:new Date(),
            planEnd:payment.plan === "MONTHLY" ? new Date(Date.now() + 2678400000) : new Date(Date.now() + 31536000000),
        }
        let days = null
        if(payment.plan === "MONTHLY"){
          days = "30d"
        }else {days = "365d"}
        const subcription = await Subcription.create(obj)
        console.log(subcription)
        await subcription.save()
        const user1 = await User.findOne({_id:user._id})
      
        const token = user.subcriptionToken(days)
    res.status(200).send({ message: 'payment done successfuly ', status: 200 });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
