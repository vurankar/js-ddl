exports.__defineGetter__("Sqlite3", function() {
  return require("./lib/sqlite3")
})

exports.__defineGetter__("sqlite3", function() {
  return exports.Sqlite3.attributes
})