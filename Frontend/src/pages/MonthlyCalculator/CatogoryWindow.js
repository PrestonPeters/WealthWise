import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

function CatogoryWindow({isWindowOpen ,windowClose}){
    const [inputCatogoryName, setCatogoryName] = useState('');
    const [deleteCatogoryName, setdeleteCatogoryName] = useState('');
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
    

    return(
        <>
       <Modal show={isWindowOpen} onHide={windowClose} centered>
        <Tabs defaultActiveKey={"addcatogory"} justify>
            <Tab eventKey={"addcatogory"} title="Add Catogory">
                <Form>
                    <Modal.Header >
                         Add New Catogory 
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Title
                            </Form.Label>
                            <Form.Control
                                type="text" 
                                value={inputCatogoryName}
                                required
                                placeholder="i.e Grocery"
                                onChange={(event)=>setCatogoryName(event.target.value)}
                                
                               
                                />
                        </Form.Group>
                        <Stack direction="horizontal" gap={2}>
                        <Button onClick={addThisCatogory} >Add</Button>
                        <Button onClick={windowClose}>Cancel</Button>
                        </Stack>
                    </Modal.Body>
                </Form>
            </Tab>
            <Tab eventKey={"removecatogory"} title="Remove Catogory">
            <Form>
                    <Modal.Header >
                         Remove Existing Catogory 
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Name of catogory (case sensitive)
                            </Form.Label>
                            <Form.Control
                                type="text" 
                                value={deleteCatogoryName}
                                required
                                placeholder="i.e Grocery"
                                onChange={(event)=>setdeleteCatogoryName(event.target.value)}
                                />
                        </Form.Group>
                        <Stack direction="horizontal" gap={2}>
                        <Button onClick={removeThisCatogory} >Remove</Button>
                        <Button onClick={windowClose}>Cancel</Button>
                        </Stack>
                    </Modal.Body>
                </Form>
            </Tab>
        </Tabs>
       </Modal>
      </>  
    )
}

export default CatogoryWindow;
