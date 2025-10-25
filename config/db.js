require('dotenv').config(); //load env
const mysql = require('mysql2/promise');

//parse DB_URL
const dbURL = new URL(process.env.DATABASE_URL);
if (!dbURL) {
    throw new Error("DATABASE_URL belum di set di .env");
}
const url = new URL(dbURL);

//create the connection to database
const pool = mysql.createPool({
    host : url.hostname,
    user : url.username,
    password : url.password,
    database : url.pathname.replace(/^\//, ''), //path tanpa leading slash
    port : url.port ? Number(url.port) : 3306,
    connectionLimit : 10,
    waitForConnections : true,
    queueLimit : 0
});

module.exports = pool;