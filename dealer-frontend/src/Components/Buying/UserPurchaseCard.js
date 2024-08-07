import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './userPurchaseCard.css'; // Import CSS file for styling

const UserPurchaseCard = (props) => {
    const handleAddToCart = () => {
        props.addToCart(); // Invoke the addToCart function passed as prop
        // Optionally, you can add logic here to update DB via axios post request
    };

    return (
        <div className="card-item">
            <Card style={{ width: '18rem' }}>
                <Link to={`/productdetail/${props.mechanicId}/${props.id}`}>
                    <Card.Img variant="top" src={props.pic} />
                </Link>
                
                <Card.Body>
                    <Link to={`/productdetail/${props.mechanicId}/${props.id}`} className="card-title-link">
                        <Card.Title className="card-title">{props.name}</Card.Title>
                    </Link>
                    <Card.Text>
                        {/* {props.description} */}
                        <b>Price: Rs.{props.items}</b>
                    </Card.Text>
                    <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserPurchaseCard;
