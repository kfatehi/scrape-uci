var scrapeUCI = require('./lib/uci/scrape');
var args = require('minimist')(process.argv)

var period = args.p || args.period
var year = args.y || args.year
var dept = args.d || args.dept

scrapeUCI(year, period, 'IN4MATX', function(err, courses) {
  if (err) throw err;
  else console.log(courses);
});
