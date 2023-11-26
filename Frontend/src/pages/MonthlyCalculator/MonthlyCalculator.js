
import './MonthlyCalculator.css'
import {Alert, Button,Container,Stack} from "react-bootstrap";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CatogoryWindow from './CatogoryWindow';
import GraphWindow from './GraphWindow';
import HistoryWindow from './HistoryWindow';
import CatogoryBlocks from './CatogoryBlock';
import RemainingBalance from './RemainingBalance';
 




function MonthlyCalculator(){
    const[isCatogoryWindowOpen, setCatogoryWindowOpen] = useState(false);
    const[catogoryList, setCatogoryList] = useState([]);
    const openCatogoryWindow =()=>{
        setCatogoryWindowOpen(true);
    }
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


    useEffect(()=>{
        const getUpdatedCatogoryList= async()=>{
        const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
        const updatedcatogoryList = await catogoryListResponse.json();
        setCatogoryList(updatedcatogoryList);
        }
        getUpdatedCatogoryList();
    },[]);


    const[isGraphWindowOpen, setGraphWindowOpen] = useState(false);
    const openGraphWindow =()=>{
        setGraphWindowOpen(true);
    }
    const closeGraphWindow=()=>{
        setGraphWindowOpen(false)
    }


    const[isHistroyWindowOpen, setHistoryWindowOpen] = useState(false);
    const openHistoryWindow =()=>{
        setHistoryWindowOpen(true);
    }
    const closeHistoryWindow=()=>{
        setHistoryWindowOpen(false)
    }

    const[remainingBalance, setRemainingBalance]= useState('');
    const [isBalanceWindowOpen, setBalanceWindowOpen] = useState(false);
    const openBalanceyWindow =()=>{
        setBalanceWindowOpen(true);  
    }


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
    useEffect(()=>{
        const getUpdatedBalance= async()=>{
            const totalBalanceResponse = await fetch('http://localhost:4000/addbalance');
            const totalBalance = await totalBalanceResponse.json();
            setRemainingBalance(totalBalance);}
        getUpdatedBalance();
    
    },[]);



    
    


    return (
        <div className='monthlyCalculatorPage'>
        <Container style={{ alignItems:'center'}}>
                    <p className="expenseTitle">Manage Your Spendings </p>          
                    <Stack direction='horizontal' gap={3}>
                    <Button className='upperButtons' onClick={openCatogoryWindow}> Manage Catogories</Button>
                    < CatogoryWindow isWindowOpen={isCatogoryWindowOpen} windowClose={closeCatogoryWindow}/>
                    <Button className='upperButtons' onClick={openGraphWindow}>Graphs</Button>
                    <GraphWindow isWindowOpen={isGraphWindowOpen} windowClose={closeGraphWindow} />
                    <Button className='upperButtons'onClick={openHistoryWindow}>History</Button>   
                    <HistoryWindow isWindowOpen={isHistroyWindowOpen} windowClose={closeHistoryWindow}/>
                    <Button className='upperButtons' onClick={openBalanceyWindow}
                     style={{backgroundColor:'red'}}
                    >Remaining Balance: <h1>${remainingBalance}</h1> </Button>
                    <RemainingBalance isWindowOpen={isBalanceWindowOpen} windowClose={closeBalanceWindow}/>
                    
                </Stack>
                <p> Add Your Spendings According To Catogories</p><br></br>
                <div className='cardsPanel'>
                {catogoryList.map((catogoryElement)=>( 
                <CatogoryBlocks catogoryName={catogoryElement.catogory_name} total_spending={catogoryElement.catogory_total} /> ))}
                </div>
                
               
               
        </Container>

        
         </div>       
            
    )
}
export default MonthlyCalculator;
