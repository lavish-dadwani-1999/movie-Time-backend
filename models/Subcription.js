const { sign } = require("jsonwebtoken");
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SubcriptionSchema = new Schema({
    userId:{type:String},
    subceibePlan:{type:String},
    planStart:{type:Date},
    planEnd:{type:Date}
},{timestamps:true})


SubcriptionSchema.methods.subcriptionToken = async function () {
    try {
      const user = this;
      const SecretKey = `${new Date(user.createdAt).getTime()}`;
      const token1 = await sign({ id: user._id }, SecretKey, { expiresIn: '1d' });
      user.token = token1;
      await user.save();
      return token1;
    } catch (err) {
      console.log(err);
    }
  };

const Subcription = mongoose.model("subcription",SubcriptionSchema)

module.exports = Subcription