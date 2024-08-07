import React, { useState, useEffect } from 'react';
import image from '../../Assets/3331465.jpg';
import axios from 'axios';
import Modal from 'react-modal';
import Login from '../Login/Login';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../../Redux/Features/userslice';

Modal.setAppElement('#root');

const Booking = () => {
  const urlback = 'http://localhost:5000/api';

  const [phone, setPhone] = useState('');
  const [issue, setIssue] = useState('');
  const [carmodel, setCarModel] = useState('');
  const [enginemodel, setEngineModel] = useState('');
  const [detail,setDetail] =useState('');
  const [useri, setUseri] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const userId = useSelector((state) => state.user.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    // Get user's location on component mount
    getLocation();
  }, []);

  function getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(loc);
            resolve(loc);
          },
          (error) => {
            setError('Unable to retrieve your location.');
            reject(error);
          },
          { timeout: 10000 }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        reject(new Error('Geolocation is not supported by your browser.'));
      }
    });
  }
  useEffect(() => {
    if (isAuthenticated && user) {
      setPhone(`+${user}`);
    }
  }, [isAuthenticated, user]);
    
  async function submit(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      setModalIsOpen(true);
      return;
    }

    try {
      const loc = await getLocation();
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toLocaleTimeString();

      const data = {
        userid: userId,
        location: loc,
        carmodel,
        enginemodel,
        issue,
        detail,
        dateofservice: date,
        timeofservice: time,
      };

      setFormSubmitted(true);
      await axios.post(`${urlback}/services/book`, data);

      setPhone('');
      setCarModel('');
      setEngineModel('');
      setIssue('');
      setDetail('');
      setLocation({ latitude: null, longitude: null });
      setSuccessMessage('Request submitted successfully!');

      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (e) {
      console.error('Error submitting form:', e);
    }
  }

  function handleLoginSuccess(loggedInUser) {
    setUseri(loggedInUser);
    localStorage.setItem('userId', JSON.stringify(loggedInUser));
    setModalIsOpen(false);
    if (formSubmitted) {
      submit(new Event('submit'));
    }
  }
  const carModels = ['Honda Civic', 'Honda Accord' ,'Toyota Camry','Toyota Corolla', 'Ford Fusion', 'Ford Focus']; // Example car models
  const hondaCivicModels = ['1.5L Turbo', '2.0L VTEC', '1.8L Hybrid'];
  const hondaAccordModels = ['2.0L Turbo', '1.5L VTEC', '3.5L V6'];
  const toyotaCamryModels = ['2.5L Inline-4', '3.5L V6', 'Hybrid 2.5L']; 
  const toyotaCorollaModels= ['1.8L Inline-4', '2.0L Hybrid', '1.6L Diesel'];
  const fordFusionModels = ['2.5L Inline-4', '2.0L EcoBoost', 'Hybrid 2.0L']; 
  const fordFocusModels = ['1.0L EcoBoost', '2.0L Inline-4', 'Electric'];
  
  const issues = [
    'Car Breakdown',
  'Battery Issue',
  'Brake Issue',
  'Tire Issue',
  'Engine Overheating',
  'Fuel Leak',
  'Electrical Malfunction',
  'Transmission Failure',
  'Steering Problems',
  'Suspension Issues',
  'Coolant System Problems',
  'Lockout (Keys Locked Inside)'
  ]; 
  return (
    <>
      <div className="container1" style={{ position: 'relative', height: '120vh', width: '100vw', margin: 0, padding: 0 }}>
        <img src={image} alt="car" style={{ position: 'absolute', top: 0, left: 0, height: '90%', width: '100vw', objectFit: 'cover', zIndex: '0' }} />
      </div>
      <div  style={{height:'150vh', marginLeft:'5%'}}>
      <div>
        {successMessage && (
          <div className="alert alert-success mt-3" role="alert">
            {successMessage}
          </div>
        )}
        <div style={{ top: 0, left: 0, width: '100%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <h2 className='about' style={{ color: 'black', fontSize: '3vw' }}>Book a Service</h2>
        </div>
        <p style={{ marginLeft: '5%', color: 'black', fontSize: '1.5em', marginBottom: '2%' }}>In urgent need? Book our service now and get immediate assistance wherever you are.</p>
      </div>
      <div  style={{ height: '100vh' }}>
        <form onSubmit={submit}>
          <div className="mb-3" style={{ width: '50%' }}>
            <label htmlFor="exampleInputPhone" className="form-label">Contact Number</label>
            <input
              type="text"
              
              value={phone}
              readOnly={isAuthenticated}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
              placeholder='+91 00000-00000'
              id="exampleInputPhone"
              style={{ height: '50px', fontSize: '100%' }}
            />
          </div>
          <div className="mb-3" style={{ width: '50%' }}>
              <label htmlFor="exampleInputModel" className="form-label">Your Car Model</label>
              <select
                className="form-control"
                value={carmodel}
                onChange={(e) => setCarModel(e.target.value)}
                style={{ height: '50px', fontSize: '100%' }}
              >
                <option value="">Select Car Model</option>
                {carModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            {carmodel && (
              <div className="mb-3" style={{ width: '50%' }}>
                <label htmlFor="exampleInputEngineModel" className="form-label">Your Engine Model</label>
                <select
                  className="form-control"
                  value={enginemodel}
                  onChange={(e) => setEngineModel(e.target.value)}
                  style={{ height: '50px', fontSize: '100%' }}
                >
                  <option value="">Select Engine Model</option>
                  {carmodel === 'Honda Civic' && hondaCivicModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {carmodel === 'Honda Accord' && hondaAccordModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {carmodel === 'Toyota Camry' && toyotaCamryModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {carmodel === 'Toyota Corolla' && toyotaCorollaModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {carmodel === 'Ford Fusion' && fordFusionModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {carmodel === 'Ford Focus' && fordFocusModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-3" style={{ width: '50%' }}>
              <label htmlFor="exampleInputIssue" className="form-label">Your Issue</label>
              <select
                className="form-control"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                style={{ height: '50px', fontSize: '100%' }}
              >
                <option value="">Select Issue</option>
                {issues.map((issue) => (
                  <option key={issue} value={issue}>{issue}</option>
                ))}
              </select>
            </div>
          <div className="mb-3" style={{ width: '70%' }}>
            <label htmlFor="exampleInputIssue" className="form-label">Other Details</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="form-control"
              id="exampleInputIssue"
              rows="4"
              placeholder='Other details'
              style={{ minHeight: '80px', resize: 'vertical', fontSize: '100%' }}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '40px', width: 'auto', marginTop: '1%', lineHeight: '5px', backgroundColor:'#0078d6', fontWeight:'500' }}>Submit</button>
        </form>
      </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
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
        <Login
          phone={phone}
          urlback={urlback}
          onLoginSuccess={handleLoginSuccess}
        />
      </Modal>
    </>
  );
}

export default Booking;
