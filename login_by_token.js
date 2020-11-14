class Login_by_token{
    
    execute = async (pool, token, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            await connection.beginTransaction(); // START TRANSACTION

            try {
                //is there row having such token?
                const queryString01 = `SELECT * FROM customer
                WHERE token = ?
                `;
                let result = await connection.execute(queryString01, [token]);
                console.log(result);
                if(result[0].length == 0) {
                    throw new Error("such token not exists")
                }
            
                let timeout = new Date(result[0].token_timeout);
                let now = Date.now();

                if(timeout < now){
                    throw new Error("token timeout. plz get new token by logining your id/pw")
                }
                await connection.commit(); // COMMIT
                connection.release();
                res.json({'success':1,'verbose':result});
            } catch(err) {
                await connection.rollback(); // ROLLBACK
                connection.release();
                console.log(err.toString());
                res.json({'success':0,'verbose':['Query Error',err.toString()]});
            }
        } catch(err) {
            console.log(err.toString());
            res.json({'success':0,'verbose':['DB Error',err.toString()]});
        }
    }
   

    
}

module.exports  = Login_by_token;

/* success
{
fieldCount: 0,
affectedRows: 1,
insertId: 0,
info: "",
serverStatus: 3,
warningStatus: 0
}
*/