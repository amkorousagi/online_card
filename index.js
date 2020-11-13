var mysql      = require('mysql2/promise');
var request = require("request")
var express = require("express");
var bodyParser = require('body-parser');
var db_config = require("./db_config.json");
var test = require("./test");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var pool = mysql.createPool({
    host : db_config.host,
    user : db_config.user,
    password : db_config.password,
    database: db_config.database
});
const test_instance = new test(pool);

//execute
//insert
//https://m.blog.naver.com/n_jihyeon/221806066778
//join
//login

app.get("/", async (req,res)=>{
   /*
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION
            const [rows] = await connection.query('SELECT 1 + 1 AS solution');
            await connection.commit(); // COMMIT
            connection.release();
            console.log(rows);
            res.send(rows);
        } catch(err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            console.log('Query Error');
            return false;
        }
    } catch(err) {
        console.log('DB Error');
        return false;
    }
    */
   test_instance.execute(pool, res);
});

app.listen(5000, "0.0.0.0", function(){
    console.log("server is running.. in 5000");
});