import mysql from 'mysql'

let pool
if (process.env.NODE_ENV === "production") {
    pool = mysql.createPool({
        host: '176.122.171.36',
        user: 'root',
        password: 'wcnmbgpz',
        database: 'bdm289907541_db'
    })
} else {
    pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: 'wcnmbgpz',
        database: 'bdm289907541_db'
    })
}


export default (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        return reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}