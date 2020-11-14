var randomstring = require("randomstring");

class Login_by_id{
    
    execute = async (pool, id, pw, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            await connection.beginTransaction(); // START TRANSACTION

            try {
                const queryString01 = `SELECT * FROM customer
                WHERE id = ?
                AND pw = ?
                `;
                let result = await connection.execute(queryString01, [id, pw]);

                if(result[0].length == 0) {
                    console.log("0");
                    throw new Error("such id/pw not exists")
                }
            
                console.log("!0");
                const token = randomstring.generate(19);
                var timeout = new Date(Date.now());
                timeout.setDate(timeout.getDate() + 30);
                var timeout_string = timeout.getFullYear() + '-' + (timeout.getMonth()+1) + '-' + timeout.getDate(); 
                console.log(token, timeout_string);

                const queryString02 = `
                SELECT * from customer
                where token = ?
                `
                const result02 = await connection.execute(queryString02,[token]);
                if(result[0].length != 0) {
                    console.log("0");
                    throw new Error("such token  exists. plz retry")
                }

                const queryString03 = `
                UPDATE customer
                SET token = ?, token_timeout = ?
                WHERE id = ?
                AND pw = ?
                `;
                const result03 = await connection.execute(queryString03,[token, timeout_string,id,pw]);

                if(result03[0].affectedRows == 0){
                    throw new Error('no affectedRows')
                }
                else if(result03[0].affectedRows > 1){
                    throw new Error('duplicated id/pw')
                }
                
                await connection.commit(); // COMMIT
                connection.release();
                console.log(result03);
                res.json({'success':1,'verbose':result03});
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

module.exports  = Login_by_id;

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