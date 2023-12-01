import { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, Tab, Tabs} from "react-bootstrap";
import { BarChart, PieChart } from '@mui/x-charts';



/**
 * The following function created visual contenets of the graph window, which inclues bar graph and pie chart,
 *  where user can analyse their spending through graphical visualization. The bar graph represents the spending 
 *  history of the user categorized by dates, while donut/pie chart categorizes spending history by categories.
 * @param param0 - isWindowopen is a state variable which informs the following function whether the button to open the graph window
 *  has been clicked or not.
 * @param param1 - windowClose is a callback function which closes the graph window
 * @returns It returns the visual contents of the graph window
 */

function GraphWindow({ isWindowOpen, windowClose, username }) {
        /**
         * Variables to store data retrived from the database
         */
        const [xAxisDate,setXAxisDate]= useState([]);
        const [yAxisAmount,setYAxisAmount]= useState([]);
        const [chartData, setChartData]= useState([]);

        /**
         * The following useEffect function retrieves the spending history from the database by considering date as 
         *  an aspect to categorize the history and selects the last 7 entries to show on the graph. The date first appear in the graph on the left
         *  will be the most recent date, you added spending.Following function gets executed everytime webpage is loaded.
         * It saves the dates in the variable 'xAxisDate' and saves the total spending amount for that date in the varible 'yAxisAmount'.
         */

        useEffect(()=>{
            fetch('http://localhost:4000/getspendings/date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username}),
            })
            .then((response)=>{
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return [];
                }
                return response.json();
            })

            .then((data)=>{
                console.log(data);
                setXAxisDate(data.map((element)=>(element.date)));
                setYAxisAmount(data.map((element)=>(element.total_spending)));
            });
        }, [isWindowOpen, username]);

        
        /**
         * The following useEffect function retrieves the spending history from the database by considering categories as 
         *  an aspect to categorize the history.Following function gets executed everytime webpage is loaded. It saves the data in the 
         *  variable 'chartData'
         */

        useEffect(()=>{
            fetch('http://localhost:4000/getcategories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: username}),
            })

            .then((response)=>{
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return [];
                }
                return response.json();
            })

            .then((data)=> {
                console.log(data);
                let filtered = data.filter((element)=>{return element.category_total !== 0});
                setChartData(filtered.map((element)=>({name:element.category_name, value:element.category_total})));
            });
        },[isWindowOpen, username]);


        useEffect(()=>{console.log(chartData);},[chartData]);

        /**
         * The follwing code contains react boostrap as well as matrial ui components to create visual contents of the graph window. It creates bar graph which contains
         * dates on the x-axis and amount on the y-axis, while donut/pie chart show total spending amounts for each category. 
         */
        return(
            <Modal size="lg"  show={isWindowOpen} onHide={windowClose} centered>
                <Tabs justify>
                    <Tab eventKey={"barGraph"} title="Bar Graph">
                        <Modal.Header style={{fontWeight:'bold'}}> Compare Your Spendings Through Bar Graph </Modal.Header>
                        <Modal.Body style={{maxWidth:'800px',maxHeight:'550px', overflowX:'auto'}}> 
                            <h2>Your Spending Graph</h2>
                            {xAxisDate.length > 0 && yAxisAmount.length > 0 && 
                            <BarChart
                                xAxis={[{scaleType:'band',data:xAxisDate,label:'Date' }]}
                                series={[{data:yAxisAmount, label:'Total Spending'}]}
                                height={500}/>}
                        </Modal.Body>
                        <ModalFooter>
                            <Button onClick={windowClose}>Close</Button>
                        </ModalFooter>              
                    </Tab>
                    <Tab eventKey={"pieChart"} title="Pie Chart">
                        <Modal.Header style={{fontWeight:'bold'}}> Compare Your Spendings Through Using Pie Chart </Modal.Header>
                        <Modal.Body style={{maxWidth:'800px',maxHeight:'550px', overflowX:'auto'}}>
                            <h2>Your Spending Chart</h2>
                            {chartData.length > 0 && 
                            <PieChart
                                height={500}
                                series={[{
                                    data: chartData,
                                    innerRadius: 60,
                                    outerRadius: 180,
                                    paddingAngle: 1,
                                    startAngle: -180,
                                    endAngle: 180,
                                    cornerRadius:5,
                                    arcLabel: (category) => `${category.name}`
                                }]} />}
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
