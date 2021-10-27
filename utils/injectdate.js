var path = require("path")

function injectDate (fileName){
    var extnaem = path.extname(fileName)  // extname gives you the extenction name as .jpeg
    var newfile = fileName.replace(extnaem,"") +"-" +Date.now() + extnaem
    return newfile                          
}                                              // rename the file name and inject  Date  in bettween

module.exports = injectDate