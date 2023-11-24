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

    const [inputDescription, setDescription]= useState('');
    const[isDescriptionAlert, setDescriptionAlert]= useState(false);

    const [inputSpending, setSpending]= useState('');
    const[isAmountAlert, setAmountAlert]= useState(false);

    const addSpending=()=>{
        if(inputDescription.length===0){
            setDescriptionAlert(true);
            return;
        }
        
        if(inputSpending.length===0 || inputSpending <=0 || isNaN(inputSpending)){
            setAmountAlert(true);
            return;
        }
        setDescription('');
        setSpending('');
        closeSpendingWindow();

    }
    
    return(
        <>
             <Modal show={isDescriptionAlert || isAmountAlert } onHide={()=>setDescriptionAlert(false) || setAmountAlert(false)}>
                <Modal.Header closeButton style={{border: '3px solid red'}}>
                        <p style={{fontWeight:"bold"}}> Please Input Complete and valid Information  </p> 
                </Modal.Header>
            </Modal>
        


           <Card className="mb-4" style={{width:'15vw',alignItems:'center'}}>
            <Card.Img variant="top"  style={{backgroundColor:"teal", height:"15vh", width: "14vw", marginTop:'2%' ,borderRadius:"5px"}}></Card.Img>
           
            <Card.Body style={{}}>
                <Stack direction="horizontal" gap={5}>
                    <p className="me-auto">{catogoryName}</p>
                    <p>${total}</p>
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
                       
                            <Form.Label>
                                Description
                            </Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={inputDescription}
                                placeholder="i.e XYZ supermarket"
                                onChange={(description)=>setDescription(description.target.value)}/>
                       
                            <Form.Label>
                                Amount
                            </Form.Label>
                            <Form.Control
                                type="number"
                                required
                                value={inputSpending} 
                                placeholder="i.e 100$"
                                onChange={(amount)=>setSpending(amount.target.value)}/>
                            <Form.Label>
                                Date
                            </Form.Label>
                            <Form.Control
                                value={new Date().toLocaleDateString()}
                                />
                            <Form.Label>
                                Time
                            </Form.Label>
                            <Form.Control
                                value={new Date().toLocaleTimeString()}
                                />
                    
                    </Modal.Body>
                    <ModalFooter>
                    <Stack direction="horizontal" gap={2}>
                        <Button onClick={addSpending}>Add</Button>
                        <Button onClick={closeSpendingWindow}>Cancel</Button>
                        </Stack>
                    </ModalFooter>
                </Form>
            </Modal>

        </Card.Body>
        </Card>

    </>
    )
}

export default CatogoryBlocks;