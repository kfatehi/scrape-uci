var _ = require('lodash');
module.exports = Element;

function Element(ast) {
  var self = this;
  this.type = 'exactly'
  this.aggregateBy = null
  this.elements = []
  this.select = 1;
  console.log(ast);
  var self = this;
  read(ast, this);
}

function read(ast, self) {
  _.each(ast, function(i) {
    if (_.isArray(i)) {
      read(i, self)
    } else if (_.isString(i)) {
      var refMatch = i.match(/\\(\d)/);
      if (refMatch) {
        var ref = refMatch[1];
      } else {
        console.log(i);
      }
    }
  });
}
