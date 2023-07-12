import express from "express";
import pkg from 'pg';
const {Client} = pkg;
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

client.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database.");
    createTable();
  }
});

const createTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      user_id SERIAL PRIMARY KEY,
      name TEXT,
      roll_no TEXT,
      address TEXT,
      phone TEXT,
      email TEXT
    )
  `;
  //console.log(createTableQuery);

  client.query(createTableQuery, (err, _) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created successfully.");
    }
  });
};

app.get("/hello", (req, res) => {
  res.send("Hello Vite!");
});

app.post("/form", (req, res) => {
  const { name, roll_no, address, phone, email } = req.body;
  const insertQuery = `
    INSERT INTO users(name, roll_no, address, phone, email)
    VALUES('${name}', '${roll_no}', '${address}', '${phone}', '${email}')
  `;
  console.log(insertQuery);

  client.query(insertQuery, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error submitting form.");
    } else {
      console.log("Data inserted successfully.");
      console.log(result);
      res.send("Form submitted successfully.");
    }
  });
});

app.get("/getAllData", (req, res) => {
  const selectQuery = `
    SELECT * FROM users
  `;

  client.query(selectQuery, (err, result) => {
    if (err) {
      console.error("Error retrieving data:", err);
      res.status(500).send("Error retrieving data.");
    } else {
      const rows = result.rows;
      res.send(rows);
    }
  });
});

app.put("/user/:userId", (req, res) => {
  const { userId } = req.params;
  const { name, roll_no, address, phone, email } = req.body;
  const updateQuery = `
    UPDATE users
    SET name = $1, roll_no = $2, address = $3, phone = $4, email = $5
    WHERE user_id = $6
  `;

  const values = [name, roll_no, address, phone, email, userId];

  client.query(updateQuery, values, (err) => {
    if (err) {
      console.error("Error updating data:", err);
      res.status(500).send("Error updating data.");
    } else {
      console.log("Data updated successfully.");
      res.send(`User with ID ${userId} updated successfully.`);
    }
  });
});

app.delete("/user/:userId", (req, res) => {
  const { userId } = req.params;
  const deleteQuery = `
    DELETE FROM users
    WHERE user_id = $1
  `;

  client.query(deleteQuery, [userId], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
      res.status(500).send("Error deleting data.");
    } else {
      console.log("Data deleted successfully.");
      res.send(`User with ID ${userId} deleted successfully.`);
    }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
