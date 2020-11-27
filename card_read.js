class Card_read{
    
    execute = async (pool,token, card_id, res) =>{
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
                    select *  from card
                    where card_id = ?
                    `,
                    [card_id]
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

module.exports  = Card_read;