var scrapeUCI = require('./lib/uci/scrape');

if (module.parent) {
  module.exports = scrapeUCI
} else {
  var args = require('minimist')(process.argv)
  scrapeUCI(args, function(err, courses) {
    if (err) throw err;
    else {
      var json = JSON.stringify(courses, null, 4);
      process.stdout.write(json+'\n');
      process.exit(0);
    }
  });
}
