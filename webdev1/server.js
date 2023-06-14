const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();
const port = 3000;

// Configure SQL Server connection
const config = {
    server: "localhost",
    user: "ONIORBITER\SQLEXPRESS",
    password: "windows Authentication",
    database: "new",
    options: {
        trustServerCertificate: true, // For self-signed certificates
    },
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Route for rendering the user information page
app.get("/", (req, res) => {
    res.render("index");
});

// Route for saving user information
app.post("/save", (req, res) => {
    const { name, email } = req.body;

    // Create a SQL Server connection pool
    sql.connect(config, (err) => {
        if (err) {
            console.error("Error connecting to SQL Server:", err);
            return res.status(500).send("Internal Server Error");
        }

        // Create a new SQL Server request
        const request = new sql.Request();

        // Prepare the SQL query
        const query = "INSERT INTO Users (name, email) VALUES (@name, @email)";
        request.input("name", sql.NVarChar(255), name);
        request.input("email", sql.NVarChar(255), email);

        // Execute the SQL query
        request.query(query, (err) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).send("Internal Server Error");
            }

            console.log("User information saved successfully.");
            return res.redirect("/users");
        });
    });
});

// Route for retrieving all user information
app.get("/users", (req, res) => {
    // Create a SQL Server connection pool
    sql.connect(config, (err) => {
        if (err) {
            console.error("Error connecting to SQL Server:", err);
            return res.status(500).send("Internal Server Error");
        }

        // Create a new SQL Server request
        const request = new sql.Request();

        // Execute the SQL query
        request.query("SELECT * FROM Users", (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).send("Internal Server Error");
            }

            // Render the user information page with the retrieved data
            res.render("users", { users: result.recordset });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
