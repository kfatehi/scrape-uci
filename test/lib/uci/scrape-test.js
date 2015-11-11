require('sepia'); // record and replay http requests
var expect = require('chai').expect
var scrapeUCI = require('../../../lib/uci/scrape')

describe('uci scraper', function() {
  it('gets courses of a single department if one is specified', function(done) {
    this.timeout(5000);
    scrapeUCI({
      year:'2016',
      period:'Winter',
      dept:'IN4MATX'
    }, function(err, courses) {
      if (err) return done(err);
      expect(err).to.be.a('null');
      expect(courses).to.have.length(22);
      var course = courses[0];
      expect(course.id).to.eq('In4matx113')
      expect(course.prerequisite).to.match(/IN4MATX\s+43/)
      done();
    })
  });

  it('gets courses of all departments if none specified', function(done) {
    this.timeout(10000);
    scrapeUCI({
      year:'2016',
      period:'Winter',
    }, function(err, courses) {
      if (err) return done(err);
      expect(err).to.be.a('null');
      expect(courses).to.have.length(3299);
      done();
    })
  });
})
