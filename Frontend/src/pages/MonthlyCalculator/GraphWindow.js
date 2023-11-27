import { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";
import Chart from "react-google-charts";
function GraphWindow({ isWindowOpen, windowClose }) {
    const [pieChartData, setPieChartData] = useState([["Catogory name", "catogory total"]]);
    useEffect(()=>{
        const getUpdatedCatogoryList= async()=>{
        const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
        const updatedcatogoryList = await catogoryListResponse.json();
        setPieChartData([...pieChartData, ...updatedcatogoryList.map((catogoryElement)=> [catogoryElement.catogory_name, catogoryElement.catogory_total])]);
        }
        getUpdatedCatogoryList();
    },[]);

    const pieChartOptions={
        title:"Your spendings according to catogories",
        pieHole: 0.4,
        is3D: false

    }
      
    return(
      <div className='use_bootstrap'>
       <Modal size="lg"  show={isWindowOpen} onHide={windowClose} centered>
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
                    <Modal.Body style={{alignItems:'center'}}>
                        <Chart 
                        chartType="PieChart"
                        width="100%"
                        height="100%"
                        data={pieChartData}
                        options={pieChartOptions}
                        />
                       
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
