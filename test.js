class Test{
    
    execute = async (pool, res) =>{
        try {
            const connection = await pool.getConnection(async conn => conn);
            try {
                await connection.beginTransaction(); // START TRANSACTION
                const [rows] = await connection.query('SELECT 1 + 1 AS solution');
                await connection.commit(); // COMMIT
                connection.release();
                console.log(rows);
                res.send(rows);
            } catch(err) {
                await connection.rollback(); // ROLLBACK
                connection.release();
                console.log('Query Error');
                return false;
            }
        } catch(err) {
            console.log('DB Error2');
            console.log(err.toString())
            return false;
        }
    }
   

    
}

module.exports  = Test;