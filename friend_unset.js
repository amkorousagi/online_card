class Friend_unset{
    
    execute = async (pool,token, friend_card, res) =>{
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
              
                
                const result3 = await connection.execute(
                    `
                    delete from friend_list
                    where my_id = ?
                    `,
                    [result[0][0].id]
                );
                if(result3[0].length == 0) {
                    throw new Error("failed to delete card id")
                }
                console.log("result 3 :",result3[0]);

                await connection.commit(); // COMMIT
                connection.release();
                res.json(result[0][0].id);
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

module.exports  = Friend_unset;