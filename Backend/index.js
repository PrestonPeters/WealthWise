const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mysql = require('mysql2');


var db = mysql.createConnection({
  host: 'mysql2',
  user: 'root',
  password: 'asdf1234'
 
});

db.connect((err) => {
  if (err) {
      console.error('Error connecting to the database:', err);
      if (err.code === 'ECONNREFUSED') {
          console.error('Database connection refused. Exiting application.');
          process.exit(1); // Exit with a failure code
      }
  } else {
      console.log('Connected to the database.');
      createDatabase();
  }
});


function createDatabase() {
  db.query("CREATE DATABASE IF NOT EXISTS Tracker", (err, result) => {
    if (err) {
      console.error("Error creating database: ", err);
      return;
    }
    console.log("Database 'Tracker' created or verified successfully");
    db.query("USE Tracker", (err, result) => {
      if (err) {
        console.error("Error using database: ", err);
        return;
      }
      console.log("Using database 'Tracker'");
      createUserTable();
      createtransactionTable(); 
      createCatogoryTable();
      createBalanceTable();
      createSpendingTable();
  
    });
  });
}



function useDatabase() {
  db.query("USE tracker", (err, result) => {
    if (err) {
      console.error("Error using database: ", err);
      return;
    }
    console.log("Using database 'Tracker'");
    createUserTable();
    createCatogoryTable();
    createBalanceTable();
      createSpendingTable();
  });
}



// need to add the first and last name and email
function createUserTable() {
    db.query(
      "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), is_admin BOOLEAN NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB;",
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Users table created/checked");
        }
      }
    );
}




function createtransactionTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS transactions (id INT NOT NULL AUTO_INCREMENT,user_id INT NOT NULL,category VARCHAR(255) NOT NULL,amount DECIMAL(10, 2) NOT NULL, transaction_date DATE NOT NULL,FOREIGN KEY (user_id) REFERENCES users(id),PRIMARY KEY (id)) ENGINE=InnoDB;",
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("transaction table created/checked");
      }
    }
  );
}




