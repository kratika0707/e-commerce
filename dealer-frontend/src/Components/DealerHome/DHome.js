import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext'; // Adjust the import path
import { useParams } from 'react-router-dom';
const DHome = () => {
  const { dealerId } = useParams();

  const { authState } = useContext(AuthContext);

  return (
    <div>
      {authState.isAuthenticated ? (
        <h1>Welcome Dealer {dealerId}</h1>
      ) : (
        <h1>Not authenticated</h1>
      )}
    </div>
  );
};

export default DHome;
