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
      createIncomeTable();
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
    createIncomeTable();
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



//-------------------------------------------------------- Database tables for Monthly calculator-----------------------------------------------------------//



/**
 * Created catogoryTable which contains columes catogory_name and catogory_total to manage all catogories. Few catgories 
 *  has been added initially as fake data in order to create graphs. The queries to add initial data to the catogoryTable
 * has been commentted out in order to avoid further addition of same catogories.
 */
function createCatogoryTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS catogoryTable (id INT NOT NULL AUTO_INCREMENT,catogory_name VARCHAR(100) NOT NULL,catogory_total DOUBLE(10,2) NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        /**  
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['Monthly Grocery',610]);
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['Rent',600]);
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['Gym',696]);
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['Medicine',365]);
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['Vehicle',678]);
        db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",['School',576]) **/
        console.log("catogoryTable created successfully");
      }
    }
  );
}



/**
 *  POST method to add new catogory to the catogoryTable with catogory_total as 0
 */
app.post('/addcatogories', (request, response) => {
  const category  = request.body.catogory_name;
  db.query("INSERT INTO catogoryTable (catogory_name,catogory_total) VALUES (?,?)",[category,0.0], (error, results) =>{
      if (error) {
          console.log(error);
      }
      else{
          console.log('successfully added catogory into the table')
      }
    });
});



/**
 * POST method to delete catogory from the catogoryTable as well as to delete each entry from
 * spendingTable corresponding to given catogory
 */
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



/**
 * GET method to retrieve all catogories from catogoryTable along with their catogory_total 
 */
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



/**
 * Created balanceTable which contains colume balance_amount to manage remaining balance for the user. The 0 gets being added 
 * to the table as initial value for balance_amount as all POST requests to balanceTable updates the balance_amount instead 
 * of adding new amount to the balanceTable. The query to add initial amount to the table has commentted out to save further 
 * addition of 0 to the balanceTable.
 */
function createBalanceTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS balanceTable (id INT NOT NULL AUTO_INCREMENT,balance_amount DOUBLE(10,2) NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("balanceTable created successfully");
         /**  
        db.query(
          "INSERT INTO balanceTable (balance_amount) VALUES (0.0)",
          (error, results) => {
            if (error) {
              console.log(error);
            } 
            else {
              console.log("Balance 0 added successfully");
            }
          }
        );**/
      }
    }
  );
}



/**
 * GET method to retrive current/updated remaining balance (balance_amount) from the table
 */
app.get('/addbalance', (request, response) => {
  db.query("SELECT balance_amount FROM balanceTable" , (error, results) => {
      if (error){
          console.log(error);
      }
      else{
        response.json(results[0].balance_amount);
        console.log("Balance retrieved successfully");
      }
  });
});




/**
 * Created incomeTable which contains colume income_amount to manage incomes for the user. The 0 gets being added 
 * to the table as initial value for income_amount as all POST requests to incomeTable updates the income_amount instead 
 * of adding new amount to the incomeTable. The query to add initial amount to the table has commentted out to save further 
 * addition of 0 to the incomeTable.
 */
function createIncomeTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS incomeTable (id INT NOT NULL AUTO_INCREMENT,income_amount DOUBLE(10,2) NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } 
      else{
        console.log("incomeTable created successfully");
        /** 
        db.query(
          "INSERT INTO incomeTable (income_amount) VALUES (0.0)",
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Income 0 added successfully");
            }
          }
        );**/
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
    db.query(`UPDATE balanceTable SET balance_amount=balance_amount+'${balance}'`, (error, results) =>{
      if (error) {
          console.log(error);
        }
        else {
          console.log("Balance updated successfully into the table");
        }
    });
    db.query(`UPDATE incomeTable SET income_amount='${balance}'`, (error, results) =>{
        if (error) {
          console.log(error);
        }
        else{
          console.log("Income updated successfully into the table");
        }
    });
});



/**
 * GET method to retrieve income_amount from the incomeTable
 */
app.get('/addincome', (request, response) => {
  db.query("SELECT income_amount FROM incomeTable" , (error, results) => {
      if (error) {
          console.log(error);
      }
      else {
        response.json(results[0].income_amount);
        console.log("Balance retrieved successfully");
      }
  });
});




