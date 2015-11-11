require('sepia'); // record and replay http requests
var expect = require('chai').expect
var scrapeUCI = require('../../../lib/uci/scrape')

describe('uci scraper', function() {
  it('works', function(done) {
    this.timeout(5000);
    scrapeUCI('2016', 'Winter', 'IN4MATX', function(err, data) {
      if (err) return done(err);
      expect(err).to.be.a('null');
      var course = data[0];
      expect(course.id).to.eq('In4matx113')
      console.log(course);
      expect(course.prerequisite).to.match(/IN4MATX\s+43/)
      done();
    })
  });
})
