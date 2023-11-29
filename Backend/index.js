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


async function createDatabase() {
  db.query("CREATE DATABASE IF NOT EXISTS Tracker", async (err, result) => {
    if (err) {
      console.error("Error creating database: ", err);
      return;
    }
    console.log("Database 'Tracker' created or verified successfully");
    db.query("USE Tracker", async (err, result) => {
      if (err) {
        console.error("Error using database: ", err);
        return;
      }
      console.log("Using database 'Tracker'");
      createUserTable();
      createtransactionTable(); 
      createCategoryTable();
      createBalanceTable();
      createIncomeTable();
      createSpendingTable();
    });
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



//-------------------------------------------------------- Database tables for Monthly calculator-----------------------------------------------------------//



/**
 * Created categoryTable which contains columes category_name and category_total to manage all categories. Few catgories 
 *  has been added initially as fake data in order to create graphs. The queries to add initial data to the categoryTable
 * has been commentted out in order to avoid further addition of same categories.
 */
function createCategoryTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS categoryTable (id INT NOT NULL AUTO_INCREMENT,category_name VARCHAR(100) NOT NULL,category_total DOUBLE(10,2) NOT NULL, PRIMARY KEY (id), username VARCHAR(255) NOT NULL)",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        /**
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['Monthly Grocery',610, 'Test']);
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['Rent',600, 'Test']);
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['Gym',696, 'Test']);
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['Medicine',365, 'Test']);
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['Vehicle',678, 'Test']);
        db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",['School',576, 'Test']); 
        console.log("categoryTable created successfully");
        */
      }
    }
  );
}



/**
 *  POST method to add new category to the categoryTable with category_total as 0
 */
app.post('/addcategories', (request, response) => {
  const category  = request.body.category_name;
  const username = request.body.username;
  db.query("INSERT INTO categoryTable (category_name,category_total,username) VALUES (?,?,?)",[category,0.0, username], (error, results) =>{
      if (error) {
          console.log(error);
          response.status(500).json([]);
      }
      else{
          console.log('successfully added category into the table')
          response.status(200).json([]);
      }
    });
});



/**
 * POST method to delete category from the categoryTable as well as to delete each entry from
 * spendingTable corresponding to given category
 */
app.post('/addcategories/delete', (request, response) => {
    const category  = request.body.category_name;
    const username = request.body.username;
    db.query(`DELETE FROM categoryTable WHERE category_name='${category}' AND username='${username}'`, (error, results) =>{
        if (error) {
            console.log(error);
        }
        else{
            console.log('successfully deleted category from the table');
        }
    });
    db.query(`DELETE FROM spendingTable WHERE category_name='${category}' AND username='${username}'`, (error, results) =>{
        if (error) {
            console.log(error);
            response.status(500).json([]);
        }
        else{
            console.log('successfully deleted category from the table');
            response.status(200).json(results);
        }
    });     
});



/**
 * POST method to retrieve all categories from categoryTable along with their category_total 
 */
app.post('/getcategories', (request, response) => {
  const username = request.body.username;
  console.log("Getting categories");
  console.log(username);
  db.query(`SELECT category_name,category_total FROM categoryTable WHERE username='${username}'`, (error, results) => {
      if (error) {
          console.log(error);
          response.status(500).json([]);
      }
      else{
        response.status(200).json(results);
        console.log('Retrieved all categories successfully');
      }
  });
});



/**
 * Created balanceTable which contains colume balance_amount to manage remaining balance for the user. The 0 gets being added 
 * to the table as initial value for balance_amount as all POST requests to balanceTable updates the balance_amount instead 
 * of adding new amount to the balanceTable. The query to add initial amount to the table has commentted out to save further 
 * addition of 0 to the balanceTable.
 */
function createBalanceTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS balanceTable (id INT NOT NULL AUTO_INCREMENT,balance_amount DOUBLE(10,2) NOT NULL, PRIMARY KEY (id), username VARCHAR(255) NOT NULL)",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("balanceTable created successfully");
        /**
        db.query(
          "INSERT INTO balanceTable (balance_amount,username) VALUES (0.0, 'Test')",
          (error, results) => {
            if (error) {
              console.log(error);
            } 
            else {
              console.log("Balance 0 added successfully");
            }
          }
        );
        */
      }
    }
  );
}



/**
 * POST method to retrive current/updated remaining balance (balance_amount) from the table
 */
