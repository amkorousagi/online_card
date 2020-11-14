var mysql      = require('mysql2/promise');
var request = require("request")
var express = require("express");
var bodyParser = require('body-parser');
var db_config = require("./db_config.json");
var test = require("./test");
var join = require("./join");
var login_by_id = require("./login_by_id");
var login_by_token = require("./login_by_token");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var pool = mysql.createPool({
    host : db_config.host,
    user : db_config.user,
    password : db_config.password,
    database: db_config.database
});
const test_instance = new test();
const join_instance = new join();
const login_by_id_instance = new login_by_id();
const login_by_token_instance = new login_by_token();


app.get("/", (req,res)=>{
   test_instance.execute(pool, res);
});

app.get("/join", (req,res) =>{
    const {id,pw,nickname} = req.query;
    join_instance.execute(pool, id, pw, nickname, res);
});

app.get("/login_by_id", (req,res) =>{
    const {id,pw} = req.query;
    login_by_id_instance.execute(pool, id, pw, res);
});

app.get("/login_by_token", (req,res) =>{
    const {token} = req.query
    login_by_token_instance.execute(pool, token, res);
});

app.listen(5000, "0.0.0.0", function(){
    console.log("server is running.. in 5000");
});