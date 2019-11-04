var mysql = require('mysql');

//database connection
var con = mysql.createConnection({
  host: "sql3.freemysqlhosting.net",
  user: "sql3310294",
  password: "3Gqy99RSiD",
  database : 'sql3310294',
  multipleStatements: true
});

exports.con = con;
