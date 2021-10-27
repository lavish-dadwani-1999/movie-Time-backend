const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    userId: { type: String },
    orderId: { type: String },
    plan:{type:String},
    currency:{type:String},
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

const payments = mongoose.model('payments', paymentSchema);
module.exports = payments;
