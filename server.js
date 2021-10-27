const app = require("./app")
var dotenv = require("dotenv")
dotenv.config()

app.listen(process.env.PORT || 3000,()=>{
    console.log("server start")
})