var mysql      = require('mysql2/promise');
var request = require("request")
var express = require("express");
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var db_config = require("./db_config.json");
const HTTPS = require('https');
var test = require("./test");
var join = require("./join");
var login_by_id = require("./login_by_id");
var login_by_token = require("./login_by_token");
var card_create = require("./card_create");
var card_read = require("./card_read");
var card_update = require("./card_update");
var card_delete = require("./card_delete");

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
const card_create_instance = new card_create();
const card_read_instance = new card_read();
const card_update_instance = new card_update();
const card_delete_instance = new card_delete();



app.get("/", (req,res)=>{
    test_instance.execute(pool, res);
});

app.get("/test", (rep,res)=>{
    request.post(
        {
            url:"http://localhost:5001/card_create",
            form : {
                token: "PdYw6j80oKvVp2D7aZ6",
                name :'myname', 
                address:'korea',
                phone_number: '01012345678',
                url: "http://15.164.216.57:5002/get_media?resource=1606224412089_dog.jpeg",
                description:`i'm super man`
            }
        },
        function optionalCallback(err, httpResponse, body){
            if(err){
                return console.error('upload failed:',err);
            }
            console.log('upload successfully,',body);
        }
    );
    res.send("ok")
})

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

app.get("/card_create", (req,res)=>{
    const {token, name, address, phone_number, url, description} = req.query;
    card_create_instance.execute(pool,token, name, address, phone_number, url, description,res);
})

app.get("/card_read", (req,res)=>{
    const {token, card_id} = req.query;
    card_read_instance.execute(pool,token, card_id,res);
})

app.get("/card_update", (req,res)=>{
    const {token, name, address, phone_number, url, description} = req.query;
    card_update_instance.execute(pool,token, name, address, phone_number, url, description,res);
})

app.get("/card_delete", (req,res)=>{
    const {token,card_id} = req.query;
    card_delete_instance.execute(pool, token, card_id, res);
})

app.post("/card_create", (req, res) => {
    const {token, name, address, phone_number, url, description} = req.body;
    console.log(name);
    card_create_instance.execute(pool,token, name, address, phone_number,url, description, res);
});

try {
    const option = {
      ca: fs.readFileSync('/etc/letsencrypt/live/knulmsmodule2.cf/fullchain.pem'),
      key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/knulmsmodule2.cf/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/knulmsmodule2.cf/cert.pem'), 'utf8').toString(),
    };
  
    HTTPS.createServer(option, app).listen(5001, () => {
      console.log(`[HTTPS] Soda Server is started on port 5001`);
    });
  } catch (error) {
    console.log(error.toString());
  }

//PdYw6j80oKvVp2D7aZ6
