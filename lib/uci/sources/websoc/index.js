var inputs = require('./inputs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var titlePattern = /^([A-z|0-9]+)\D+([0-9|A-Z]+)\W+([\w|\s]+)/;
var Promise = require('bluebird')

module.exports = function(opts, cb) {
  if (opts.dept) return scrapeDept(opts, cb);
  else {
    return scrapeDeptList().then(function(depts) {
      return Promise.mapSeries(depts, function(dept) {
        opts.dept = dept
        return Promise.promisify(scrapeDept)(opts);
      })
    }).then(function(deptCourses) {
      cb(null, _.flatten(deptCourses));
    }).catch(function(err) {
      cb(err);
    });
  }
}

function scrapeDeptList() {
  return new Promise(function(resolve, reject) {
    request.get(inputs.socURL(), function(err, resp, body) {
      var $ = cheerio.load(body);
      var options = $('select[name=Dept] option')
      var depts = [];
      options.each(function(i, e) {
        var dept = $(e).val().trim()
        if (dept !== 'ALL')
          depts.push(dept);
      })
      resolve(depts);
    })
  });
}
  
function scrapeDept(opts, cb) {
  Promise.all([
    initSOC(opts.year, opts.period, opts.dept),
    initPreReq(opts.year, opts.period, opts.dept)
  ]).spread(function($, prereq) {
    return $('td.CourseTitle').map(function(i, title) {
      var $el = $(title);
      var course = {}

      // id and name
      var titleText = $el.text().trim();
      var parts = titleText.match(titlePattern);
      var code = parts[2];
      course.id = parts[1]+code;
      course.name = parts[3].trim();

      // prereqs
      if (prereq[code])
        course.prerequisite = prereq[code]

      // units
      var tr = $el.parent()
      // locate the row that has course number, unit, etc
      // we use a while loop because the # of rows til you get there is inconsistent
      // XXX strange markup can lock me up!!
      while (! tr.text().trim().match(/^\d+/)) {
        tr = tr.next();
      }
      // the units are variable on some courses
      // and parseInt picks the lower number
      course.units = parseInt($($(tr).find('td')[3]).text());
      return course;
    }).get();
  }).then(function(results) {
    cb(null, results);
  }).catch(function(err) {
    cb(err);
  });
}


function initSOC(year, period, dept) {
  return new Promise(function(resolve, reject) {
    request.post({
      url: inputs.socURL(),
      form: inputs.form(year, period, dept)
    }, function(err, resp, body) {
      if (err) return reject(err);
      return resolve(cheerio.load(body));
    });
  });
}

function initPreReq(year, period, dept) {
  return new Promise(function(resolve, reject) {
    var uri = inputs.prereqURL(year, period, dept);
    request.get(uri, function(err, resp, body) {
      if (err) return reject(err);
      var $ = cheerio.load(body);
      var $course = $('td.course')
      var data = {};
      // gimme a hash like { '113' : 'the shit' }

      $course.each(function(i, el) {
        var courseNo = _.last($(el).text().trim().split(/\s/)) 
        var preReqString = $(el).next().next().text().trim()
        data[courseNo] = preReqString
      });

      resolve(data);
    });
  })
}
