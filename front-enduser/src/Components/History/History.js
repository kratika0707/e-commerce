import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Login from '../Login/Login';
import { useSelector, useDispatch } from 'react-redux';

import { login, logout } from '../../Redux/Features/userslice';
import { Link } from 'react-router-dom';

const History = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [serviceHistory, setServiceHistory] = useState([]);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const user = useSelector(state => state.user.user);
  const userId = useSelector(state => state.user.userId);
  const [hoveredCard, setHoveredCard] = useState(null);
  const dispatch = useDispatch();



  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      console.log(isAuthenticated)
      console.log(user);
      console.log(userId);
      fetchServiceHistory(userId);
    }
  }, [isAuthenticated, userId]);

  const fetchServiceHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/services/history/${userId}`);
      const reversedServiceHistory = response.data.reverse();

      setServiceHistory(reversedServiceHistory);
    } catch (error) {
      console.error('Error fetching service history:', error);
    }
  };

  return (
    <>
      
      {/* <div className="container" style={{ minHeight: '100vh', marginTop: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '4%', fontSize: '2.4rem', marginTop: '4%' }}>Service History</h1>
        {serviceHistory.length > 0 ? (
          serviceHistory.map(service => (
            <div
              key={service._id}
              className="card"
              style={{
                width: '85%',
                marginBottom: '20px',
                textAlign: 'center',
                color: 'black',
                boxShadow: hoveredCard === service._id ? '0 4px 16px rgba(0,0,0,0.6)' : '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'box-shadow 0.3s ease-in-out',
                border: 'none',
              }}
              onMouseEnter={() => setHoveredCard(service._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-header d-flex justify-content-between" style={{ backgroundColor: '#d4e3ff', padding: '10px', borderBottom: '1px solid #ccc', color: 'black' }}>
                <p style={{ fontSize: '1rem', margin: 0 }}>Service Date: {new Date(service.dateofservice).toLocaleDateString()}</p>
                <p style={{ fontSize: '1rem', margin: 0 }}>Service Id: #{service._id}</p>
              </div>
              <div className="card-body" style={{ textAlign: 'left', marginLeft: '20px' }}>
                <p><strong>Car Model:</strong> {service.carmodel}</p>
                <p><strong>Engine Model:</strong> {service.enginemodel}</p>
                <p><strong>Issue:</strong> {service.issue}</p>
                <Link to={`/${userId}/user/service/${service._id}`} className="btn" style={{ padding: '10px 15px',  backgroundColor: '#0078d6', color: 'white', fontWeight: '500' }}>View details</Link>
              </div>
            </div>

          ))
        ) : (
          <p>No services found for this mechanic.</p>
        )}
      </div> */}


      <div className="container" style={{ minHeight: '100vh', marginTop: '6%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ marginBottom: '4%', fontSize: '2.4rem', color: 'black', fontWeight: '800' }}>Service History</h1>
      {serviceHistory.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            width: '100%',
            padding: '0 5%',
          }}
        >
          {serviceHistory.map(service => (
            <div
              key={service._id}
              className="card"
              style={{
                textAlign: 'center',
                color: 'black',
                boxShadow: hoveredCard === service._id ? '0 4px 16px rgba(0,0,0,0.6)' : '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'box-shadow 0.3s ease-in-out',
                border: 'none',
                width: '100%',
              }}
              onMouseEnter={() => setHoveredCard(service._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="card-header d-flex" style={{ backgroundColor: '#d4e3ff', padding: '10px', borderBottom: '1px solid #ccc', color: 'black', justifyContent:'space-between' }}>
                <p style={{ fontSize: '1rem', margin: 0, color: 'black' }}>Date: {new Date(service.dateofservice).toLocaleDateString()}</p>
                <p style={{ fontSize: '1rem', margin: 0, color: 'black' }}>Id: #{service._id.slice(-6)}</p>
              </div>
              <div className="card-body" style={{ textAlign: 'left', padding: '10px 20px' }}>
                <p style={{ color: 'black' }}><strong>Car Model:</strong> {service.carmodel}</p>
                <p style={{ color: 'black' }}><strong>Engine Model:</strong> {service.enginemodel}</p>
                <p style={{ color: 'black' }}><strong>Issue:</strong> {service.issue}</p>
                <Link to={`/${userId}/user/service/${service._id}`} className="btn text-uppercase" style={{ padding: '8px 20px', backgroundColor: '#0078d6', color: 'white', fontWeight: '600' }}>View details</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No services found for you.</p>
      )}
    </div>


      
      <Modal
        isOpen={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <Login />
      </Modal>
    </>
  );
};

export default History;



