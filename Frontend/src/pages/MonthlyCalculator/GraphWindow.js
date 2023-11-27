import { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, Tab, Tabs , Form, Stack} from "react-bootstrap";
import { PieChart } from '@mui/x-charts';

function GraphWindow({ isWindowOpen, windowClose }) {
  const [chartData, setChartData]= useState([]);
  useEffect(()=>{
    const getUpdatedCatogoryList= async()=>{
    const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
    const updatedcatogoryList = await catogoryListResponse.json();
    setChartData(updatedcatogoryList.map((element,index)=>({
      id: index,
      label: element.catogory_name,
      value:element.catogory_total
    })))
    }
    getUpdatedCatogoryList();
},[]);

  
    return(
      <div className='use_bootstrap'>
       <Modal size="lg"  show={isWindowOpen} onHide={windowClose} centered>
        <Tabs defaultActiveKey={"barGraph"} justify>
            <Tab eventKey={"barGraph"} title="Bar Graph">
                    <Modal.Header >
                    Compare Your Daily Spending Through Visualization
                    </Modal.Header>
                    <Modal.Body style={{maxWidth:'800px', overflowX:'auto'}}>          
                    </Modal.Body>
                    <ModalFooter>
                    <Button onClick={windowClose}>Close</Button>
                    </ModalFooter>
                   
                
            </Tab>
            <Tab eventKey={"pieChart"} title="Pie Chart">
    
                    <Modal.Header>
                        Compare Your Monthly Spending Through Using Pie Chart 
                    </Modal.Header>
                    <Modal.Body style={{alignItems:'center'}}>
                        <PieChart
                        series={[
                          {
                            data: chartData,
                            innerRadius: 70,
                            outerRadius: 200,
                            paddingAngle: 1.5,
                            startAngle: -180,
                            endAngle: 180,
                            cornerRadius:5



                          }
                        ]} />
                       
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
