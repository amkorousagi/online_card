class Join{
    
    execute = async (pool, id, pw, nickname, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            try {
                await connection.beginTransaction(); // START TRANSACTION
               
                const [rows] = await connection.execute(
                    
                    `INSERT INTO customer (id, pw, nickname) VALUES ('${id}', '${pw}', '${nickname}')`
                    );
                await connection.commit(); // COMMIT
                connection.release();
                console.log(rows);
                res.send(rows);
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