const nodeMailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config({path:".env"})
const {GOOGLE_PASS,GOOGLE_USERNAME} = process.env
const transportOptions = {

    host: "smtp.gmail.com",
    port:465,
    secure:true,
    debug:true,
    auth:{
        user:GOOGLE_USERNAME,
        pass:GOOGLE_PASS,
    }
}

const mailTransport = nodeMailer.createTransport(transportOptions)

const sendMailToUser = async (email,subject,html)=>{
    try{
        console.log(GOOGLE_PASS,GOOGLE_USERNAME)
      const status =  await mailTransport.sendMail({
            from:GOOGLE_USERNAME,
            to:email,
            subject:subject,
        
            html:html
        })
        console.log(status)
    }catch(err){
        console.log(err)
    }
}
// sendMailToUser("lavishdadwanii@gmail.com","confirm Email", "token")
module.exports = sendMailToUser