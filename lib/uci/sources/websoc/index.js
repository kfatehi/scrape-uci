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
      var course = { units: 0 }

      // id and name
      var titleText = $el.text().trim();
      var parts = titleText.match(titlePattern);
      var code = parts[2];
      course.id = parts[1]+code;
      course.name = parts[3].trim();

      // prereqs
      if (prereq[code])
        course.prerequisite = prereq[code]

      // populate all courses under this title
      course.courses = [];
      var tr = $el.parent().next(); // headers
      var head = tr.find(">th").map((e, th) => $(th).text().trim().toLowerCase()).toArray();
      tr = tr.next(); // first course row
      // locate rows with course number, unit, etc, these are the actual courses
      // we use a while loop because the # of rows til you get there is inconsistent
      // XXX strange markup can lock me up!!
      while (tr.text().trim().match(/^\d+/) /* has units */ ) {
        var values = tr.find(">td").map((e, td) => $(td).text().trim()).toArray();
        var courseInfo = _.zipObject(head, values)
        // units should be an int
        courseInfo['units'] = parseInt(courseInfo['units'])
        // if we dont have units yet, put that in
        // we have to compare here because discussions are 0 units
        if (courseInfo['units'] > course.units) {
          course.units = courseInfo['units']
        }
        course.courses.push(courseInfo);
        // now load the next one
        tr = tr.next();
      }

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
