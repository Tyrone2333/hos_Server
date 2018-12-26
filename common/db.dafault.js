import mysql from 'mysql'

let pool
if (process.env.NODE_ENV === "production") {
    pool = mysql.createPool({
        host: '***',
        user: '***',
        password: '***',
        database: 'bdm289907541_db',
        port: 3306, // 台湾 gcp 端口为33060
    })
} else {
    pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '***',
        database: 'bdm289907541_db',
        port: 3306,
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