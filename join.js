class Join{
    conn;

    constructor(conn){
        this.conn = conn;
    }

    

    execute_promise(param){
        return new Promise(function(resolve, reject){

            conn.connect();
            conn.query('SELECT 1 + 1 AS solution', 
            function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results[0].solution);
            });
            
            resolve(param);
        }
        );
    }

    execute(id, pw, res){

        this.execute_promise({"conn": this.conn, "id":id, "pw":pw, "res": res})
        .then(r => function(r){
            console.log(r3);
        })
        .catch((err)=>{
            console.log(err)
            res.json({err:err.toString()});
        })
    }
}

module.exports  = Join;