app.post('/getbalance', (request, response) => {
  console.log("Getting balance...");
  const username = request.body.username;
  db.query(`SELECT balance_amount FROM balanceTable WHERE username='${username}'` , (error, results) => {
      if (error){
          console.log(error);
      }
      else{
        if (results[0]) {
          response.status(200).json(results[0].balance_amount);
          console.log("Balance retrieved successfully");
        }

        else {
          response.status(200).json(0);
          console.log("Balance retrieved successfully");
        }
      }
  });
});




/**
 * Created incomeTable which contains colume income_amount to manage incomes for the user. The 0 gets being added 
 * to the table as initial value for income_amount as all POST requests to incomeTable updates the income_amount instead 
 * of adding new amount to the incomeTable. The query to add initial amount to the table has commentted out to save further 
 * addition of 0 to the incomeTable.
 */
async function createIncomeTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS incomeTable (id INT NOT NULL AUTO_INCREMENT,income_amount DOUBLE(10,2) NOT NULL, PRIMARY KEY (id), username VARCHAR(255) NOT NULL)",
    (error, results) => {
      if (error) {
        console.log(error);
      } 
      else{
        console.log("incomeTable created successfully");
        /**
        db.query(
          "INSERT INTO incomeTable (income_amount,username) VALUES (0.0, 'Test')",
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Income 0 added successfully");
            }
          }
        );
        */
      }
    }
  );

}




/**
 * POST method to update the balance_amount in the balanceTable as well as income_amount in the incomeTable.
 * Following method add the new income of the user to the remaining balance as well as updates the  incomeTable
 * by replacing the previous income_amount with the new income.
 */
app.post('/addincome', (request, response) => {
   const balance  = request.body.income_amount;
   const username = request.body.username;

  db.query("SELECT * FROM incomeTable WHERE username = ?", [username], async (err, results) => {
      if (err) {console.log(err);}
      else if (results.length === 0) await addIncome(username);
      db.query(`UPDATE balanceTable SET balance_amount=balance_amount+'${balance}' WHERE username='${username}'`, (error, results) =>{
        if (error) {
          console.log(error);
          response.status(500).json([]);
        }
        else {
          console.log("Balance updated successfully into the table");
          db.query(`UPDATE incomeTable SET income_amount='${balance}' WHERE username='${username}'`, (error, results) =>{
            if (error) {
              console.log(error);
              response.status(500).json([]);
            }
            else {
              console.log("Income updated successfully into the table");
              response.status(200).json([]);
            }
        });
        }
      });
    });
  });

