import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";

function GraphWindow({isWindowOpen , windowClose}){
    return(
      <div className='use_bootstrap'>
       <Modal show={isWindowOpen} onHide={windowClose} centered>
        <Tabs defaultActiveKey={"barGraph"} justify>
            <Tab eventKey={"barGraph"} title="Bar Graph">
                    <Modal.Header >
                    Compare Your Daily Spending Through Visualization
                    </Modal.Header>
                    <Modal.Body>
                    
                    </Modal.Body>
                    <ModalFooter>
                    <Button onClick={windowClose}>Close</Button>
                    </ModalFooter>
                   
                
            </Tab>
            <Tab eventKey={"pieChart"} title="Pie Chart">
    
                    <Modal.Header>
                        Compare Your Monthly Spending Through Visualization 
                    </Modal.Header>
                    <Modal.Body>
                    </Modal.Body>
                    <ModalFooter>
                    <Button onClick={windowClose}>Close</Button>
                    </ModalFooter>
                    
            </Tab>
        </Tabs>
       </Modal>
        </div>
    )
}

export default GraphWindow;
