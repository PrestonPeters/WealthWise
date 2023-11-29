import { useState } from "react";
import { Button, Card, ModalFooter, Stack ,Form,Modal} from "react-bootstrap";




/**
 * the following function creates the template for the categories. The templates allow user to add
 * new spending to the particular category as well as to see the total past spending amount for the category.
 * @param param0 - categoryName is name of category assigned to particular the template
 * @param param1 - total_spending is the total past spending amount for the category. It can be 0 as user is 
 * allowed to add new categories.
 * @returns It returns the visual contents of category templates.
 */
function CategoryBlocks({categoryName,total_spending, username, refresh}){
        /**
         * variable to store state of the spending window
         */
        const [isSpendingWindowOpen, setSpendingWindowOpen] = useState(false);


        /**
         * variable to store data
         */
        const [inputDescription, setDescription]= useState('');
        const [inputSpending, setSpending]= useState('');
        const [category] = useState(categoryName);


        /**
         * The following functions opens the spending window which allow user to input their new spending
         *  with information regarding the it such as category,spending description, amount, date and time.
         */
        const spendingWindow=()=>{
            setSpendingWindowOpen(true)
        }


        /**
         * The following function clears the input boxes from the spending window and closes it.
         */
        const closeSpendingWindow=()=>{
            setDescription('');
            setSpending('');
            setSpendingWindowOpen(false);
        }


        /**
         * the following function add the new spending information to the database, as well as updates the remaining balance and 
         * total spending amount for particular category. After successful completion of above task it clears the input fields from 
         * the spending window and closes it.
         * 
         */
        const addSpending = () => {
            console.log("HERE NOW");
            if(inputSpending.length===0 || inputSpending <=0 || isNaN(inputSpending)){
                alert('Please Input Complete and valid Information');
                return;
            }
            fetch('http://localhost:4000/addspendings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({category_name:category,expense_name:inputDescription,expense_amount:inputSpending, date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString(), username:username}),
            })
            .then((response)=>{
                console.log(response);
                /*
                1. by expense_name, find the corresponding total_spending
                    - if expense_name not exist in `                    
                    <div className='cardsPanel'>
                        {categoryList.map((categoryElement)=>(<categoryBlocks categoryName={categoryElement.category_name} total_spending={categoryElement.category_total} /> ))}
                    </div>`
                    set total_spending to 0
                
                2. add the expense_amount to total_spending
                3. updating the corresponding total_spending to the new amount on web page
                */
            })
            .catch((error)=>{
                console.log(error);
            })
            refresh();
            setDescription('');
            setSpending('');
            closeSpendingWindow();
        } 


        /**
         * The following code contains react boostrap components to create the template for each category as well as spending window form.
         */
        return(
            <Card className="mb-4" style={{width:'220px',alignItems:'center'}}>
                <Card.Body style={{}}>
                    <Button style={{width:'200px', height:'110px', alignContent:'center',background:'#554b5e'}}>
                        <p>Total:</p>
                        <h2>${total_spending}</h2>
                    </Button>
                    <p style={{fontWeight:'bold'}}>{categoryName}</p>
                    <Button onClick={spendingWindow} style={{width:'200px', alignContent:'center'}}>Add Spending</Button>
                    <Modal show={isSpendingWindowOpen} onHide={closeSpendingWindow} centered>
                        <Form>
                            <Modal.Header style={{fontWeight:'bold'}}> Add Your Spending  </Modal.Header>  
                            <Modal.Body>
                                <Form.Label> Category </Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={categoryName}
                                    style={{backgroundColor:'#d1d7e0'}}/>
                                <Form.Label> Description </Form.Label>  
                                <Form.Control 
                                    type="text"
                                    required
                                    value={inputDescription}
                                    placeholder="i.e XYZ "
                                    onChange={(description)=>setDescription(description.target.value)}/>     
                                <Form.Label>  Amount  </Form.Label>     
                                <Form.Control
                                    type="number"
                                    required
                                    value={inputSpending} 
                                    placeholder="i.e $100.00"
                                    onChange={(amount)=>setSpending(amount.target.value)}/>
                                <Form.Label> Date </Form.Label>   
                                <Form.Control
                                    value={new Date().toLocaleDateString()}
                                    style={{backgroundColor:'#d1d7e0'}}/>
                                <Form.Label> Time </Form.Label>
                                <Form.Control
                                    value={new Date().toLocaleTimeString()}
                                    style={{backgroundColor:'#d1d7e0'}}/>
                                      
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
    )
}

export default CategoryBlocks;
