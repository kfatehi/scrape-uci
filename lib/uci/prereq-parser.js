var _ = require('lodash');
module.exports.parse = function(str) {
  var str = stripMinGrade(str);
  var str = stripMinScore(str);
  var ast = build(str);
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

function build(str) {
  var paren = /\(([A-Z|0-9|\s{1}|\&{1}]+)\)/g
  var top = _.compact(str.split(paren))
  var parts = _.map(top, function(sub) {
    return sub.trim()
  })
  if (parts.length > 2) {
    return parts
  } else {
    return _.map(parts, function(part) {
      return _.map(part.split(/OR|AND/), function(unit) {
        return unit.trim().replace(/\s+/g,' ');
      })
    })
  }
}

function Element(ast) {
  var self = this;
  this.type = 'exactly'
  this.aggregateBy = null
  this.elements = []
  this.select = 1;
  if (_.isArray(ast)) {
    _.each(ast, function(str) {
      if (str === 'AND') { self.select++; }
      else if (str === 'OR') {}
      else {
        self.elements.push(new Element(str));
      }
    })
  } else if (_.isString(ast)) {
    this.elements = _.flatten(build(ast))
  }
}
