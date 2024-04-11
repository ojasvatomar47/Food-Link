import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/sign-in');
  };

  return (
    <div>
      <div>HomePage</div>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  )
}

export default HomePage