app.post('/register', (req, res) => {
  const { username, password, firstName, lastName, email } = req.body;

  if (!username || !password || !firstName || !lastName) {
    res.status(400).send('Missing required fields');
    return;
  }

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error registering user');
      } else if (results.length > 0) {
          res.status(409).send('Username already taken');
      } else {
          db.query("INSERT INTO users (username, password, first_name, last_name, email, is_admin) VALUES (?, ?, ?, ?, ?, 0)", 
          [username, password, firstName, lastName, email], (err, results) => {
              if (err) {
                  console.log(err);
                  res.status(500).send('Error registering user');
              } else {
                  res.status(201).send('User registered successfully');
              }
          });
      }
  });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Trying to log in with username: ${username}, password: ${password}`); // Add this line
    
    db.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password], 
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error logging in');
            } else if (results.length === 0) { // no user found with the given credentials
                console.log('Invalid username or password'); // Add this line
                res.status(401).send('Invalid username or password');
            } else { // user found, login successful
                console.log('Login successful'); // Add this line
                res.status(200).send('Login successful');
            }
        }
    );
});

app.post('/transaction', (req, res) => {
  const { user_id, category, amount, transaction_date } = req.body;

  db.query("INSERT INTO transactions (user_id, category, amount, transaction_date) VALUES (?, ?, ?, ?)", 
  [user_id, category, amount, transaction_date], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error adding transaction');
      } else {
          res.status(201).send('Transaction added successfully');
      }
  });
});

app.get('/transactions/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query("SELECT * FROM transactions WHERE user_id = ?", [userId], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error retrieving transactions');
      } else {
          res.status(200).json(results);
      }
  });
});


// Create catogory table
function createCatogoryTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS catogoryTable (id INT NOT NULL AUTO_INCREMENT,catogory_name VARCHAR(100) NOT NULL,catogory_total INT NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        console.log("catogoryTable created successfully");
      }
    }
  );
}

// Add to the catogory Table

app.post('/addcatogories', (request, response) => {
  const category  = request.body.catogory_name;
  db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",[category,0], (error, results) =>{
      if (error) {
          console.log(error);
        }
        else{
          console.log('successfully added catogory into the table')
        }
      });
});

app.post('/addcatogories/delete', (request, response) => {
  const category  = request.body.catogory_name;
  db.query(`DELETE FROM catogoryTable WHERE catogory_name='${category}'`, (error, results) =>{
      if (error) {
          console.log(error);
        }
        else{
          console.log('successfully deleted catogory from the table')
        }
      });

      db.query(`DELETE FROM spendingTable WHERE catogory_name='${category}'`, (error, results) =>{
        if (error) {
            console.log(error);
          }
          else{
            console.log('successfully deleted catogory from the table')
          }
        });
});


app.get('/addcatogories', (request, response) => {
  db.query("SELECT catogory_name,catogory_total FROM catogoryTable", (error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        response.json(results);
        console.log('Retrieved all catogories successfully');
      }
  });
});



function createBalanceTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS balanceTable (id INT NOT NULL AUTO_INCREMENT,balance_amount INT NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("balanceTable created successfully");
      }
    }
  );
}

// Add to the balance Table

app.post('/addbalance', (request, response) => {
  const balance  = request.body.balance_amount;
  db.query(`UPDATE balanceTable SET balance_amount=balance_amount+'${balance}'`, (error, results) =>{
      if (error) {
          console.log(error);
        }else {
          console.log("Balance updated successfully into the table");
        }
      });
});

app.get('/addbalance', (request, response) => {
  db.query("SELECT balance_amount FROM balanceTable" , (error, results) => {
      if (error) {
          console.log(error);
      }else {
        response.json(results[0].balance_amount);
        console.log("Balance retrieved successfully");
      }
  });
});






//Create expense table
function createSpendingTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS spendingTable (id INT NOT NULL AUTO_INCREMENT, catogory_name VARCHAR(100) NOT NULL, expense_name VARCHAR(500) NOT NULL, expense_amount INT NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(20) NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("spendingTable created successfully");
      }
    }
  );
}

// Add to the expense Table

app.post('/addspendings', (request, response) => {
  const {catogory_name, expense_name, expense_amount, date, time}  = request.body;
  db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",[catogory_name, expense_name, expense_amount, date, time], (error, results) =>{
      if (error) {
          console.log(error);
        }
        else{
          console.log('spending added succesfully into the table')
        }
      });

      db.query(`UPDATE catogoryTable SET catogory_total=catogory_total+'${expense_amount}' WHERE catogory_name='${catogory_name}'` , (error, results) =>{
        if (error) {
            console.log(error);
          }
          else{
            console.log('successfully added catogory into the table')
          }
        });

        db.query(`UPDATE balanceTable SET balance_amount=balance_amount-'${expense_amount}'`, (error, results) =>{
          if (error) {
              console.log(error);
            }else {
              console.log("Balance updated successfully into the table");
            }
          });
});

app.get('/addspendings/date', (request, response) => {
  const date = request.query.date;
  db.query("SELECT * FROM spendingTable WHERE date = ?", [date], (error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        console.log('All spendings with given date are retrived successfully');
      }
  });
});

app.get('/addspendings/catogorytotal', (request, response) => {
  const catogory = request.query.catogory_name;
  db.query("SELECT SUM(spending_amount) AS catogoryTotal FROM spendingTable WHERE catogory_name = ?", [catogory], (error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        response.json(results[0].catogoryTotal);
        console.log('Catogory total has retrived successfully');
      }
  });
});

app.get('/addspendings/total', (request, response) => {
  db.query("SELECT SUM(spending_amount) AS total FROM spendingTable", (error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        response.json(results[0].total);
        console.log('Total amount has retrived successfully');
      }
  });
});

app.get('/addspendings', (request, response) => {
  db.query("SELECT * FROM spendingTable ORDER BY id ASC",(error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        console.log('All spendings are retrived successfully');
      }
  });
});




app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});