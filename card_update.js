class Card_update{
    
    execute = async (pool,token, name, address, phone_number, url, description, res) =>{
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
                console.log("hi ",result[0][0].card_id);

                const result2 = await connection.execute(
                    `
                    update card
                    set name = ?, address = ?, phone_number = ?, face_photo = ?, description = ?
                    where card_id = ?
                    `,
                    [name, address, phone_number, url, description, result[0][0].card_id]
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

module.exports  = Card_update;