class Friend_read{
    
    execute = async (pool,token, res) =>{
        try {
  
            const connection = await pool.getConnection(async conn => conn);
           

            try {
                await connection.beginTransaction(); // START TRANSACTION

                const result = await connection.execute(
                    `
                    select * from customer
                    where token = ?
                    `,
                    [token]
                );
                if(result[0].length == 0) {
                    throw new Error("such token not exists")
                }

                const result2 = await connection.execute(
                    `
                    select friends_cards  from friend_list
                    where my_id = ?
                    `,
                    [result[0][0].id]
                );
                if(result2[0].length == 0) {
                    throw new Error("wrong query as updating customer")
                }

                await connection.commit(); // COMMIT
                connection.release();
                res.json(result2[0]);
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

module.exports  = Friend_read;