var expect = require('chai').expect
var _ = require('lodash');
var courses = require('../../../fixtures/2016-winter-raw-prereq');
var pp = require('../../../lib/uci/prereq-parser');

describe('prereq parser', function() {
  it.only("parses reqs for IN4MATX 113", function() {
    var course = _.find(courses, { id: 'In4matx113' })
    var reqs = pp.parse(course.prerequisite)
    expect(reqs).to.deep.eq({
      "type": "exactly",
      "aggregateBy": null,
      "select": 2,
      "elements": [{
        "type": "exactly",
        "aggregateBy": null,
        "elements": [
          "IN4MATX 42",
          "I&C SCI 22",
          "CSE 22",
          "AP COMP SCI AB",
          "I&C SCI 33",
          "CSE 43"
        ],
        "select": 1
      },{
        "type": "exactly",
        "aggregateBy": null,
        "elements": [
          "IN4MATX 43",
          "I&C SCI 52"
        ],
        "select": 1
      }]
    })
  })
})
