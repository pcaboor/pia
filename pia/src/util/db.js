const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'localhost',
    user: 'root',
    password: 'ESRA3-pc59',
    database: 'saasapidb'
});

export default pool;
