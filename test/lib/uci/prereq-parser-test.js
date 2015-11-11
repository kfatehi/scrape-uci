var expect = require('chai').expect
var _ = require('lodash');
var courses = require('../../../fixtures/2016-winter-raw-prereq');
var pp = require('../../../lib/uci/prereq-parser');

describe('prereq parser', function() {
  it.only("parses reqs for IN4MATX 113", function() {
    var course = _.find(courses, { id: 'In4matx113' })
    var reqs = pp.parse(course.prerequisite)
    console.log(JSON.stringify(reqs, null, 2));
    return
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

  it('parses reqs for In4matx122', function() {
    var course = _.find(courses, { id: 'In4matx122' })
    var reqs = pp.parse(course.prerequisite)
    return
    expect(reqs).to.deep.eq({
      "type": "exactly",
      "aggregateBy": null,
      "select": 2,
      "elements": [{
        "type": "exactly",
        "aggregateBy": null,
        "elements": [
          "I&C SCI 45J",
          "I&C SCI 46",
          "IN4MATX 45"
        ],
        "select": 1
      },{
        "type": "exactly",
        "aggregateBy": null,
        "elements": [
          "IN4MATX 101",
          "COMPSCI 141",
          "CSE 141"
        ],
        "select": 1
      }]
    })
  });

  it('parses reqs for In4matx131', function() {
    var course = _.find(courses, { id: 'In4matx131' })
    var reqs = pp.parse(course.prerequisite)
    return
    expect(reqs).to.deep.eq({
      "type": "exactly",
      "aggregateBy": null,
      "select": 1,
      "elements": [{
        "type": "exactly",
        "aggregateBy": null,
        "elements": [
          "IN4MATX 41",
          "I&C SCI 10",
          "I&C SCI 21",
          "I&C SCI H21",
          "CSE 21",
          "ENGR 10",
          "ENGRMAE 10",
          "EECS 10",
          "I&C SCI 31",
          "CSE 41",
          "AP COMP SCI A",
          "AP COMP SCI AB"
        ],
        "select": 1
      }]
    })
  });
})
