import { Button, Modal, Tab, Tabs , Form, Stack} from "react-bootstrap";
import { useState } from "react";




/**
 * The following function create visual contents of the manage category window where user can add and remove categories by giving 
 * category name as an input in the text box. Function removes or add the new category from the database using POST method.
 * @param param0 - isWindowopen is a state variable which informs the following function whether the button to open the category window
 *  has been clicked or not.
 * @param param1 - windowClose is a callback function which closes the manage category window.
 * @returns It returns the visual contents of the manage category  window which contains Form.
 */
function CategoryWindow({isWindowOpen ,windowClose, username, refresh}){
        /**
         * Variables to store the data
         */
        const [inputCategoryName, setCategoryName] = useState('');
        const [deleteCategoryName, setdeleteCategoryName] = useState('');


        /**
         * The following clears the input boxes and closes the manage category window
         */
        const closeCategoryWindow=()=>{
            refresh();
            setdeleteCategoryName('');
            setCategoryName('');
            windowClose(); 
        }


        /**
         * The following function add the new category to the database, as well as clears the input fields from 
         * the manage category window and closes it.
         */
        const addThisCategory=()=>{
            if(inputCategoryName.length===0){
                alert('Category Title is Required');
                return;
            }
            fetch('http://localhost:4000/addcategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({category_name:inputCategoryName, username:username}),
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            refresh();
            setCategoryName('');
            windowClose(); 
        }


        /**
         * The following function removes the given category from the database,clears the input fields from 
         * the manage category window and closes it. Above functions removes all entries of spendings from the database
         * which belongs to given category.
         */
        const removeThisCategory=()=>{
            if(deleteCategoryName.length===0){
                alert('Category Title is Required');
                return;
            }
            fetch('http://localhost:4000/addcategories/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({category_name:deleteCategoryName, username:username}),
            })
            .then((response)=>{
                console.log(response);
            })
            .catch((error)=>{
                console.log(error);
            })
            refresh();
            setdeleteCategoryName('');
            windowClose();
        }


        /**
         * Following code contains react boostrap components to create the form where user can input the name
         * of category they wish to add or remove.
         */
        return(
            <Modal show={isWindowOpen} onHide={windowClose} centered>
                <Tabs defaultActiveKey={"addCategory"} justify>
                    <Tab eventKey={"addCategory"} title="Add Category">
                        <Form>
                            <Modal.Header style={{fontWeight:'bold'}}> Add New Category </Modal.Header>
                            <Modal.Body>
                                <Form.Label> Title  </Form.Label> 
                                <Form.Control
                                    type="text" 
                                    value={inputCategoryName}
                                    required
                                    placeholder="i.e Grocery"
                                    onChange={(event)=>setCategoryName(event.target.value)}/>   
                            </Modal.Body>
                            <Modal.Footer>
                                <Stack direction="horizontal" gap={2}>
                                    <Button onClick={addThisCategory} >Add</Button>
                                    <Button onClick={closeCategoryWindow}>Cancel</Button>
                                </Stack>
                            </Modal.Footer>
                        </Form>
                    </Tab>
                    <Tab eventKey={"removeCategory"} title="Remove Category">
                        <Form>
                        <Modal.Header style={{fontWeight:'bold'}}>  Remove Existing Category  </Modal.Header>  
                        <Modal.Body>
                            <Form.Label> Name of Category (case sensitive) </Form.Label>
                            <Form.Control
                                type="text" 
                                value={deleteCategoryName}
                                required
                                placeholder="i.e Grocery"
                                onChange={(event)=>setdeleteCategoryName(event.target.value)}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Stack direction="horizontal" gap={2}>
                                <Button onClick={removeThisCategory} >Remove</Button>
                                <Button onClick={closeCategoryWindow}>Cancel</Button>
                            </Stack>
                        </Modal.Footer>
                    </Form>
                </Tab>
            </Tabs>
       </Modal>
    )
}

export default CategoryWindow;
