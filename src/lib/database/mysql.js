import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'htl-projekt.com',
  user: 'ganihasmegaj',
  password: '!Insy_2024$',
  port:33060,
  database: '2024_4bw_ganihasmegaj_albanianrivers',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

export default pool;