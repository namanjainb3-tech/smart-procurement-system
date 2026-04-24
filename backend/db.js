import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Delhi@51",
  database: "smart_procurement",
  waitForConnections: true,
  connectionLimit: 10
});

export default db;