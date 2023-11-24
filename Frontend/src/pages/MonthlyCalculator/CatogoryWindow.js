import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";

import { useState } from "react";

function CatogoryWindow({isWindowOpen ,windowClose,addingNewcatogory}){
    const [inputCatogoryName, setCatogoryName] = useState('');
    const [showAlert, setAlert] = useState(false);


    const addThisCatogory=()=>{
        if(inputCatogoryName.length===0){
            setAlert(true);
            return;
        }
        addingNewcatogory(inputCatogoryName);
        setCatogoryName('');
        windowClose();}

    return(
        <>
        <Modal show={showAlert} onHide={()=>setAlert(false)}>
                <Modal.Header closeButton style={{border: '3px solid red'}}>
                        <p style={{fontWeight:"bold"}}> Catogory Title is Required </p> 
                </Modal.Header>
            </Modal>
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
                                onChange={(catogory)=>setCatogoryName(catogory.target.value)}
                               
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
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>
                            Remove The Existing Catogory  
                            </Form.Label>
                        </Form.Group>
                           
                        <Stack direction="horizontal" gap={2}>
                        <Button onClick={windowClose}>Remove</Button>
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

