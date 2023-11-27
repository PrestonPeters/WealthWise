import { useState,useEffect } from "react";
import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack, Table} from "react-bootstrap";



function HistoryWindow({isWindowOpen , windowClose}){
    const [spendingList, setSpendingList]= useState([]);
    useEffect(()=>{
        const getSpendingList= async()=>{
        const spendingListResponse = await fetch('http://localhost:4000/addspendings');
        const updatedSpendingList = await spendingListResponse.json();
        setSpendingList(updatedSpendingList);
        }
        getSpendingList();
    },[]);


    return(
      <div className='use_bootstrap'>
       <Modal show={isWindowOpen} onHide={windowClose} centered>
            <Modal.Header>
                Your Expense History
            </Modal.Header>
            <Modal.Body >
                <div style={{ maxheight:'400', overflowY:'auto'}}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Catogory Name</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Date & Time</th>    
                        </tr>
                    </thead>
                    {spendingList.map((spendingElement)=>(
                            <tbody>
                            <tr>
                               <td>{spendingElement.catogory_name}</td>
                               <td>{spendingElement.expense_name}</td>
                               <td>{spendingElement.expense_amount}</td>
                               <td>{spendingElement.date}  {spendingElement.time}</td>    
                           </tr>
                       </tbody>
                    ))}   
                </Table>
                </div>
            </Modal.Body>
            <ModalFooter>
                <Button onClick={windowClose}>Close</Button>
            </ModalFooter>
            
       </Modal>

        </div>
    )
}

export default HistoryWindow;
