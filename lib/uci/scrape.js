module.exports = function scrapeUCI(opts, cb) {
  require('./sources/'+opts.source)(opts, cb)
}
