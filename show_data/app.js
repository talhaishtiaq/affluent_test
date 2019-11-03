var express=require('express');
var con = require("../db_con").con;

var app=express();

//api to fetch data from database
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

//html page route to show data
app.get('/',function(req,res)
{
  res.sendFile(__dirname+'/index.html');
});

//hosted on port 8080
var server=app.listen(8080,function() {});
