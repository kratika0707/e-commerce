import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { authState } = useContext(AuthContext);
  const dealerId = authState.dealerId; // Get the dealerId from authState
  const [newNotifications, setNewNotifications] = useState([]); // Track unread notifications

  useEffect(() => {
    fetchNotifications();
  }, [dealerId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dealers/${dealerId}/notifications`);
      const sortedNotifications = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedNotifications);
      setNewNotifications(sortedNotifications.filter(notification => !notification.read));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'NEW_SERVICE_REQUEST' && message.payload.dealerId === dealerId) {
        const newNotification = { ...message.payload, isNew: true };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
        setNewNotifications(prev => [...prev, newNotification]);
      }
    };

    return () => ws.close();
  }, [dealerId]);

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:5000/api/dealers/notifications/${notificationId}`, { read: true });
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
      setNewNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = formatDate(notification.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDatee = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(); // Adjust formatting as needed
    }
  };




  return (
    <>
    {/* <div>
      <h2>Notifications</h2>
      {notifications.map((notification, index) => (
        <div
          key={index}
          style={{ backgroundColor: newNotifications.some(notif => notif._id === notification._id) ? 'yellow' : 'white' }}
        >
          <p>{notification.message}</p>
          <Link to={`${notification.link}/${notification.serviceId}`} onClick={() => handleNotificationClick(notification._id)}>
            View Service Request
          </Link>
        </div>
      ))}
    </div> */}
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', margin: '10px auto', width: '70%' }}>
      <h2 style={{ margin: '2%', fontSize: '2.5rem' }}>Notifications</h2>
      <div style={{ width: '100%', overflowY: 'auto', margin: '1%' }}>
        {Object.keys(groupedNotifications).map((date, index) => (
          <div key={index} style={{ marginBottom: '20px', position: 'relative' }}>
            <h3 style={{ marginBottom: '20px', color: 'black', fontSize: '1.15rem', textAlign: 'center', borderRadius: '20px', display: 'inline-block', padding: '5px 10px', backgroundColor: 'lightgray', paddingLeft: '1.5%', paddingRight: '1.5%' }}>
              {formatDatee(date)}
            </h3>
            <div style={{ border: '1px solid black', paddingBottom: '10px', paddingLeft: '15px' }}>
              {groupedNotifications[date].map((notification, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: notification.read ? 'white' : 'yellow', padding: '10px', marginBottom: '5px', borderBottom: '1px solid grey' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontWeight: 'bold', marginRight: '20px' }}>{formatTime(notification.createdAt)}</p>
                    <div>
                      <p>{notification.message}</p>
                      <Link to={`${notification.link}/${notification.serviceId}`} onClick={() => handleNotificationClick(notification._id)}>
                        View Service Request
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Notification;
