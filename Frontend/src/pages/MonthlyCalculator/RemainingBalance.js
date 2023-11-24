import { useState } from "react";
import { Button, Card, Form, Modal, Stack, ModalFooter } from "react-bootstrap";

function RemainingBalance({isWindowOpen ,windowClose, showRemainingBalance}){
    const [inputIncome, setIncome]= useState('');
    const[isAlert, setAlert]= useState(false);
    const saveIncome =()=>{
        if(inputIncome.length===0 || inputIncome<=0 || isNaN(inputIncome)){
            setAlert(true);
            return;
        }
        showRemainingBalance(inputIncome);
        setIncome('');
        windowClose();
    }
   

    return(
        <>
        <Modal show={isAlert} onHide={()=>setAlert(false)}>
                <Modal.Header closeButton style={{border: '3px solid red'}}>
                        <p style={{fontWeight:"bold"}}>Please Input Valid amount </p> 
                </Modal.Header>
            </Modal>
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