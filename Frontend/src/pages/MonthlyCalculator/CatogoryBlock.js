import { useState } from "react";
import { Button, Card, ModalFooter, Stack ,Form,Modal} from "react-bootstrap";

function CatogoryBlocks({catogoryName,total}){
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
           
            <Card.Body style={{}}>
                <Button style={{width:'14vw', height:'15vh', alignContent:'center',background:'#554b5e'}}>
                    <p>Total:</p>
                    <h1>{total}</h1>
                </Button>
    
                <p style={{fontWeight:'bold'}}>{catogoryName}</p>
                
                    <Button onClick={spendingWindow} style={{width:'14vw', alignContent:'center'}}>Add Spending</Button>
            
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