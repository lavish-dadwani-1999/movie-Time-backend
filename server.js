const app = require("./app")
var dotenv = require("dotenv")
dotenv.config()

app.listen(3000,()=>{
    console.log("server start")
})