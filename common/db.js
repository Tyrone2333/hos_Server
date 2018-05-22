import mysql from 'mysql'

// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     database: 'loi'
// })
const pool = mysql.createPool({
    host: '176.122.171.36',
    user: 'root',
    password: 'wcnmbgpz',
    database: 'loi'
})

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