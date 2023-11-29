import { useState } from "react";
import { Button, Form, Modal, Stack, ModalFooter } from "react-bootstrap";




/**
 * The following function create the visual components of remamining balance window where user can input their income
 * or deposite amount. After receving input from the user, function updates the value of remaining balance.
 * @param param0 - isWindowOpen is a state variable which informs the following function whether the button to open the remaining balance window
 * has clicked or not.
 * @param param1 - windowClose is a callback function which closes the remaining balance window.
 * @returns It returns the visual contents of the remaining balance window which contains Form.
 */
function RemainingBalance({isWindowOpen ,windowClose}){
        /**
         * Variable to store the input income
         */
        const [inputIncome, setIncome]= useState('');
        

        /**
         * The following clears the input box and closes the remaining balance window
         */
        const closeIncomeWindow=()=>{
            setIncome('');
            windowClose();
        }


        /**
         * The following function saves the input income of the user in the databse as well as updates the  
         * value of reamaining balance. After successfull completion of above tasks, function clears the input box and 
         * closes the remaining balance window.
         */
        const saveIncome =()=>{
            if(inputIncome.length===0 || inputIncome<=0 || isNaN(inputIncome) ){
                alert('Please Input Valid amount ');
                return;
            } 
            fetch('http://localhost:4000/addincome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({income_amount: inputIncome}),
            })
            .then((response)=>{  
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            setIncome('');
            windowClose();
        }


        /**
         * Following code contains react boostrap componenets to create visual contents of remaining balance, which allow user to 
         * input their income and save it to the database.
         */
        return(
            <Modal show={isWindowOpen} onHide={windowClose} centered>
                <Form>
                    <Modal.Header style={{fontWeight:'bold'}}> Add Your This Month's Income </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label> Income </Form.Label>             
                            <Form.Control
                                type="number"
                                required 
                                value={inputIncome}
                                placeholder="i.e $7000.00"
                                onChange={(income)=>setIncome(income.target.value)}/>
                        </Form>
                    </Modal.Body>
                    <ModalFooter>
                        <Stack direction="horizontal" gap={2}>
                            <Button onClick={saveIncome}>Save</Button>
                            <Button onClick={closeIncomeWindow}>Cancel</Button>
                        </Stack>
                    </ModalFooter>
                </Form>
            </Modal>           
    )
}

export default RemainingBalance;