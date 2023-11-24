import { useState } from "react";
import { Button, Card, ModalFooter, Stack ,Form,Modal} from "react-bootstrap";

function CatogoryBlocks({catogoryKey,catogoryName,total}){
    const [isSpendingWindowOpen, setSpendingWindowOpen] = useState(false);
    const spendingWindow=()=>{
        setSpendingWindowOpen(true)
    }
    const closeSpendingWindow=()=>{
        setSpendingWindowOpen(false);
    }
    
    return(
           <Card className="mb-4" style={{width:'15vw',alignItems:'center'}}>
            <Card.Img variant="top"  style={{backgroundColor:"teal", height:"15vh", width: "14vw", marginTop:'2%' ,borderRadius:"5px"}}></Card.Img>
           
            <Card.Body style={{}}>
                <Stack direction="horizontal" gap={5}>
                    <h3 className="me-auto">{catogoryName}</h3>
                    <h3>${total}</h3>
                </Stack>
               
                <div className="d-grid gap-1">
                    <Button onClick={spendingWindow}>Add Spending</Button>
                </div>
                <Modal show={isSpendingWindowOpen} onHide={closeSpendingWindow} centered>
                    <Form>
                    <   Modal.Header >
                         Add Your Spending 
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Description
                            </Form.Label>
                            <Form.Control
                                type="text"
                                required 
                                placeholder="i.e XYZ supermarket"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Amount
                            </Form.Label>
                            <Form.Control
                                type="number"
                                required 
                                placeholder="i.e 100$"/>
                        </Form.Group>
                    
                    </Modal.Body>
                    <ModalFooter>
                    <Stack direction="horizontal" gap={2}>
                        <Button onClick={closeSpendingWindow}>Add</Button>
                        <Button onClick={closeSpendingWindow}>Cancel</Button>
                        </Stack>
                    </ModalFooter>
                </Form>
            </Modal>

        </Card.Body>
        </Card>
    )
}

export default CatogoryBlocks;