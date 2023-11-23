import './MonthlyCalculator.css';
<<<<<<< HEAD
import {Button,Container,Stack}from "react-bootstrap"
import { useState } from 'react';
=======
import {Button,Container,Stack} from "react-bootstrap";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> 21440f0f0bb38d0837954e00cac51671314ef590


function MonthlyCalculator(){


    return (
        <div>
               
                <div className='me-auto'>
                    <h1 className="expenseTitle">Manage Your Expenses </h1>
                    
                </div> 
                    <Stack direction='horizontal'>
                    <Button className='upperButtons' > Manage Catogories</Button>
                    <Button className='upperButtons'>Graphs</Button>
                    <Button className='upperButtons'>History</Button>   
                    </Stack>
                    
                <div>
                <h2 className='infoExpense'> Add your Expenses according to catogories</h2>
                </div>
                
           </div>
    )
}
    
    

export default MonthlyCalculator;