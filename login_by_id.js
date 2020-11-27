var randomstring = require("randomstring");

class Login_by_id{
    
    execute = async (pool, id, pw, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            await connection.beginTransaction(); // START TRANSACTION

            try {
                //is there customer having such id/pw
                const queryString01 = `SELECT * FROM customer
                WHERE id = ?
                AND pw = ?
                `;
                let result = await connection.execute(queryString01, [id, pw]);
                console.log(result);
                if(result[0].length == 0) {
                    throw new Error("such id/pw not exists")
                }
            
                const token = randomstring.generate(19);
                var timeout = new Date(Date.now());
                timeout.setDate(timeout.getDate() + 30);
                var timeout_string = timeout.getFullYear() + '-' + (timeout.getMonth()+1) + '-' + timeout.getDate(); 
                console.log(token, timeout_string);

                //is there customer having duplizte token generated at now
                const queryString02 = `
                SELECT * from customer
                where token = ?
                `
                const result02 = await connection.execute(queryString02,[token]);
                console.log(result02);
                if(result02[0].length != 0) {
                    console.log("0");
                    throw new Error("such token  exists. plz retry")
                }

                //update customer with new token, timeout
                const queryString03 = `
                UPDATE customer
                SET token = ?, token_timeout = ?
                WHERE id = ?
                AND pw = ?
                `;
                const result03 = await connection.execute(queryString03,[token, timeout_string,id,pw]);
                console.log(result03);
                if(result03[0].affectedRows == 0){
                    throw new Error('no affectedRows')
                }
                else if(result03[0].affectedRows > 1){
                    throw new Error('duplicated id/pw')
                }
                
                await connection.commit(); // COMMIT
                connection.release();
                res.json(token);
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

module.exports  = Login_by_id;