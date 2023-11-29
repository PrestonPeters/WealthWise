import { useState,useEffect } from "react";
import { Button, Modal, ModalFooter, Table} from "react-bootstrap";




/**
 * The following function create visual contents of the history window, which inclueds history table where user can observe
 * and analyse their past spendings. The history table has contains five columes- category name(in which category user have made spending) , 
 * spending description(little information about the spending), amount (the total amount spent), date and time. 
 * @param param0 - isWindowOpen is a state variable which informs the following function whether the button to open the history window
 * has clicked or not.
 * @param param1 - windowClose is a callback function which closes the history window.
 * @returns - It retuen the history table of user's spendings.
 */
function HistoryWindow({isWindowOpen , windowClose}){
        /**
         * Varible to store all spending history retrived from the database.
         */
        const [spendingList, setSpendingList]= useState([]);

        /**
         * Thw useEffect function retrives all the spending entries from databse everytime webpage is loaded and
         *  saves the data in the varible 'spendingList'
         */
        useEffect(()=>{
            const getSpendingList= async()=>{
                const spendingListResponse = await fetch('http://localhost:4000/addspendings');
                const updatedSpendingList = await spendingListResponse.json();
                setSpendingList(updatedSpendingList);
            }
            getSpendingList();
        },[]);

        /**
         * The following code comtains react boostrap componenets which creates visual contents of the history window. 
         * 
         */
        return(
            <Modal size="lg"  show={isWindowOpen}  onHide={windowClose} centered>
                <Modal.Header style={{fontWeight:'bold'}}> Your Expense History </Modal.Header>
                <Modal.Body style={{maxHeight:'500px', overflowY:'auto'}}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date</th>   
                                <th>Time</th> 
                            </tr>
                        </thead>
                        {spendingList.map((spendingElement)=>(
                            <tbody>   
                                <tr>
                                    <td>{spendingElement.category_name}</td>
                                    <td>{spendingElement.expense_name}</td>
                                    <td>{spendingElement.expense_amount}</td>
                                    <td>{spendingElement.date}</td>
                                    <td>{spendingElement.time}</td>  
                                </tr>
                            </tbody>
                        ))}   
                    </Table>             
                </Modal.Body>
                <ModalFooter>
                    <Button onClick={windowClose}>Close</Button>
                </ModalFooter>      
            </Modal>       
        )
}

export default HistoryWindow;
