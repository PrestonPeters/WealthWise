import { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, Tab, Tabs} from "react-bootstrap";
import { BarChart, PieChart } from '@mui/x-charts';



/**
 * The following function created visual contenets of the graph window, which inclues bar graph and pie chart,
 *  where user can analyse their spending through graphical visualization. The bar graph represents the spending 
 *  history of the user catogorized by dates, while donut/pie chart catogorizes spending history by catogories.
 * @param param0 - isWindowopen is a state variable which informs the following function whether the button to open the graph window
 *  has been clicked or not.
 * @param param1 - windowClose is a callback function which closes the graph window
 * @returns It returns the visual contents of the graph window
 */

function GraphWindow({ isWindowOpen, windowClose }) {
        /**
         * Variables to store data retrived from the database
         */
        const [xAxisDate,setXAxisDate]= useState([]);
        const [yAxisAmount,setYAxisAmount]= useState([]);
        const [chartData, setChartData]= useState([]);


        /**
         * The following useEffect function retrieves the spending history from the database by considering date as 
         *  an aspect to catogorize the history. Following function gets executed everytime webpage is loaded.
         * It saves the dates in the variable 'vAxisDate' and saves the total spending amount for that date in the varible 'yAxisAmount'.
         */
        useEffect(()=>{
            const getUpdatedSpendingList= async()=>{
                const spendingListResponse = await fetch('http://localhost:4000/addspendings/date');
                const updatedSpendingList = await spendingListResponse.json();
                setXAxisDate((xAxisDate)=>[...xAxisDate,...updatedSpendingList.map((spendingElement)=>spendingElement.date)]);
                setYAxisAmount((yAxisAmount)=>[...yAxisAmount,...updatedSpendingList.map((spendingElement)=>spendingElement.total_spending)]);
            }
            getUpdatedSpendingList();
        },[]);

        
        /**
         * The following useEffect function retrieves the spending history from the database by considering catogories as 
         *  an aspect to catogorize the history.Following function gets executed everytime webpage is loaded. It saves the data in the 
         *  variable 'chartData'
         */
        useEffect(()=>{
            const getUpdatedCatogoryList= async()=>{
                const catogoryListResponse = await fetch('http://localhost:4000/addcatogories');
                const updatedcatogoryList = await catogoryListResponse.json();
                setChartData(updatedcatogoryList.map((element,index)=>({
                    id: index,
                    label: element.catogory_name,
                    value:element.catogory_total,   
                })))
            }
            getUpdatedCatogoryList();
        },[]);


        /**
         * The follwing code contains react boostrap as well as matrial ui components to create visual contents of the graph window. It creates bar graph which contains
         * dates on the x-axis and amount on the y-axis, while donut/pie chart show total spending amounts for each catogory. 
         */
        return(
            <Modal size="lg"  show={isWindowOpen} onHide={windowClose} centered>
                <Tabs defaultActiveKey={"barGraph"} justify>
                    <Tab eventKey={"barGraph"} title="Bar Graph">
                        <Modal.Header style={{fontWeight:'bold'}}> Compare Your Daily Spending Through Bar Graph </Modal.Header>
                        <Modal.Body style={{maxWidth:'800px',maxHeight:'800px', overflowX:'auto', overflowY:'auto'}}> 
                            <BarChart
                                xAxis={[{scaleType:'band',data:xAxisDate }]}
                                series={[{data:yAxisAmount}]}/>         
                        </Modal.Body>
                        <ModalFooter>
                            <Button onClick={windowClose}>Close</Button>
                        </ModalFooter>              
                    </Tab>
                    <Tab eventKey={"pieChart"} title="Pie Chart">
                        <Modal.Header style={{fontWeight:'bold'}}> Compare Your Monthly Spending Through Using Pie Chart </Modal.Header>
                        <Modal.Body>
                            <PieChart
                                series={[{
                                    data: chartData,
                                    innerRadius: 60,
                                    outerRadius: 180,
                                    paddingAngle: 1.5,
                                    startAngle: -180,
                                    endAngle: 180,
                                    cornerRadius:5,
                                    arcLabel: (catogory) => `$${catogory.value}`
                                }]} />                       
                        </Modal.Body>
                        <ModalFooter>
                            <Button onClick={windowClose}>Close</Button>
                        </ModalFooter>                  
                    </Tab>
                </Tabs>
            </Modal>    
       )
}

export default GraphWindow;
