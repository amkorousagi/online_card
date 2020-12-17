class Friend_set{
    
    execute = async (pool,token, friend_card, res) =>{
        try {
  
            const connection = await pool.getConnection(async conn => conn);
           

            try {
                await connection.beginTransaction(); // START TRANSACTION
               
                //console.log("tran begin end", name, address, phone_number, url, description);

                const result0 = await connection.execute(
                    `
                    select * from customer
                    where token = ?
                    `,
                    [token]
                );
                if(result0[0].length == 0) {
                    throw new Error("such token not exists")
                }
                console.log(result0[0]);

                const result = await connection.execute(
                    `INSERT INTO friend_list (my_id, friends_cards) VALUES (?, ?)`,
                    [result0[0].id, friend_card]
                );
                if(result[0].length == 0) {
                    throw new Error("wrong query as inserting friends")
                }
                /*
                const result2 = await connection.execute(
                    `
                    update customer
                    set card_id = ?
                    where token = ?
                    `,
                    [result[0].insertId, token]
                );
                if(result2[0].length == 0) {
                    throw new Error("wrong query as updating customer")
                }
                */
                await connection.commit(); // COMMIT
                connection.release();
                res.json([result0[0].id, friend_card]);
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

module.exports  = Friend_set;