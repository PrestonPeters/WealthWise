import { Card } from "react-bootstrap";

function CatogoryBlock({catogoryName, total}){
    return(
        <Card>
            <Card.Body style={{backgroundColor:"wheat"}}>
                <Card.Title>
                    <div>
                        {catogoryName}
                        {total}
                    </div>
                </Card.Title>
            </Card.Body>
        </Card>

    )
}

export default CatogoryBlock;