class Join{
    
    execute = async (pool, id, pw, nickname, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            try {
                await connection.beginTransaction(); // START TRANSACTION
               
                const result0 = await connection.execute(
                    `INSERT INTO customer (id, pw, nickname) VALUES ('${id}', '${pw}', '${nickname}')`
                );

                const result = await connection.execute(
                    `INSERT INTO card (name, address, phone_number, face_photo, description) VALUES (?, ?, ?, ?, ?)`,
                    ["name", "address", "phone_number", "url", "description"]
                );
                if(result[0].length == 0) {
                    throw new Error("wrong query as inserting card")
                }

                const result2 = await connection.execute(
                    `
                    update customer
                    set card_id = ?
                    where id = ?
                    `,
                    [result[0].insertId, id]
                );
                if(result2[0].length == 0) {
                    throw new Error("wrong query as updating customer")
                }


                await connection.commit(); // COMMIT
                connection.release();
                console.log(result0[0]);
                res.send(result0[0]);
            } catch(err) {
                await connection.rollback(); // ROLLBACK
                connection.release();
                console.log('Query Error');
                res.send('Query Error');
            }
        } catch(err) {
            console.log('DB Error');
            res.send('DB Error');
        }
    }
   

    
}

module.exports  = Join;

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