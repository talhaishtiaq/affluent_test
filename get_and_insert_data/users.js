var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var con = require("../db_con").con;

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  for(var page = 1; page<3; page++){
    fetch_and_insert_data(con, page);
  }
});

function fetch_and_insert_data(con, page){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://reqres.in/api/users?page="+page, true);
  xhr.onload = function(){
      data = JSON.parse(xhr.responseText).data;
      data.forEach(function(user){
        var sql = "insert into users (email, first_name, last_name, avatar) values('"+user.email+"','"+user.first_name+"','"+user.last_name+"','"+user.avatar+"');";
        con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
        });
      });
  };
  xhr.send();
}
