import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const salt=10;


const app = express();
const port = 5000;// Define port variable

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"palliative_care _center"
});


app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
  origin:["http://localhost:3000"],
  method:["POST","GET"],
  credentials: true
  }
));

// Define the login route for patients
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE Email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json({ Message: "Server Side Error" });
    }

    if (data.length > 0) {
      const user = data[0];
      bcrypt.compare(req.body.password, user.Password, (bcryptErr, result) => {
        if (bcryptErr) {
          return res.json({ Message: "Error comparing passwords" });
        }
        
        if (result) {
          const email = user.Email;
          const token = jwt.sign({ email }, "our-jwtwebtoken-secret-key", { expiresIn: '1d' });
          res.cookie('token', token);
          return res.json({ Status: "Successful Login" });
        } else {
          return res.json({ Message: "Invalid email or password" });
        }
      });
    } else {
      return res.json({ Message: "No Records Existed" });
    }
  });
});
// Define the login route for staff
app.post("/stafflogin", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ? AND Password = ?";
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    if (err) return res.json({ Message: "Server Side Error" });
    if (data.length > 0) {
       const userRole = data[0].UserRole;
       let redirectUrl;
       switch (userRole) {
         case 'nurse':
           redirectUrl = '/nurse/profile';
           break;
         case 'doctor':
           redirectUrl = '/doctor/profile';
           break;
         case 'admin':
           redirectUrl = '/admin/dashboard';
           break;
         default:
           redirectUrl = '/';
       }
       
       const username = data[0].username;
       const token = jwt.sign({ username, userRole }, "our-jwtwebtoken-secret-key", { expiresIn: '1d' });
       res.cookie('token', token);
       return res.json({ Status: "Successful Login", RedirectUrl: redirectUrl });
    } else {
      return res.json({ Message: "No Records Existed" });
    }
  });
});


app.post('/register', (req, res) => {
  const sql = "INSERT INTO users (FullName, Email, Password, ContactNumber) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hashing password" });
    const values = [
      req.body.fullname,
      req.body.email,
      hash,
      req.body.contactnumber
    ];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inserting data error in the server" });
      return res.json({ Status: "Success" });
    });
  });
});

// Define the logout route
app.get('/logout',(req,res) =>{
  res.clearCookie('token');
  return res.json({Status: "Success"})
});

app.listen(port, () => {
  console.log("Server started on port",port);
});
