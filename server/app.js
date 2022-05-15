const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 1000;

//MySQL
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "students",
});

app.get("/students", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as Id  ${connection.threadId}`);

    connection.query("SELECT * from info where deleted=0", (err, rows) => {
      connection.release();
      if (!err) {
        let data = rows.map((elem) => {
          return {
            id: elem.id,
            name: elem.name,
            fatherName: elem.fatherName,
            motherName: elem.motherName,
            age: elem.age,
            imgUrl: elem.imgUrl,
            address: JSON.parse(elem.address),
            regDate: elem.regDate,
          };
        });
        res.send(data);
      } else {
        console.log(err);
      }
    });
  });
});

app.get("/students/:id", (req, res) => {
    var id = req.params.id;
    //   console.log(id);
    var sqlQuery = `SELECT * from info WHERE id=${id}`;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log(`Connected as Id  ${connection.threadId}`);
  
      connection.query(sqlQuery, (err, rows) => {
        connection.release();
        if (!err) {
            let data = rows.map((elem) => {
                return {
                  id: elem.id,
                  name: elem.name,
                  fatherName: elem.fatherName,
                  motherName: elem.motherName,
                  age: elem.age,
                  imgUrl: elem.imgUrl,
                  address: JSON.parse(elem.address),
                  regDate: elem.regDate,
                };
              });
              res.send(data);
        } else {
          console.log(err);
        }
      });
    });
  });

app.post("/students", (req, res) => {
  var name = req.body.name,
    fatherName = req.body.fathername,
    motherName = req.body.mothername,
    age = req.body.age,
    imgUrl = req.body.imgUrl,
    address = JSON.stringify(req.body.address);
  console.log(address);
  var sqlQuery =
    name && fatherName && motherName && age
      ? `INSERT into info (name, fatherName, motherName, age, imgUrl, address, deleted) VALUES ('${name}', '${fatherName}', '${motherName}', '${age}', '${imgUrl}', '${address}', 0)`
      : "SELECT * from info where deleted=0";

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as Id  ${connection.threadId}`);

    connection.query(sqlQuery, (err, rows) => {
      connection.release();
      if (!err) {
        res.send("Data posted");
      } else {
        console.log(err);
      }
    });
  });
  // res.send("Data posted");
});

app.patch("/students/:id/", (req, res) => {
  var id = req.params.id;
  var name = req.body.name,
  fatherName = req.body.fathername,
  motherName = req.body.mothername,
  age = req.body.age,
  imgUrl = req.body.imgUrl,
  address = JSON.stringify(req.body.address);
  console.log(address)
  var sqlQuery= `UPDATE info SET name='${name}', fatherName='${fatherName}', motherName='${motherName}', age='${age}', imgUrl='${imgUrl}', address='${address}'  WHERE id=${id}`
  // sqlQuery = (name && fatherName) 
  //  ? `UPDATE customers SET name='${name}', address='${address}'  WHERE id=${id}`
  // : "SELECT * from info where deleted=0";
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as Id  ${connection.threadId}`);

    connection.query(sqlQuery, (err, rows) => {
      connection.release();
      if (!err) {
        res.send('Updated Successfully');
      } else {
        console.log(err);
      }
    });
  });
});

app.delete("/students/:id", (req, res) => {
  var id = req.params.id;
  //   console.log(id);
  var sqlQuery = `UPDATE info SET deleted=1 WHERE id=${id}`;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`Connected as Id  ${connection.threadId}`);

    connection.query(sqlQuery, (err, rows) => {
      connection.release();
      if (!err) {
        res.send(`Record ${id} is Deleted succesfully`);
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`${port}`);
});
