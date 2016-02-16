module.exports.socURL = function() {
  return 'https://www.reg.uci.edu/perl/WebSoc'
}

module.exports.prereqURL = function(year, period, dept) {
  var term = normalizeYear(year)+normalizePeriod(period);
  var dept = normalizeDept(dept);
  return 'https://www.reg.uci.edu/cob/prrqcgi?term='+term+'&dept='+dept+'&action=view_by_term'
}

var normalizePeriod = function(period) {
  var map = {
    winter: '03',
    fall: '92',
    spring: '14',
    summer1: '25',
    summer2: '76'
  }
  var period = map[period.toLowerCase()];
  if (period)
    return period;
  else
    throw new Error('Period is invalid')
}

var normalizeYear = function(year) {
  var year = parseInt(year);
  if (year >= 2010 && year <= new Date().getFullYear()+1)
    return year
  else
    throw new Error('Year is not valid.')
}

var normalizeDept = function(dept) {
  return dept.toUpperCase();
}

module.exports.form = function(year, period, dept) {
  var yearTerm = normalizeYear(year)+'-'+normalizePeriod(period);
  return {
    YearTerm: yearTerm,
    ShowComments: 'on',
    ShowFinals: 'on',
    Breadth: 'ANY',
    Dept: normalizeDept(dept),
    Division: 'ANY',
    ClassType: 'ALL',
    FullCourses: 'ANY',
    FontSize: 100,
    CancelledCourses: 'Exclude',
    Submit: 'Display Web Results'
  }
}
