var DataUri = require('datauri/parser');
var path = require("path");

var dataURIChild = new DataUri();

module.exports = function(originalName, buffer) {
  var extension = path.extname(originalName);
  return dataURIChild.format(extension, buffer).content;
};
