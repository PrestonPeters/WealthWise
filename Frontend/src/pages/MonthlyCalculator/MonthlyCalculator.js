import './MonthlyCalculator.css'
import {Button,Container,Stack} from "react-bootstrap";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';



function MonthlyCalculator(){
    return (
        <Container>
                <Stack direction='horizontal'>
                    <Button className='upperButtons' > Manage Catogories</Button>
                    <Button className='upperButtons'>Graphs</Button>
                    <Button className='upperButtons'>History</Button>   
                </Stack>
                <div className='me-auto'>
                    <h1 className="expenseTitle">Manage Your Expenses </h1>
                    <h2> Add Your Expenses According To Catogories</h2>             
                </div> 
        </Container>
                
                
    )
}
    
    

export default MonthlyCalculator;