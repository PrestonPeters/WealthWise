import { useState } from "react";
import { Button, Card, Form, Modal, Stack, ModalFooter } from "react-bootstrap";

function RemainingBalance({isWindowOpen ,windowClose}){
    const [inputIncome, setIncome]= useState('');
    const saveIncome =()=>{
        if(inputIncome.length===0 || inputIncome<=0 || isNaN(inputIncome)){
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
   

    return(
        <>
        <Modal show={isWindowOpen} onHide={windowClose} centered>
                    <Form>
                    <   Modal.Header >
                         Add Your This Month's Income 
                    </Modal.Header>
                    <Modal.Body>
                       <Form>
                            <Form.Label>
                                Income
                            </Form.Label>
                            <Form.Control
                                type="number"
                                required 
                                value={inputIncome}
                                placeholder="i.e $7000"
                                onChange={(income)=>setIncome(income.target.value)}/>
                        </Form>
                    </Modal.Body>
                    <ModalFooter>
                    <Stack direction="horizontal" gap={2}>
                        <Button onClick={saveIncome}>Save</Button>
                        <Button onClick={windowClose}>Cancel</Button>
                        </Stack>
                    </ModalFooter>
                </Form>
            </Modal>

            </>
    )
}

export default RemainingBalance;