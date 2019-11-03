var express=require('express');
var con = require("../db_con").con;

var app=express();

app.get('/api/v1/get_data',function(req,res)
{
  var data = {};

  con.query("select * from users;select * from dates;", function (err, result) {
    if (err) throw err;
    data['users'] = result[0];
    data['dates'] = result[1];
    res.json({data : data});
  });
});

app.get('/',function(req,res)
{
  res.sendFile(__dirname+'/index.html');
});

var server=app.listen(8080,function() {});
