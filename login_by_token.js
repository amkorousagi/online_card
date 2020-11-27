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
                res.json(result[0][0]);
            } catch(err) {
                //query error
                await connection.rollback(); // ROLLBACK
                connection.release();
                console.log(err.toString());
                res.status(400).json(err.toString());
            }
        } catch(err) {
            //db error
            console.log(err.toString());
            res.status(400).json(err.toString());
        }
    }
   

    
}

module.exports  = Login_by_token;