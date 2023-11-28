
import './MonthlyCalculator.css'
import {Button,Container,Stack} from "react-bootstrap";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CatogoryWindow from './CatogoryWindow';
import GraphWindow from './GraphWindow';
import HistoryWindow from './HistoryWindow';
import CatogoryBlocks from './CatogoryBlock';
import RemainingBalance from './RemainingBalance';
 



/**
 * The following function creates visual componenets of the web page.
 */
function MonthlyCalculator(){
        /**
         * Variables to determine state of the componenets.
         */
        const[isCatogoryWindowOpen, setCatogoryWindowOpen] = useState(false);
        const[isGraphWindowOpen, setGraphWindowOpen] = useState(false);
        const[isHistroyWindowOpen, setHistoryWindowOpen] = useState(false);
        const[isBalanceWindowOpen, setBalanceWindowOpen] = useState(false);

        
        /**
         * Variables to store data
         */
        const[catogoryList, setCatogoryList] = useState([]);
        const[remainingBalance, setRemainingBalance]= useState(0);
        const[lastIncome, setLastIncome]=useState(0);


        /**
         *  Following functions retrieve all the catogories from the database to create catogory blocks for each catogory,
         *  everytime the webpage is loaded. 
         */
        useEffect(()=>{
            const getUpdatedCatogoryList= async()=>{
            const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
            const updatedcatogoryList = await catogoryListResponse.json();
            setCatogoryList(updatedcatogoryList);
            }
            getUpdatedCatogoryList();
        },[]);


        /**
         * The following function retrives the value of remaining balance from the database everytime webpage is loaded.
         */
        useEffect(()=>{
            const getUpdatedBalance= async()=>{
                const totalBalanceResponse = await fetch('http://localhost:4000/addbalance');
                const totalBalance = await totalBalanceResponse.json();
                setRemainingBalance(totalBalance);}
            const getIncomeBalance=async()=>{
                const totalIncomeResponse = await fetch('http://localhost:4000/addincome');
                const totalIncome = await totalIncomeResponse.json();
                setLastIncome(totalIncome);
            }
            getUpdatedBalance();
            getIncomeBalance();
        },[]);
    

        /**
         *  The following function opens the catogory window where user can add or delete catogory.
         */
        const openCatogoryWindow =()=>{
            setCatogoryWindowOpen(true);
        }


        /**
         *  Following functions closes the catogory window and retrieves all the catogories from the database to update the number of
         *  catogory blocks on the webpage, as user are allowed to add and remove catogories from table.
         */
        const closeCatogoryWindow =()=>{
            setCatogoryWindowOpen(false);
            const getUpdatedCatogoryList= async()=>{
            const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
            const updatedcatogoryList = await catogoryListResponse.json();
            setCatogoryList(updatedcatogoryList);
            }
            setTimeout(()=>{
                getUpdatedCatogoryList();
            },0);
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
            setBalanceWindowOpen(true);  
        }


        /**
         * Following function closes the balance window and update the value of remaining balance.
         */
        const closeBalanceWindow =()=>{
            setBalanceWindowOpen(false);
            const getUpdatedBalance= async()=>{
            const totalBalanceResponse = await fetch('http://localhost:4000/addbalance');
            const totalBalance = await totalBalanceResponse.json();
            setRemainingBalance(totalBalance);
            }
            setTimeout(()=>{
                getUpdatedBalance();
            },0);
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
                        <Button className='upperButtons' onClick={openCatogoryWindow}> Manage Catogories</Button>
                        <CatogoryWindow isWindowOpen={isCatogoryWindowOpen} windowClose={closeCatogoryWindow}/>
                        <Button className='upperButtons' onClick={openGraphWindow}>Graphs</Button>
                        <GraphWindow isWindowOpen={isGraphWindowOpen} windowClose={closeGraphWindow} />
                        <Button className='upperButtons'onClick={openHistoryWindow}>History</Button>   
                        <HistoryWindow isWindowOpen={isHistroyWindowOpen} windowClose={closeHistoryWindow}/>
                        <Button className='upperButtons' onClick={openBalanceyWindow}style={{color:'black',  
                            backgroundColor:(remainingBalance==0)?'red':
                            ((lastIncome/2)<=remainingBalance)?'#38cf17':
                            ((lastIncome/2)>remainingBalance && (lastIncome/4)<=remainingBalance )?'#fcf403':'red'}}>
                                Remaining Balance: <h1>${remainingBalance}</h1> 
                        </Button>
                        <RemainingBalance isWindowOpen={isBalanceWindowOpen} windowClose={closeBalanceWindow}/>    
                    </Stack>
                    <p> Add Your Spendings According To Catogories</p><br></br>
                    <div className='cardsPanel'>
                        {catogoryList.map((catogoryElement)=>(<CatogoryBlocks catogoryName={catogoryElement.catogory_name} total_spending={catogoryElement.catogory_total} /> ))}
                    </div>
                </Container>
           </div>         
    )
}
export default MonthlyCalculator;
