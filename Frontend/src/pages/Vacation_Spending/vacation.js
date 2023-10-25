import React, { useState } from 'react';
import './vacation.css';


function Vacation(){
    const [budget, setBudget] = useState('');       //Variable for budget
    const [expenseName, setName] = useState('');    //variable for expense name
    const [expenseAmount, setAmount] = useState('');  //varaible for expense amount
    const [expenses, setExpenses] = useState([]);    //array of all the expenses added
    const [remainingBudget, setRemainingBudget] = useState(''); //variable for remaining budget
    const [expenseNameToDelete, setExpenseNameToDelete] = useState(''); //variable to delete the expense
    const [expenseTotal, setTotal] = useState('');    //varible for the total of all the expenses
  
    /**
     * This function checks for valid input for the input given by the user
     */
  const validateInput = (value) => {
    if (value <= 0 || value === null ) {
      alert("Enter a Valid Input");
      setTotal('');
      setBudget('');
      return null;
    }
    return value;
  }

  /** This function is used to the set the remaining budget to main budget limit for the initial stage
   * calculates the budget status and total simuntaneously
   */
    const validateBudget = () => {

      if(budget === null || budget === 0)
      {
        setRemainingBudget('');
        setTotal('')
      }
      else{
      setRemainingBudget(budget);
      calculateTotalExpenses();
      }
      } 

  /** This function handle the expenses entered by the user and checks if they are valid 
     * or not and displays an error message according to that
     * Case 1: input is valid:
     *      checks whether the input falls under the budget or not
     * Case 2: When the input is invalid:
     *      Display an error message
     */
  const validateExpense = () => { //setting the remaining budget limit
    if (parseFloat(expenseAmount) > 0 ){
        if(remainingBudget >= expenseAmount){
            setTotal(expenseAmount);
            //addition of expense and amount to the expenses array
            setExpenses([...expenses, {name: expenseName, amount: parseFloat(expenseAmount)}]);
            budgetUpdate();
            setTotal(expenseTotal + expenseAmount);
        }
        else{
            alert("Expense is too expensive for the budegt");
        }
    }
        else{
          setAmount('')
         alert("Enter a  Valid amount");
        }
    }
    
    /** This fucntion is used to update the remaining budget after the addtion of an expense
     * 
     */
    
    const budgetUpdate = () => {
        let updatebuget = parseFloat(remainingBudget) - parseFloat(expenseAmount);
        setRemainingBudget(updatebuget); //the sum of the budget used till now
    }

    const deleteExpense = () => {
    //searching for the right expense to be deleted
    let expenseToDelete = expenses.find((expense) => expense.name === expenseNameToDelete);
    //searching for the amount to be deleted
        let deletedAmount;
        if (expenseToDelete) {
        deletedAmount = expenseToDelete.amount;
        } 
        else {
        deletedAmount = 0;
        alert("Check the expense, it doesn't exist"); //displys an erro when expense doesn't exist
        }
        //calculation of the new remaining budget
        let newbugetremaining = remainingBudget + deletedAmount;
        setRemainingBudget(newbugetremaining);
        //updating the expenses array
        const newarray = expenses.filter((expense) => expense.name !== expenseNameToDelete); 
        let newtotal = expenseTotal - deletedAmount;
        setTotal(newtotal);
        setExpenses(newarray);
        setExpenseNameToDelete('');
  }

    

    /** This function returns the total of all the expenses
     * 
     * @returns Sum of all the expenses
     */
    const calculateTotalExpenses = () => {
        setTotal(expenses.reduce((sum, expense) => sum + expense.amount, 0));
        return expenseTotal;
      }
    
    
    /* This fucntion resets all the inputs given to the calculator 
    */
    const resetExpenses = () => {
        setExpenses([]); //deleting all the saved expenses
        setName('');    //deleting the name of expense
        setBudget('');   //deleting the budget
        setAmount('');   //deleting the amount of the expense to zero
        setRemainingBudget('');
        setExpenseNameToDelete('')
        setTotal('');
    }

return(

  <div className="Vacation">
        <h1>Vacation Spending Calculator</h1>
        <div>
          <label className='budget-label' for = "budget">Set Your Budget:
          </label>
          <input type="number" id="budget"
                placeholder="Enter your budget"
                value={budget}
                onChange={e => setBudget(validateInput(parseFloat(e.target.value)))}/>
            <button id="set-budget" onClick={validateBudget}>Set Budget</button>
        </div>
          <div>
          <label className ="expense-label" for="expense-name">Expense Name:</label>
        <input
        type="text"
         id="expense-name"
        placeholder="Enter expense name"
        value={expenseName}
        onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div>
          <label className='expense-amount' for ="expense-amount "> Expense Amount:
          </label>
          <input type="number"
                    id="expense-amount"
                    placeholder="Enter expense amount"
                    value={expenseAmount}
                    onChange={(e) => setAmount((validateInput(parseFloat(e.target.value))))}/>
          <button id="add-expense" onClick={validateExpense}>Add Expense</button>
        </div>
        <div>
        <label className='delete-label' for = "delete-expense">Expense To Delete:</label>
        <input type="text" id = "delete-expense" placeholder="Name of expense" value={expenseNameToDelete} onChange={(e) => setExpenseNameToDelete(e.target.value)}/>
        <button id="delete-button" onClick={deleteExpense}>Delete Expense</button>
        </div>
        <div>
        <button id="reset-button" onClick={resetExpenses}>Reset</button>
        </div>
        <div>
        <label className='total-label' for = "total">Your Total Spending is: $ {expenseTotal} </label>
        </div>
        <div>
        <label className = 'print-label' for = "budget">You still have ${remainingBudget} to spend</label>
        </div>   
        <br></br>
        <div>
        <table>
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.name}</td>
                  <td>${expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </div>
     
);
}

export default Vacation;
