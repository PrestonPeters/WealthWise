import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";


function HistoryWindow({isWindowOpen , windowClose}){
    return(
      <div className='use_bootstrap'>
       <Modal show={isWindowOpen} onHide={windowClose} centered>
            <Modal.Header>
                Your Expense History
            </Modal.Header>
            <ModalFooter>
                <Button onClick={windowClose}>Close</Button>
            </ModalFooter>
            
       </Modal>

        </div>
    )
}

export default HistoryWindow;