/**
 * Created spendingTable which contains columes catogory_name, expense_name, expense_amount, date and time to manage spendings for the user. 
 * The few  initial spendings has been added to the spendingTable as a fake data in order to create graph.The queries to add initial data to the table have
 * been  commentted out to save further addition of same data to the spendingTable.
 */
function createSpendingTable() {
  db.query(
    "CREATE TABLE IF NOT EXISTS spendingTable (id INT NOT NULL AUTO_INCREMENT, catogory_name VARCHAR(100) NOT NULL, expense_name VARCHAR(500) NOT NULL, expense_amount DOUBLE(10,2) NOT NULL, date VARCHAR(20) NOT NULL, time VARCHAR(20) NOT NULL, PRIMARY KEY (id))",
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        /** 
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',100, '10/27/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Rent', 'November',300, '10/27/2023', '2:02:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'Walmart',10, '11/28/2023', '5:02:00 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Drugstore',45, '10/29/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'Window Repair',150, '10/30/2023', '6:02:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Books',200, '10/30/2023', '11:02:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'Gas',100, '10/31/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Pens',15, '11/1/2023', '9:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Notebooks',100, '11/1/2023', '9:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Gym', 'Cloths',45, '11/2/2023', '5:02:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Gym', 'Shoes',150, '11/2/2023', '5:03:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMakert',80, '11/3/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'Gas',80, '11/5/2023', '9:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Fever',40, '11/5/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Rent', 'Home repair',300, '11/6/2023', '1:02:59 PM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',100, '10/7/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Drugstore',75, '11/8/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',94, '11/9/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'AC repair',60, '11/10/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Gym', 'Instruments',371, '11/11/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'Cisco',46, '11/12/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'Fresh Market',35, '11/13/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Parents medicine',160, '11/14/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Shoes',45, '11/15/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'gas',75, '11/16/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'gas',40, '11/17/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Gym', 'Member ship',100, '11/18/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',40, '11/19/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Cold',15, '11/20/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Bag',76, '11/21/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'Gas',73, '11/22/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'Safety kit',95, '11/23/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'SuperMarket',62, '11/24/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Drugstore',10, '11/24/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Vehicle', 'AC repair',100, '11/25/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Gym', 'cloths',30, '11/25/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Monthly Grocery', 'Supermarket',43, '11/26/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['Medicine', 'Pharmacy',20, '11/26/2023', '11:02:59 AM']);
        db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",['School', 'CardSheet Papers',45, '11/26/2023', '11:02:59 AM']);
        **/
        console.log("spendingTable created successfully");
      }
    }
  );
}




/**
 * POST method to add new spending to the spendingTable. The following method updates the catogory_total in the catogoryTable as well
 * as updates the balance_amount from balanceTable.
 */
app.post('/addspendings', (request, response) => {
    const {catogory_name, expense_name, expense_amount, date, time}  = request.body;
    db.query("INSERT INTO spendingTable (catogory_name, expense_name, expense_amount, date, time ) VALUES (?,?,?,?,?)",[catogory_name, expense_name, expense_amount,date, time], (error, results) =>{
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
        }
        else{
            console.log("Balance updated successfully into the table");
        }
    });
});



/**
 * GET method to retrieve all entries from the spendingTable catogorized by the date.
 */
app.get('/addspendings/date', (request, response) => {
  db.query(" SELECT date, SUM(expense_amount) AS total_spending FROM spendingTable GROUP BY date ORDER BY STR_TO_DATE(date,'%m/%d/%Y')", (error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        response.json(results);
        console.log('All spendings with given date are retrived successfully');
        console.log(response);
      }
  });
});




/**
 *  GET method to retrieve all entries from the spendingTable in the same order they have been added to the spendingTable
 */
app.get('/addspendings', (request, response) => {
  db.query("SELECT * FROM spendingTable ORDER BY id ASC",(error, results) => {
      if (error) {
          console.log(error);
      }
      else{
        response.json(results);
        console.log('All spendings are retrived successfully');
      }
  });
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------//


app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});