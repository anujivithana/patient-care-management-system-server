import mysql from 'mysql';

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"palliative_care _center"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected successfully');
});

module.exports = db;
