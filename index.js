import mysql2 from 'mysql2';
import express from 'express';
import cors from 'cors';

const connection = mysql2.createConnection({
host: "localhost",
database:"student_result",
user:"root",
password:"root",

});

const app = express();
app.use(cors());

const PORT = 5000;

app.listen(PORT,()=> {
    console.log('SERVER : http://localhost:5000 ');
    connection.connect((err)=>{
        if(err) throw err;
        console.log("DATABASE CONNECTED");
    });
});

app.use(express.json());         // Add this line to parse the request body as JSON

app.use("/all",(req, res)=> {
  const sql_query = 'select * from result'
  connection.query(sql_query, (err, result)=>{
    if(err) throw err;
    res.send(result);
});
});

app.use("/getbyid/:id",(req, res)=> {
    const id = req.params.id;
    const sql_query = `select * from result where id = '${id}'`;
    connection.query(sql_query, (err, result)=>{
      if(err) throw err;
      res.send(result);
  });
  });

  app.use("/add", (req, res) => {
    const { id, name, dob, score } = req.body;
  
    // Check if all required fields are provided
    if (!id || !name || !dob || !score) {
      res.status(400).send("Please provide id, name, dob, and score");
      return;
    }
  
    const sql_query = `INSERT INTO result (id, name, dob, score) VALUES ('${id}', '${name}', '${dob}', '${score}')`;
    connection.query(sql_query, (err, result) => {
      if (err) throw err;
      res.send("New student added successfully");
    });
  });


  app.use("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { name, dob, score } = req.body;
  
    // Check if all required fields are provided
    if (!name || !dob || !score) {
      res.status(400).send("Please provide name, dob, and score");
      return;
    }
  
    const sql_query = `UPDATE result SET name='${name}', dob='${dob}', score='${score}' WHERE id='${id}'`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
      res.send("Student record updated successfully");
    });
  });
  
  app.use("/delete/:id", (req, res) => {
    const id = req.params.id;
  
    const sql_query = `DELETE FROM result WHERE id='${id}'`;
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
      res.send("Student record deleted successfully");
    });
  });
  

