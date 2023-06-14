const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg');

// Configure the database connection
const config = {
  connectionString: ,
  ssl: true,
};

// Create a server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  // Serve the index.html file
  if (pathname === '/') {
    fs.readFile('indexx.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // Handle form submission
  if (req.method === 'POST' && pathname === '/save-user-data') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { name, email } = JSON.parse(body);

      // Save the data to the database
      const client = new Client(config);
      client.connect()
        .then(() => {
          const query = `INSERT INTO users (name, email) VALUES ($1, $2)`;
          const values = [name, email];

          return client.query(query, values);
        })
        .then(() => {
          client.end();
          // Redirect to the next page
          res.writeHead(302, { Location: '/user-list' });
          res.end();
        })
        .catch(err => {
          console.log('Database error:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        });
    });
  }

  // Retrieve user data and display on user-list page
  if (pathname === '/user-list') {
    // Retrieve user data from the database
    const client = new Client(config);
    client.connect()
      .then(() => {
        const query = 'SELECT * FROM users';

        return client.query(query);
      })
      .then(result => {
        client.end();

        const users = result.rows;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      })
      .catch(err => {
        console.log('Database error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      });
  }
});

// Start the server
server.listen(3000, 'localhost', () => {
  console.log('Server is running on http://localhost:3000');
});
