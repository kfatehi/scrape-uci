var scrapeUCI = require('./lib/uci/scrape');

if (module.parent) {
  module.exports = scrapeUCI
} else {
  var args = require('minimist')(process.argv)
  scrapeUCI({
    year: args.y || args.year,
    period: args.p || args.period,
    dept: args.d || args.dept
  }, function(err, courses) {
    if (err) throw err;
    else console.log(courses);
  });
}
