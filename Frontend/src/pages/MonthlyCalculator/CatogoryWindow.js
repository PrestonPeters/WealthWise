import { Button, Modal, Tab, Tabs , Form, Stack} from "react-bootstrap";
import { useState } from "react";




/**
 * The following function create visual contents of the manage catogory window where user can add and remove catogories by giving 
 * catogory name as an input in the text box. Function removes or add the new catogory from the database using POST method.
 * @param param0 - isWindowopen is a state variable which informs the following function whether the button to open the catogory window
 *  has been clicked or not.
 * @param param1 - windowClose is a callback function which closes the manage catogory window.
 * @returns It returns the visual contents of the manage catogory  window which contains Form.
 */
function CatogoryWindow({isWindowOpen ,windowClose}){
        /**
         * Variables to store the data
         */
        const [inputCatogoryName, setCatogoryName] = useState('');
        const [deleteCatogoryName, setdeleteCatogoryName] = useState('');


        /**
         * The following clears the input boxes and closes the manage catogory window
         */
        const closeCatogoryWindow=()=>{
            setdeleteCatogoryName('');
            setCatogoryName('');
            windowClose(); 
        }


        /**
         * The following function add the new catogory to the database, as well as clears the input fields from 
         * the manage catogory window and closes it.
         */
        const addThisCatogory=()=>{
            if(inputCatogoryName.length===0){
                alert('Catogory Title is Required');
                return;
            }
            fetch('http://localhost:4000/addcatogories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({catogory_name:inputCatogoryName}),
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            setCatogoryName('');
            windowClose(); 
        }


        /**
         * The following function removes the given catogory from the database,clears the input fields from 
         * the manage catogory window and closes it. Above functions removes all entries of spendings from the database
         * which belongs to given catogory.
         */
        const removeThisCatogory=()=>{
            if(deleteCatogoryName.length===0){
                alert('Catogory Title is Required');
                return;
            }
            fetch('http://localhost:4000/addcatogories/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({catogory_name:deleteCatogoryName}),
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            setdeleteCatogoryName('');
            windowClose(); 
        }


        /**
         * Following code contains react boostrap components to create the form where user can input the name
         * of catogory they wish to add or remove.
         */
        return(
            <Modal show={isWindowOpen} onHide={windowClose} centered>
                <Tabs defaultActiveKey={"addcatogory"} justify>
                    <Tab eventKey={"addcatogory"} title="Add Catogory">
                        <Form>
                            <Modal.Header style={{fontWeight:'bold'}}> Add New Catogory </Modal.Header>
                            <Modal.Body>
                                <Form.Label> Title  </Form.Label> 
                                <Form.Control
                                    type="text" 
                                    value={inputCatogoryName}
                                    required
                                    placeholder="i.e Grocery"
                                    onChange={(event)=>setCatogoryName(event.target.value)}/>   
                            </Modal.Body>
                            <Modal.Footer>
                                <Stack direction="horizontal" gap={2}>
                                    <Button onClick={addThisCatogory} >Add</Button>
                                    <Button onClick={closeCatogoryWindow}>Cancel</Button>
                                </Stack>
                            </Modal.Footer>
                        </Form>
                    </Tab>
                    <Tab eventKey={"removecatogory"} title="Remove Catogory">
                        <Form>
                        <Modal.Header style={{fontWeight:'bold'}}>  Remove Existing Catogory  </Modal.Header>  
                        <Modal.Body>
                            <Form.Label> Name of catogory (case sensitive) </Form.Label>
                            <Form.Control
                                type="text" 
                                value={deleteCatogoryName}
                                required
                                placeholder="i.e Grocery"
                                onChange={(event)=>setdeleteCatogoryName(event.target.value)}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Stack direction="horizontal" gap={2}>
                                <Button onClick={removeThisCatogory} >Remove</Button>
                                <Button onClick={closeCatogoryWindow}>Cancel</Button>
                            </Stack>
                        </Modal.Footer>
                    </Form>
                </Tab>
            </Tabs>
       </Modal>
    )
}

export default CatogoryWindow;
