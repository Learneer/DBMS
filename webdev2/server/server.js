import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, roll_no INTEGER, address TEXT, phone TEXT, email TEXT)');
});
app.get("/hello", (req, res) => {
    res.send("Hello Vite!");
});

app.post("/form", (req, res) => {
    const { name, roll_no, address, phone, email } = req.body;
    db.run(`INSERT INTO users(name, roll_no, address, phone, email) VALUES(?, ?, ?, ?, ?)`, [name, roll_no, address, phone, email], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.send("Form submitted successfully");
    });

});
app.get("/getAllData", (req, res) => {
    let sql = `SELECT * FROM users`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });

});

app.put("/user/:userId", (req, res) => {
    const { userId } = req.params;
    const { name, roll_no, address, phone, email } = req.body;
    const sql = `UPDATE users SET name = ?, roll_no = ?, address = ?, phone = ?, email = ? WHERE user_id = ?`;
    console.log(userId,"userId");
    db.run(sql, [name, roll_no, address, phone, email, userId], (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(`User with ID ${userId} updated successfully.`);
        }
    });
});

app.delete("/user/:userId", (req, res) => {
    const { userId } = req.params;
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.run(sql, userId, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(`User with ID ${userId} deleted successfully.`);
        }
    });
});


app.listen(3001, () =>
    console.log("Server is listening on port 3001...")
);
