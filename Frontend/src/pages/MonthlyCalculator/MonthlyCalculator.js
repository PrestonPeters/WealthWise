import './MonthlyCalculator.css'
import {Button,Container,Stack} from "react-bootstrap";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CatogoryWindow from './CatogoryWindow';
import GraphWindow from './GraphWindow';
import HistoryWindow from './HistoryWindow';
import CatogoryBlocks from './CatogoryBlock';
import RemainingBalance from './RemainingBalance';



function MonthlyCalculator(){
    const[isCatogoryWindowOpen, setCatogoryWindowOpen] = useState(false);
    const openCatogoryWindow =()=>{
        setCatogoryWindowOpen(true);
    }
    const closeCatogoryWindow=()=>{
        setCatogoryWindowOpen(false)
    }

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

    const [catogoryArray, setCatogoryArray] = useState([]);
    const addNewCatogory =(newCatogoryName)=>{
        setCatogoryArray([...catogoryArray,newCatogoryName]);
    }
    const[isBalanceWindowOpen, setBalanceWindowOpen] = useState(false);
    const openBalanceyWindow =()=>{
        setBalanceWindowOpen(true);
    }
    const closeBalanceWindow=()=>{
        setBalanceWindowOpen(false)
    }


    const[remainingBalance, setRemainingBalance]= useState('0');
    const[colour, changeColour]=useState('');
    const showBalance=(input)=>{
       
        setRemainingBalance((remainingBalance) => Number(remainingBalance) +Number(input));
        buttonColour();
    
    }
    const buttonColour =()=>{
        if(Number(remainingBalance)>=0){
                changeColour('red');
        }
    }

   
    


    return (
        <>
        <Container style={{overflowY:'auto'}}>

                <div className='me-auto'>
                    <p className="expenseTitle">Manage Your Expenses </p>
                    <p> Add Your Expenses According To Catogories</p> 
                      
                </div>
                
                <Stack direction='horizontal' style={{padding:'3%'}}>
                    <Button className='upperButtons' onClick={openCatogoryWindow}> Manage Catogories</Button>
                    < CatogoryWindow isWindowOpen={isCatogoryWindowOpen} windowClose={closeCatogoryWindow} addingNewcatogory={addNewCatogory}/>
                    <Button className='upperButtons' onClick={openGraphWindow}>Graphs</Button>
                    <GraphWindow isWindowOpen={isGraphWindowOpen} windowClose={closeGraphWindow} />
                    <Button className='upperButtons'onClick={openHistoryWindow}>History</Button>   
                    <HistoryWindow isWindowOpen={isHistroyWindowOpen} windowClose={closeHistoryWindow}/>
                    <Button className='upperButtons' onClick={openBalanceyWindow}
                     style={{backgroundColor:buttonColour ? colour:''}}
                    >Remaining Balance: <h1>${remainingBalance}</h1> </Button>
                    <RemainingBalance isWindowOpen={isBalanceWindowOpen} windowClose={closeBalanceWindow} showRemainingBalance={showBalance} />
                    
                </Stack>
                {catogoryArray.map((catogoryName)=>( <CatogoryBlocks catogoryKey={catogoryName} catogoryName={catogoryName} total={0} /> ))}
               
               
        </Container>

        
         </>       
                
    )
}
export default MonthlyCalculator;