class Card_delete{
    
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
                console.log("result 1 :",result[0]);
                console.log("card id",card_id);
                
                const result2 = await connection.execute(
                    `
                    update customer
                    set card_id = NULL
                    where card_id = ?
                    `,
                    [card_id]
                );
                if(result2[0].length == 0) {
                    throw new Error("failed to update card id")
                }
                console.log("result 2 :",result2[0]);
                
                const result3 = await connection.execute(
                    `
                    delete from card
                    where card_id = ?
                    `,
                    [card_id]
                );
                if(result3[0].length == 0) {
                    throw new Error("failed to delete card id")
                }
                console.log("result 3 :",result3[0]);

                await connection.commit(); // COMMIT
                connection.release();
                res.json(result3[0]);
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

module.exports  = Card_delete;