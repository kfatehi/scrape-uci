var parenthesis = require('parenthesis');
var _ = require('lodash');
var Element = require('./element');

module.exports.parse = function(str) {
  var str = stripMinGrade(str);
  var str = stripMinScore(str);
  var ast = _.map(parenthesis.parse(str), function(e) {
    var parts = e.trim().replace(/\s+/g,' ').split(/OR|AND/)
    return _.map(parts, function(part) {
      return part.trim() 
    })
  });
  return new Element(ast);
}

function stripMinGrade(str) {
  var patt = /\(\s+min grade\s=\s\w\s+\)/g
  return str.replace(patt, '');
}

function stripMinScore(str) {
  var patt = /\(\s+min score\s=\s\d\s+\)/g
  return str.replace(patt, '');
}
