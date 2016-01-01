"use strict";
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var titlePattern = /^([A-z|0-9]+)\D+([0-9|A-Z]+)\W+([\w|\s]+)/;
var Promise = require('bluebird')

module.exports = function(opts, cb) {
  let year = parseInt(opts.year)
  let period = opts.period.toLowerCase()
  let quarter = period+' '+year
  init("http://www.ics.uci.edu/ugrad/courses/listing.php", {
    level: "ALL", program: "ALL", department: opts.dept,
    year: period === 'fall' ? year : year-1
  }).then(function($) {
    let head = $('table#listing thead tr > th')
    .map((i,e) => $(e).text().trim().toLowerCase()).toArray()

    let all = $('table#listing tbody tr').map((i,row) => {
      let data = $(row).find('> td').map((i,td) => $(td).text().trim()).toArray()
      return [_.reduce(data, (result, n) => {
        result[_.at(head, _.indexOf(data, n))] = n
        return result
      }, {})]
    }).toArray()

    let out = _(all)
    .filter((d) => d[quarter] ? d : null)
    .map((c) => {
      return {
        title: c.course,
        description: c.description,
        instructor: c[quarter]
      }
    })
    .value()

    cb(null, out)
  }).catch(function(err) {
    cb(err)
  })
}

  

function init(url, form) {
  return new Promise(function(resolve, reject) {
    request.get({ url: url, qs: form }, (err, resp, body) => {
      if (err) return reject(err);
      return resolve(cheerio.load(body));
    });
  });
}
