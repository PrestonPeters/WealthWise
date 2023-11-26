import { useState } from "react";
import { Button, Card, ModalFooter, Stack ,Form,Modal} from "react-bootstrap";

function CatogoryBlocks({catogoryName,total_spending}){
    const [isSpendingWindowOpen, setSpendingWindowOpen] = useState(false);
    const spendingWindow=()=>{
        setSpendingWindowOpen(true)
    }
    const closeSpendingWindow=()=>{
        setSpendingWindowOpen(false);
    }

    const [inputDescription, setDescription]= useState('');
    const [inputSpending, setSpending]= useState('');
    const [catogory] = useState(catogoryName);
   
   
    const addSpending=()=>{
        if(inputSpending.length===0 || inputSpending <=0 || isNaN(inputSpending)){
            alert('Please Input Complete and valid Information');
            return;
        }
        fetch('http://localhost:4000/addspendings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({catogory_name:catogory,expense_name:inputDescription,expense_amount:inputSpending, date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString()}),
        })
        .then((response)=>{
            console.log(response);
        })
        .catch((error)=>{
            console.log(error);
        })
        setDescription('');
        setSpending('');
        closeSpendingWindow();

    }
    
    return(
        <>
           <Card className="mb-4" style={{width:'220px',alignItems:'center'}}>
           
            <Card.Body style={{}}>
                <Button style={{width:'200px', height:'110px', alignContent:'center',background:'#554b5e'}}>
                    <p>Total:</p>
                    <h1>${total_spending}</h1>
                </Button>
    
                <p style={{fontWeight:'bold'}}>{catogoryName}</p>
                
                    <Button onClick={spendingWindow} style={{width:'200px', alignContent:'center'}}>Add Spending</Button>
            
                <Modal show={isSpendingWindowOpen} onHide={closeSpendingWindow} centered>
                    <Form>
                    <   Modal.Header >
                         Add Your Spending 
                    </Modal.Header>
                    <Modal.Body>
                            <Form.Label>
                                Catogory
                            </Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={catogoryName}
                                style={{backgroundColor:'#d1d7e0'}}
                               />
                       
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
                                placeholder="i.e $100"
                                onChange={(amount)=>setSpending(amount.target.value)}/>
                            <Form.Label>
                                Date
                            </Form.Label>
                            <Form.Control
                                value={new Date().toLocaleDateString()}
                                style={{backgroundColor:'#d1d7e0'}}/>
                               
                            <Form.Label>
                                Time
                            </Form.Label>
                            <Form.Control
                                value={new Date().toLocaleTimeString()}
                                style={{backgroundColor:'#d1d7e0'}}
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