async function addIncome(username) {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO incomeTable (income_amount,username) VALUES (0.0, '${username}')`,
    (error, results) => {
      if (error) {
        console.log(error);
        reject();
      } else console.log("Income 0 added successfully");
    });

    db.query(`INSERT INTO balanceTable (balance_amount,username) VALUES (0.0, '${username}')`,
    (error, results) => {
      if (error) {
        console.log(error);
        reject();
      } else {
        console.log("Balance 0 added successfully");
        resolve();
      }
    });
  }
  );
}

/**
 * POST method to retrieve income_amount from the incomeTable
 */
app.post('/getincome', (request, response) => {
  console.log("Getting income...")
  const username = request.body.username;
  db.query(`SELECT income_amount FROM incomeTable WHERE username='${username}'` , (error, results) => {
      if (error) {
          console.log(error);
          response.status(500).json([]);
      }
      else {
        if (results[0]) {
          console.log("Income retrieved successfully");
          response.status(200).json(results[0].income_amount);
        }

        else {
          console.log("Income retrieved successfully");
          response.status(200).json(0);
        }
      }
  });
});




/**
 * Created spendingTable which contains columes category_name, expense_name, expense_amount, date and time to manage spendings for the user. 
 * The few  initial spendings has been added to the spendingTable as a fake data in order to create graph.The queries to add initial data to the table have
 * been  commentted out to save further addition of same data to the spendingTable.
 */
function createSpendingTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS spendingTable (id INT NOT NULL AUTO_INCREMENT, category_name VARCHAR(100) NOT NULL, expense_name VARCHAR(500) NOT NULL, expense_amount DOUBLE(10,2) NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(20) NOT NULL, PRIMARY KEY (id), username VARCHAR(255) NOT NULL)",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
         
        /**
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',100, '10/27/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Rent', 'November',300, '10/27/2023', '2:02:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'Walmart',10, '11/28/2023', '5:02:00 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Drugstore',45, '10/29/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'Window Repair',150, '10/30/2023', '6:02:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Books',200, '10/30/2023', '11:02:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'Gas',100, '10/31/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Pens',15, '11/1/2023', '9:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Notebooks',100, '11/1/2023', '9:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Gym', 'Cloths',45, '11/2/2023', '5:02:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Gym', 'Shoes',150, '11/2/2023', '5:03:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMakert',80, '11/3/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'Gas',80, '11/5/2023', '9:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Fever',40, '11/5/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Rent', 'Home repair',300, '11/6/2023', '1:02:59 PM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',100, '10/7/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Drugstore',75, '11/8/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',94, '11/9/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'AC repair',60, '11/10/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Gym', 'Instruments',371, '11/11/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'Cisco',46, '11/12/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'Fresh Market',35, '11/13/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Parents medicine',160, '11/14/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Shoes',45, '11/15/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'gas',75, '11/16/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'gas',40, '11/17/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Gym', 'Member ship',100, '11/18/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',40, '11/19/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Cold',15, '11/20/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Bag',76, '11/21/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'Gas',73, '11/22/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'Safety kit',95, '11/23/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',62, '11/24/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Drugstore',10, '11/24/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Vehicle', 'AC repair',100, '11/25/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Gym', 'cloths',30, '11/25/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Monthly Grocery', 'Supermarket',43, '11/26/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['Medicine', 'Pharmacy',20, '11/26/2023', '11:02:59 AM', 'Test']);
        db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",['School', 'CardSheet Papers',45, '11/26/2023', '11:02:59 AM', 'Test']);
        */
        console.log("spendingTable created successfully");
      }
    }
  );
}




/**
 * POST method to add new spending to the spendingTable. The following method updates the category_total in the categoryTable as well
 * as updates the balance_amount from balanceTable.
 */
app.post('/addspendings', (request, response) => {
    const {category_name, expense_name, expense_amount, date, time, username}  = request.body;
    db.query("INSERT INTO spendingTable (category_name, expense_name, expense_amount, date, time, username ) VALUES (?,?,?,?,?,?)",[category_name, expense_name, expense_amount,date, time, username], (error, results) =>{
        if (error) {
          console.log(error);
          response.status(500).json([]);
        }
        else{
          console.log('spending added succesfully into the table');
          db.query(`UPDATE categoryTable SET category_total=category_total+'${expense_amount}' WHERE category_name='${category_name}' AND username='${username}'` , (error, results) =>{
            if (error) {
                console.log(error);
                response.status(500).json([]);
            }
            else{
                console.log('successfully added category into the table')
                db.query(`UPDATE balanceTable SET balance_amount=balance_amount-'${expense_amount}' WHERE username='${username}'`, (error, results) =>{
                  if (error) {
                      console.log(error);
                      response.status(500).json([]);
                  }
                  else{
                      console.log("Balance updated successfully into the table");
                      response.status(200).json([]);
                  }
              });
            }
        });
        }
    });
});



/**
 * POST method to retrieve all entries from the spendingTable categorized by the date.
 */
app.post('/getspendings/date', (request, response) => {
  const username = request.body.username;
  db.query(`SELECT date, SUM(expense_amount) AS total_spending FROM spendingTable WHERE username='${username}' GROUP BY date ORDER BY STR_TO_DATE(date,'%m/%d/%Y') DESC LIMIT 7`, (error, results) => {
      if (error) {
          console.log(error);
          response.status(500).json([]);
      }
      else{
        if (results[0]) {
          console.log('All spendings with given date are retrived successfully');
          response.status(200).json(results);
        }

        else {
          console.log('All spendings with given date are retrived successfully');
          response.status(200).json([]);
        }
      }
  });
});




/**
 *  POST method to retrieve all entries from the spendingTable in the same order they have been added to the spendingTable
 */
app.post('/getspendings', (request, response) => {
  const username = request.body.username;
  db.query(`SELECT * FROM spendingTable WHERE username='${username}' ORDER BY id ASC`,(error, results) => {
      if (error) {
          console.log(error);
          response.status(500).send('Error retrieving transactions');
      }
      else{
        if (results[0]) {
          response.status(200).json(results);
          console.log('All spendings are retrived successfully');
        }

        else {
          response.status(200).json([]);
          console.log('All spendings are retrived successfully');
        
        }
      }
  });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------//


app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});