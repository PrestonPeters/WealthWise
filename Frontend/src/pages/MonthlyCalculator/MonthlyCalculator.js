
import './MonthlyCalculator.css'
import {Button,Container,Stack} from "react-bootstrap";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryWindow from './CategoryWindow';
import GraphWindow from './GraphWindow';
import HistoryWindow from './HistoryWindow';
import CategoryBlocks from './CategoryBlock';
import RemainingBalance from './RemainingBalance';
 



/**
 * The following function creates visual componenets of the web page.
 */
function MonthlyCalculator({username}){
        /**
         * Variables to determine state of the componenets.
         */
        const[isCategoryWindowOpen, setCategoryWindowOpen] = useState(false);
        const[isGraphWindowOpen, setGraphWindowOpen] = useState(false);
        const[isHistroyWindowOpen, setHistoryWindowOpen] = useState(false);
        const[isBalanceWindowOpen, setBalanceWindowOpen] = useState(false);
        const[fetchAgain, setFetchAgain] = useState(false);

        
        /**
         * Variables to store data
         */
        const[categoryList, setCategoryList] = useState([]);
        const[remainingBalance, setRemainingBalance]= useState(0);
        const[lastIncome, setLastIncome]=useState(0);


        /**
         * The following function retrives the value of remaining balance from the database everytime webpage is loaded.
         */
    
        useEffect(()=>{
            console.log("Fetching balance...");
            if (username === '') return;
            fetch('http://localhost:4000/getbalance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username:username}),
                })

                .then((response)=>{
                    console.log("Got response for balance.");
                    if (response.status !== 500) return response.json();
                    else return [];
                })

                .then((data)=>{setRemainingBalance(data);})
                .catch((error)=>{console.log(error);});
            }, [fetchAgain, username]);
        

        /**
         * The following function retrives the value of last income from the database everytime webpage is loaded.
         */
        useEffect(()=>{
            console.log("Fetching income...");
            fetch('http://localhost:4000/getincome', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username:username}),
                })

                .then((response)=>{
                    console.log("Got response for income.");
                    return response.json();
                })
                .then((data)=>{setLastIncome(data);})
                .catch((error)=>{console.log(error);});
            }, [fetchAgain, username]);
        

        
        /**
         *  Following functions retrieve all the categories from the database to create category blocks for each category,
         *  everytime the webpage is loaded. 
         */
        useEffect(()=>{
            console.log("Fetching categories...");
            fetch('http://localhost:4000/getcategories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username:username}),
                })

                .then((response)=>{
                    console.log("Got response for categories.");
                    if (response.status !== 500) return response.json();
                    else return [];
                })

                .then((data)=>{
                    console.log(data);
                    setCategoryList(data);
                })
                .catch((error)=>{console.log(error);});
        }, [fetchAgain, username]);

        /**
         *  The following function opens the category window where user can add or delete category.
         */
        const openCategoryWindow =()=>{
            setFetchAgain(!fetchAgain);
            setCategoryWindowOpen(true);
        }


        /**
         *  Following functions closes the category window and retrieves all the categories from the database to update the number of
         *  category blocks on the webpage, as user are allowed to add and remove categories from table.
         */
        const closeCategoryWindow =()=>{
            setFetchAgain(!fetchAgain);
            setCategoryWindowOpen(false);
        }
        

        /**
         *  Following functions opens the graph window where user can see visualization of their spendings.
         */
        const openGraphWindow =()=>{
            setGraphWindowOpen(true);
        }


        /**
         * Following functions closes the graph window. 
         */
        const closeGraphWindow=()=>{
            setGraphWindowOpen(false)
        }


        /**
         *  Following functions opens the history window where user can see the history of their spendings.
         */
        const openHistoryWindow =()=>{
            setHistoryWindowOpen(true);
        }


       /**
        *  Following functions closes the history window 
        */
        const closeHistoryWindow=()=>{
            setHistoryWindowOpen(false)
        }


       /**
        *   Following functions opens the balance window where user can input their income or deposite amount
        */
        const openBalanceyWindow =()=>{
            setFetchAgain(!fetchAgain);
            setBalanceWindowOpen(true);  
        }


        /**
         * Following function closes the balance window and update the value of remaining balance.
         */
        const closeBalanceWindow =()=>{
            setFetchAgain(!fetchAgain);
            setBalanceWindowOpen(false);
        }

        /**
         * The following code contains react boostrap componenets to create visual contents of the webpage. It uses condition statement 
         * to update the background colour of remaining balance button, while other buttons have default background colour. The conditional
         * colourization of the remaning balance button is used to alert the user reagrding their remaining balance.If the remaining balance 
         * is greater than the half amount of their previously added income, buttons show background colour green. If the remaining balance 
         *  is less than half amount of their previously added income but greater than 25% of their previously added income, buttons show background 
         * colour yellow, otherwise red.
         */
        return (
            <div className='monthlyCalculatorPage'>
                <Container style={{ alignItems:'center'}}>
                    <p className="expenseTitle"> Manage Your Spendings </p>          
                    <Stack direction='horizontal' gap={3}>
                        <Button className='upperButtons' onClick={openCategoryWindow}> Manage Categories</Button>
                        <CategoryWindow isWindowOpen={isCategoryWindowOpen} windowClose={closeCategoryWindow} username={username}/>
                        <Button className='upperButtons' onClick={openGraphWindow}>Graphs</Button>
                        <GraphWindow isWindowOpen={isGraphWindowOpen} windowClose={closeGraphWindow} username={username}/>
                        <Button className='upperButtons'onClick={openHistoryWindow}>History</Button>   
                        <HistoryWindow isWindowOpen={isHistroyWindowOpen} windowClose={closeHistoryWindow} username={username}/>
                        <Button className='upperButtons' onClick={openBalanceyWindow}style={{color:'black',  
                            backgroundColor:(remainingBalance===0)?'red':
                            ((lastIncome/2)<=remainingBalance)?'#38cf17':
                            ((lastIncome/2)>remainingBalance && (lastIncome/4)<=remainingBalance )?'#fcf403':'red'}}>
                                Remaining Balance: <h1>${remainingBalance}</h1> 
                        </Button>
                        <RemainingBalance isWindowOpen={isBalanceWindowOpen} windowClose={closeBalanceWindow} username={username}/>    
                    </Stack>
                    <p> Add Your Spendings According To Categories</p><br></br>
                    <div className='cardsPanel'>
                        {categoryList.map((categoryElement)=>(<CategoryBlocks categoryName={categoryElement.category_name} total_spending={categoryElement.category_total} username={username}/> ))}
                    </div>
                </Container>
            </div>         
        )
}
export default MonthlyCalculator;
