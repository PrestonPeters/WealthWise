import './MonthlyCalculator.css';
import Container from "react-bootstrap/Container"
import {Button,Stack}from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

function MonthlyCalculator(){
    return (
        <>
        <section>
            <div class="container-fluid">
            <Stack direction='horizontal' gap={2}>
                <Button className='upperButtons'> Manage Catogories</Button>
                <Button className='upperButtons'>Graphs</Button>            
                <Button className='upperButtons'>History</Button>     
            </Stack>
            <div className='mb-5'>
                <h1 className="expenseTitle">Manage Your Expenses </h1>
                <h2 className='infoExpense'> Add your Expenses according to catogories</h2> 
            </div>

            </div>
        </section>
   
        
        <br></br>
            
        

        
    </>
    )
}
    
    

export default MonthlyCalculator;