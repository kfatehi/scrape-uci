require('sepia'); // record and replay http requests
var expect = require('chai').expect
var scrapeUCI = require('../../../lib/uci/scrape')

describe('uci scraper', function() {
  describe("source: websoc", function() {
    it('gets courses of a single department if one is specified', function(done) {
      this.timeout(5000);
      scrapeUCI({
        source: 'websoc',
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
        source: 'websoc',
        year:'2016',
        period:'Winter',
      }, function(err, courses) {
        if (err) return done(err);
        expect(err).to.be.a('null');
        expect(courses).to.have.length(3299);
        done();
      })
    });
  });

  describe.only("source: ics", function() {
    it('works', function(done) {
      this.timeout(5000);
      scrapeUCI({
        source: 'ics',
        year:'2016',
        dept:'INF',
        period:'spring',
      }, function(err, courses) {
        if (err) return done(err);
        expect(courses).to.have.length(16);
        var course = courses[1];
        expect(course.title).to.eq('INF 117')
        expect(course.description).to.match(/testing/)
        expect(course.instructor).to.eq('Hadar Ziv')
        done();
      })
    });
  });
})
